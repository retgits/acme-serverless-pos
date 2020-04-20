package main

import (
	"mime"
	"os"
	"path"
	"path/filepath"

	"github.com/pulumi/pulumi-aws/sdk/v2/go/aws/s3"
	"github.com/pulumi/pulumi/sdk/v2/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v2/go/pulumi/config"
)

// Tags are key-value pairs to apply to the resources created by this stack
type Tags struct {
	// Author is the person who created the code, or performed the deployment
	Author pulumi.String

	// Feature is the project that this resource belongs to
	Feature pulumi.String

	// Team is the team that is responsible to manage this resource
	Team pulumi.String

	// Version is the version of the code for this resource
	Version pulumi.String
}

// S3Config contains the key-value pairs for the configuration of AWS S3 in this stack
type S3Config struct {
	// The S3 bucket to upload the compiled the website to
	S3Bucket string `json:"bucket"`
}

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Read the configuration data from Pulumi.<stack>.yaml
		conf := config.New(ctx, "awsconfig")

		// Create a new Tags object with the data from the configuration
		var tags Tags
		conf.RequireObject("tags", &tags)

		// Create a new DynamoConfig object with the data from the configuration
		var s3Config S3Config
		conf.RequireObject("s3", &s3Config)

		// Create a map[string]pulumi.Input of the tags
		// the first four tags come from the configuration file
		// the last two are derived from this deployment
		tagMap := make(map[string]pulumi.Input)
		tagMap["Author"] = tags.Author
		tagMap["Feature"] = tags.Feature
		tagMap["Team"] = tags.Team
		tagMap["Version"] = tags.Version
		tagMap["ManagedBy"] = pulumi.String("Pulumi")
		tagMap["Stage"] = pulumi.String(ctx.Stack())

		// Create a bucket and expose a website index document
		siteBucket, err := s3.NewBucket(ctx, s3Config.S3Bucket, &s3.BucketArgs{
			Tags: pulumi.Map(tagMap),
			Website: s3.BucketWebsiteArgs{
				IndexDocument: pulumi.String("index.html"),
			},
		})
		if err != nil {
			return err
		}

		wd, err := os.Getwd()
		if err != nil {
			return err
		}

		siteDir := filepath.Join(wd, "..", "src")

		err = filepath.Walk(siteDir,
			func(fpath string, info os.FileInfo, err error) error {
				if err != nil {
					return err
				}
				if !info.IsDir() {
					name := info.Name()
					if _, err := s3.NewBucketObject(ctx, name, &s3.BucketObjectArgs{
						Bucket:      siteBucket.ID(),
						Source:      pulumi.NewFileAsset(fpath),
						ContentType: pulumi.String(mime.TypeByExtension(path.Ext(name))), // set the MIME type of the file
					}); err != nil {
						return err
					}
				}
				return nil
			})
		if err != nil {
			return err
		}

		// Set the access policy for the bucket so all objects are readable.
		if _, err := s3.NewBucketPolicy(ctx, "bucketPolicy", &s3.BucketPolicyArgs{
			Bucket: siteBucket.ID(),
			Policy: pulumi.Any(map[string]interface{}{
				"Version": "2012-10-17",
				"Statement": []map[string]interface{}{
					{
						"Effect":    "Allow",
						"Principal": "*",
						"Action": []interface{}{
							"s3:GetObject",
						},
						"Resource": []interface{}{
							pulumi.Sprintf("arn:aws:s3:::%s/*", siteBucket.ID()), // policy refers to bucket name explicitly
						},
					},
				},
			}),
		}); err != nil {
			return err
		}

		// Stack exports
		ctx.Export("POS Bucket::Arn", siteBucket.Arn)
		ctx.Export("POS URL", siteBucket.WebsiteEndpoint)
		return nil
	})
}
