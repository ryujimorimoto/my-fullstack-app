[![Serverless Fullstack Application Express React DynamoDB AWS Lambda AWS HTTP API](https://forestbook-freelance.com/wp-content/uploads/2020/11/%E3%82%B7%E3%83%A7%E3%83%83%E3%83%95%E3%82%9A%E3%83%AD_slim-min.png)](https://forestbook-freelance.com/2021/05/18/shopify-serverless-framework/)

AWS Lambda、AWS HTTP API、Express.js、React、DynamoDB 上に構築された完全なサーバーレスのフルスタックアプリケーション。

#### Live Demo: [https://www.serverless-fullstack-app.com](https://www.serverless-fullstack-app.com)

## Quick Start

GitHub からクローンを作成。
フォルダはアプリ名にする。

```
gh repo clone ryujimorimoto/my-fullstack-app アプリ名
cd アプリ名
```

※ 各フォルダにある serverless.yml にある app をアプリ名に、org をアカウント名に変更してください。

```
app: アプリ名（半角英字の小文字、ハイフン（-）のみ利用可能）
org: ryuji
```

- api ディレクトリがバックエンド
- site ディレクトリがフロントエンド
- dynamoDB データベースの設定
- permissions バックエンド（api ディレクトリ）からのアクセス権限を管理

### フロント側（site）の設定

ユーザー認証は、フロント側で cognito を使って対応する。
cognito は、amplify を使って導入する。
./site ディレクトリで amplify を実行する。

※（最終的には、全て serverless framework へ統一したい）

```
cd site
amplify configure
amplify init
amplify add auth
```

ホスティングは serverless framework 経由で行いますが、
amplify でホスティングの設定をしないとデプロイできないので、
ホスティング設定をマニュアルに設定します。
後でサーバーレスフレームワークでホスティングさせます。

```
amplify add hosting
  ❯ Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)
  Amazon CloudFront and S3

  Continuous deployment (Git-based deployments)
  ❯ Manual deployment
  Learn more
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

最後に amplify を publish します。

```
amplify publish
```

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
最初に permissions ディレクトリをデプロイし、api, site, dynamoDB ディレクトリをデプロイしてください。
（api の c 設定に permissions の設定が必要なので、先に permissions をデプロイしています）

```
cd permissions
sls deploy
cd ../api
sls deploy
cd ../site
sls deploy
cd ../dynamoDB
sls deploy
```

最後に、フロントエンド（site）とバックエンド（api）をつなげるために、
作成された URL を環境変数に設定します。

- site/.env ファイルの `REACT_APP_APPLICATION_URL` に site の distributionUrl を設定。 `REACT_APP_PUBLIC_API_URL` に api の apiGatewayUrl を設定。

site: url: に表記されている、CloudFront の URL にアクセスし、動作確認を行う。

- https://xxxxxxxxxxxx.cloudfront.net へアクセス
- 会員登録、verification code メールの受信を確認する
- code を入力して会員登録を完了させる
- 適当なストアの URL を入力し、ログインできるか確認する

問題なくログインできれば環境構築の完了！

ーーーーーーーーーーーーー

# IAM 権限設定

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "lambda:*",
                "dynamodb:*",
                "apigateway:*",
                "cloudformation:*",
                "s3:*",
                "cloudfront:*",
                "amplify:*",
                "cognito-idp:*",
                "cognito-identity:*",
                "iam:UpdateAssumeRolePolicy",
                "iam:GetRole",
                "iam:ListAttachedRolePolicies",
                "iam:DeleteRole",
                "iam:CreateRole",
                "iam:ListRolePolicies",
                "iam:PassRole",
                "iam:*RolePolicy"
            ],
            "Resource": "*"
        }
    ]
}
```
