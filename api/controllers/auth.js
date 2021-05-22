const axiosBase = require("axios");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const { Shopify } = require('@shopify/shopify-api');
const shopifySignature  = require('./_shopifySignature');

const oauth = async (req, res, next) => {
console.log("======= Auth Controller ======");
console.log(" GET /oauth", req);
  const authentication = shopifySignature(req.apiGateway.event.queryStringParameters);
  console.log("認証:", authentication)
  if(!authentication){
    console.log('invalid signature')
    return res.json({error: 'invalid signature'})
  }
  const code = req.apiGateway.event.queryStringParameters.code
  const shopOrigin = req.apiGateway.event.queryStringParameters.shop
  const access_token_endpoint=`https://${shopOrigin}/admin/oauth/access_token`
  const axios = axiosBase.create({
    baseURL: access_token_endpoint,
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'json'
  })
  axios.post('/',{
    client_id:process.env.SHOPIFY_API_KEY,
    client_secret:process.env.SHOPIFY_API_SECRET,
    code:code
  }).then(response=>{
    //shop_domain と token を永続化
    let table = `${process.env.APP_NAME}-shopTokens`;
    let params = {
      TableName: table,
      Item:{
        shop_domain:shopOrigin,
        token:JSON.stringify(response.data)
      }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            //tokenを返却
            return res.json(response.data)
        } else {
          // アンインストール時のWebhookを登録しなければならない
            // console.log("Added item:", JSON.stringify(data, null, 2));
            // Shopify.Webhooks.Registry.register({
            //   shop: shopOrigin,
            //   path: `${process.env.UNINSTALL_WEBHOOK_URL}/uninstall`,
            //   topic: 'APP_UNINSTALLED',
            //   accessToken: response.data.access_token,
            //   apiVersion: process.env.API_VERSION,
            //   webhookHandler: (_topic, shop, _body) => {
            //     console.log('App uninstalled', _topic, shop, _body);
            //   },
            // }).then( webhook_data => {
            //   console.log("webhook_data", JSON.stringify(webhook_data));
            //   return res.json(response.data)
            // });
            return res.json(response.data)
            
        }
    });
  }).catch(err=>{
    console.log(err)
    return res.json({error: err})
  })
}

const shop_exist = async (req, res, next) => {
  console.log("======= Auth Controller ======");
  console.log('GET /shop/exist', req);
  let table = `${process.env.APP_NAME}-shopTokens`;
  let params = {
    TableName: table,
    Key:{
      shop_domain:req.apiGateway.event.queryStringParameters.shop,
    }
  };
  console.log("params:", params)
  docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        return res.json(err)
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        if(data.Item){
          return res.json({exist:true, access_token: data.Item.token.access_token})
        }else{
          return res.json({exist:false, access_token:null})
        }
    }
  });
}


module.exports = {
  oauth,
  shop_exist,
}