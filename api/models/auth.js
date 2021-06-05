const axiosBase = require("axios");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const webhook = require('./webhook');

async function storeTokenSave(shopOrigin, code, access_token_endpoint) {
  return new Promise((resolve, reject) => {
    const axios = axiosBase.create({
      baseURL: access_token_endpoint,
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    })
    console.log("code", code)
    axios.post('/',{
      client_id:process.env.SHOPIFY_API_KEY,
      client_secret:process.env.SHOPIFY_API_SECRET,
      code:code
    }).then( async (response) => {
      const store_res = await putStoreTokenData(shopOrigin, response.data);
      console.log("store_res:", store_res);
      resolve(store_res)
    }).catch(err=>{
      console.log(err)
      reject(err)
    })
  })
}
async function putStoreTokenData(shopOrigin, resData) {
  return new Promise((resolve, reject) => {
    //shop_domain と token を永続化
    let table = `${process.env.APP_NAME}-shopTokens`;
    let params = {
      TableName: table,
      Item:{
        shop_domain:shopOrigin,
        token:JSON.stringify(resData),
        allow: true,
      }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            //tokenを返却
            reject(resData)
        } else {
          console.log("Added item:", JSON.stringify(data, null, 2));
          webhook.appUninstalled(shopOrigin, resData.access_token)
          .then( wh => {
            resolve(resData)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          });
        }
    });
  });
}

async function getStoreData(shopOrigin) {
  return new Promise((resolve, reject) => {
    let table = `${process.env.APP_NAME}-shopTokens`;
    let params = {
      TableName: table,
      Key:{
        shop_domain: shopOrigin,
      }
    };
    console.log("params:", params)
    docClient.get(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", err);
          reject(err)
      } else {
          console.log("GetShopData succeeded:", data);
          if(data.Item){
            resolve({exist:true, access_token: JSON.parse(data.Item.token).access_token, allow: data.Item.allow})
          }else{
            resolve({exist:false, access_token:null})
          }
      }
    });
  });
}

async function putStoreAllowData(shopOrigin, allowData) {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: `${process.env.APP_NAME}-shopTokens`,
      Key: { shop_domain: shopOrigin }, 
      ExpressionAttributeNames: { "#AL": "allow" }, 
      ExpressionAttributeValues: { ":a": allowData },
      UpdateExpression: "SET #AL = :a"
    };
    console.log("params:",params)
    docClient.update(params, (err, data) => {
      if(err){
        reject(err)
      }else{
        resolve(data)
      }
    });
  });
}





module.exports = {
  storeTokenSave,
  getStoreData,
  putStoreAllowData,
}
