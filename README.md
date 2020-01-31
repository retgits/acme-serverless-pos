# ACME Fitness Serverless Point-of-Sales

> A point-of-sales app to sell our products in brick-and-mortar stores!

The Point-of-Sales is part of the [ACME Fitness Serverless Shop](https://github.com/retgits/acme-serverless). The goal of this specific service is to serve as the front-end for Point-of-Sales locations.

## Prerequisites

* [An AWS Account](https://portal.aws.amazon.com/billing/signup)
* Deployed the serverless apps of the [ACME Fitness Serverless Shop](https://github.com/retgits/acme-serverless)

## Hosting Options

The Point-of-Sales app can be hosted on [Amazon S3](https://aws.amazon.com/s3).

## Using Amazon S3

### Prerequisites for Amazon S3

* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) installed and configured

### Build and deploy for Amazon S3

Clone this repository

```bash
git clone https://github.com/retgits/acme-serverless-pos
cd acme-serverless-pos
```

Update the endpoint locations in [script.js](./src/assets/script.js) and update the `author` in [Makefile](./deploy/cloudformation/Makefile) to make sure that the bucket name is unique.

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