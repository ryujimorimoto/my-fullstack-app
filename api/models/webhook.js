const { Shopify } = require('@shopify/shopify-api');

async function appUninstalled(shopOrigin, access_token){
  console.log("====== Webhook - App Uninstalled! =========")
  return new Promise(async (resolve, reject) => {
    const query = `
    mutation {
      webhookSubscriptionCreate(
        topic: APP_UNINSTALLED,
        webhookSubscription: {
            callbackUrl: "${process.env.UNINSTALL_WEBHOOK_URL}",
            format: JSON
        }
      )
      {
          webhookSubscription {
              id
            }
            userErrors {
              field
              message
            }
          
      }
    }`;
    try {
      const client = await new Shopify.Clients.Graphql(shopOrigin, access_token);
      const response = await client.query({data: query});
      console.log("body.errors", response.body.errors);
      console.log("body data", response.body.data);
      resolve(response.body.data)
    }
    catch (err) {
      console.log("err", err)
      reject(err);
    }
  });
}

module.exports = {
  appUninstalled,
}
