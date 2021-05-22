[![Serverless Fullstack Application Express React DynamoDB AWS Lambda AWS HTTP API](https://forestbook-freelance.com/wp-content/uploads/2020/11/%E3%82%B7%E3%83%A7%E3%83%83%E3%83%95%E3%82%9A%E3%83%AD_slim-min.png)](https://forestbook-freelance.com/2021/05/18/shopify-serverless-framework/)

AWS Lambda、AWS HTTP API、Express.js、React、DynamoDB 上に構築された完全なサーバーレスのフルスタックアプリケーション。

#### Live Demo: [https://www.serverless-fullstack-app.com](https://www.serverless-fullstack-app.com)

## Quick Start

GitHub からクローンを作成。
フォルダはアプリ名にする。

```
gh repo clone ryujimorimoto/my-fullstack-app アプリ名
```

ルートディレクトリの serverless.yml にある app をアプリ名に変更

```
app: アプリ名（半角英字の小文字、ハイフン（-）のみ利用可能）
org: ryuji
```

- api ディレクトリがバックエンド
- site ディレクトリがフロントエンド

### フロント側（site）の設定

ユーザー認証は、フロント側で cognito を使って対応する。
cognito は、amplify を使って導入する。
./site ディレクトリで amplify を実行する。

```
cd site
amplify configure
amplify init
amplify add auth
```

amplify でホスティングを行います。
マニュアルにすることで、amplify にホスティングさせず、
後でサーバーレスフレームワークでホスティングさせます。

```
amplify add hosting
  ❯ Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)
  Amazon CloudFront and S3

  ❯ Manual deployment
  lern more
```

amplify を publish します。

```
amplify publish
```

参考サイト：[サーバレスで Shopify アプリの構築方法を解説！AWS Amplify, Serverless Framework](https://forestbook-freelance.com/2020/12/27/%E3%82%B5%E3%83%BC%E3%83%90%E3%83%AC%E3%82%B9%E3%81%A7shopify%E3%82%A2%E3%83%97%E3%83%AA%E3%81%AE%E6%A7%8B%E7%AF%89%E3%82%92%E8%A7%A3%E8%AA%AC%EF%BC%81/)

site ディレクトリはデプロイ時にビルドする設定になっているので、
まず、package.json の中身をインストールします。

```
yarn install && yarn build
```

フロント側（site）の環境変数を設定します。
site ディレクトリに.env ファイルを作成し、下記を設定します。

```
REACT_APP_SHOPIFY_API_KEY=ShopifyのアプリAPIキー
REACT_APP_SHOPIFY_SECRET_KEY=Shopifyのアプリシークレットキー
REACT_APP_SCOPES=read_content
REACT_APP_PUBLIC_API_URL=
REACT_APP_APPLICATION_URL=
```

Shopify のアプリ API キーとシークレットキーは、
Shopify パートナーダッシュボードの管理画面から取得できます。
また、必要に応じて、REACT_APP_SCOPES にスコープを設定してください。
[アクセススコープ一覧](https://shopify.dev/docs/admin-api/access-scopes)

### バックエンド側（api）の設定

ルートディレクトリに戻り（`cd ..`）、バックエンド側の設定を行います。

```
cd api
yarn install
touch .env
```

環境変数の設定（.env）は次のようにします。

```
SHOPIFY_API_KEY=ShopifyのアプリAPIキー
SHOPIFY_API_SECRET=Shopifyのアプリシークレットキー
```

フロント側で設定したアプリの API キーをバックエンド側でも設定します。

### デプロイ

デプロイし、AWS Lambda、AWS ApiGateway、AWS CloudFront、DynamoDB などを作成します。
ルートディレクトリ（`cd ..`）でデプロイします。

```
sls deploy
```

成功した場合、次のように表示されます。

```
serverless ⚡framework
Action: "deploy" - Stage: "dev" - Org: "ryuji" - App: "xxx-app" - Name: "xxxApp"

token-database:
  name:    xxx-app-shopTokens
  arn:     arn:aws:dynamodb:ap-northeast-1:000000000000:table/xxx-app-shopTokens
  region:  ap-northeast-1
  indexes:

permissions:
  name: permissions-dev
  arn:  arn:aws:iam::0000000000000:role/permissions-dev

site:
  bucket:          website-abc123def
  distributionUrl: https://xxxxxxxxxxxx.cloudfront.net
  bucketUrl:       http://website-abc123def.s3-website.ap-northeast-1.amazonaws.com
  url:             https://xxxxxxxxxxxx.cloudfront.net

api:
  apiGatewayUrl: https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com
  url:           https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com

48s › Serverless › "deploy" ran for 4 apps successfully.
```

最後に、フロントエンド（site）とバックエンド（api）をつなげるために、
作成された URL を環境変数に設定します。

- site/.env ファイルの `REACT_APP_APPLICATION_URL` に site の distributionUrl を設定。 `REACT_APP_PUBLIC_API_URL` に api の apiGatewayUrl を設定。

※注意事項
なぜか、api ディレクトリ、site ディレクトリのそれぞれで sls deploy をやらないと、設定した環境変数が適応されない。
データベースの追加は、ルートディレクトリにフォルダを作って、その中に serverless.yml を作成し、component で dynamodb を追加する。

ーーーーーーーーーーーーー

Install the latest version of the Serverless Framework:

```
npm i -g serverless
```

Then, initialize the `fullstack-app` template:

```
serverless init fullstack-app
cd fullstack-app
```

Then, add your AWS credentials in the `.env` file in the root directory, like this:

```text
AWS_ACCESS_KEY_ID=JAFJ89109JASFKLJASF
AWS_SECRET_ACCESS_KEY=AJ91J9A0SFA0S9FSKAFLASJFLJ

# This signs you JWT tokens used for auth.  Enter a random string in here that's ~40 characters in length.
tokenSecret=yourSecretKey

# Only add this if you want a custom domain.  Purchase it on AWS Route53 in your target AWS account first.
domain=serverless-fullstack-app.com
```

In the root folder of the project, run `serverless deploy`

Lastly, you will need to add your API domain manually to your React application in `./site/src/config.js`, so that you interact with your serverless Express.js back-end. You can find the your API url by going into `./api` and running `serverless info` and copying the `url:` value. It should look something like this `https://9jfalnal19.execute-api.ap-northeast-1.amazonaws.com` or it will look like the custom domain you have set.

**Note:** Upon the first deployment of your website, it will take a 2-3 minutes for the Cloudfront (CDN) URL to work. Until then, you can access it via the `bucketUrl`.

After initial deployment, we recommend deploying only the parts you are changing, not the entire thing together (why risk deploying your database with a code change?). To do this, `cd` into a part of the application and run `serverless deploy`.

When working on the `./api` we highly recommend using `serverless dev`. This command watches your code, auto-deploys it, and streams `console.log()` statements and errors directly to your CLI in real-time!

If you want to add custom domains to your landing pages and API, either hardcode them in your `serverless.yml` or reference them as environment variables in `serverless.yml`, like this:

```yaml
inputs:
  domain: ${env:domain}
```

```text
domain=serverless-fullstack-app.com
```

Support for stages is built in.

You can deploy everything or individual components to different stages via the `--stage` flag, like this:

`serverless deploy --stage prod`

Or, you can hardcode the stage in `serverless.yml` (not recommended):

```yaml
app: fullstack
component: express@0.0.20
name: fullstack-api
stage: prod # Put the stage in here
```

Lastly, you can add separate environment variables for each stage using `.env` files with the stage name in them:

```bash
.env # Any stage
.env.dev # "dev" stage only
.env.prod # "prod" stage only
```

Then simply reference those environment variables using Serverless Variables in your YAML:

```yaml
app: fullstack
component: express@0.0.20
name: fullstack-api

inputs:
  domain: api.${env:domain}
```

And deploy!

`serverless deploy --stage prod`

Enjoy! This is a work in progress and we will continue to add funcitonality to this.

## Other Resources

For more details on each part of this fullstack application, check out these resources:

- [Serverless Components](https://github.com/serverless/components)
- [Serverless Express](https://github.com/serverless-components/express)
- [Serverless Website](https://github.com/serverless-components/website)
- [Serverless AWS DynamoDB](https://github.com/serverless-components/aws-dynamodb)
- [Serverless AWS IAM Role](https://github.com/serverless-components/aws-iam-role)

## Guides

### How To Debug CORS Errors

If you are running into CORS errors, see our guide on debugging them [within the Express Component's repo](https://github.com/serverless-components/express/blob/master/README.md#how-to-debug-cors-errors)
