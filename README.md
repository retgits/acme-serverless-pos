# ACME Fitness Serverless Point-of-Sales

> A point-of-sales app to sell our products in brick-and-mortar stores!

The Point-of-Sales is part of the [ACME Fitness Serverless Shop](https://github.com/retgits/acme-serverless). The goal of this specific service is to serve as the front-end for Point-of-Sales locations.

## Prerequisites

* [An AWS Account](https://portal.aws.amazon.com/billing/signup)
* Deployed the serverless apps of the [ACME Fitness Serverless Shop](https://github.com/retgits/acme-serverless)
* [A Pulumi account](https://app.pulumi.com/signup)

## Deploying

Regardless which deployment option you take, you'll need to update the endpoint locations in [script.js](./src/assets/script.js). If you choose to use CloudFormation, you'll also need to update the `author` in [Makefile](./deploy/cloudformation/Makefile) to make sure that the bucket name is unique. If you choose Pulumi,  you'll also need to update the `bucket` in [Pulumi.dev.yaml](./pulumi/Pulumi.dev.yaml).

### With Pulumi

To deploy the Payment Service you'll need a [Pulumi account](https://app.pulumi.com/signup). Once you have your Pulumi account and configured the [Pulumi CLI](https://www.pulumi.com/docs/get-started/aws/install-pulumi/), you can initialize a new stack using the Pulumi templates in the [pulumi](./pulumi) folder.

```bash
cd pulumi
pulumi stack init <your pulumi org>/acmeserverless-pos/dev
```

Pulumi is configured using a file called `Pulumi.dev.yaml`. A sample configuration is available in the Pulumi directory. You can rename [`Pulumi.dev.yaml.sample`](./pulumi/Pulumi.dev.yaml.sample) to `Pulumi.dev.yaml` and update the variables accordingly. Alternatively, you can change variables directly in the [main.go](./pulumi/main.go) file in the pulumi directory. The configuration contains:

```yaml
config:
  aws:region: us-west-2 ## The region you want to deploy to
  awsconfig:s3:
    bucket: mybucket ## The bucket in which you want to store the POS app
  awsconfig:tags:
    author: retgits ## The author, you...
    feature: acmeserverless
    team: vcs ## The team you're on
    version: 0.2.0 ## The version
```

To create the Pulumi stack, and create the POS service, run `pulumi up`.

If you want to keep track of the resources in Pulumi, you can add tags to your stack as well.

```bash
pulumi stack tag set app:name acmeserverless
pulumi stack tag set app:feature acmeserverless-pos
pulumi stack tag set app:domain pos
```

### With CloudFormation

Clone this repository

```bash
git clone https://github.com/retgits/acme-serverless-pos
cd acme-serverless-pos
```

Change directories to the [deploy/cloudformation](./deploy/cloudformation) folder

```bash
cd ./deploy/cloudformation
```

Use make to deploy

```bash
make deploy
```

### Testing Amazon S3

After the deployment you'll be able to see the Point-of-Sales app on

```bash
http://<bucket-name>.s3-website.us-west-2.amazonaws.com
# or
http://<bucket-name>.s3-website-us-west-2.amazonaws.com
```

## Contributing

[Pull requests](https://github.com/retgits/acme-serverless-pos/pulls) are welcome. For major changes, please open [an issue](https://github.com/retgits/acme-serverless-pos/issues) first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

See the [LICENSE](./LICENSE) file in the repository
