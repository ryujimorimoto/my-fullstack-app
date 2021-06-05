const Shopify = require('shopify-api-node');

async function getAllProducts(shopOrigin, accessToken) {
  const shopify = new Shopify({
    shopName: shopOrigin,
    accessToken: accessToken,
    apiVersion: process.env.SHOPIFY_API_VERSION,
  });
  const query = `{
    shop {
      name
    },
    products(first: 100) {
      edges {
        node {
          id
          handle
          title
          description
          onlineStorePreviewUrl
          variants(first: 1){
            edges{
              node{
                price
                compareAtPrice
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                id
                originalSrc
              }
            }
          }
        }
      }
    }
  }`;
  return new Promise((resolve, reject) => {
    console.time("graphql time");
    shopify.graphql(query)
      .then((products) => {
        console.timeEnd("graphql time");
        console.log("最大100個の商品データ:", products);
        resolve(products);
      }).catch((err) => {
        console.timeEnd("graphql time");
        console.error(err);
        reject(err);
      });
  });
}

async function getShop(shopOrigin, accessToken) {
  const shopify = new Shopify({
    shopName: shopOrigin,
    accessToken: accessToken,
    apiVersion: process.env.SHOPIFY_API_VERSION,
  });
  const query = `{
    shop {
      name
      url
    }
  }`;
  return new Promise((resolve, reject) => {
    console.time("graphql time");
    shopify.graphql(query)
      .then((shop) => {
        console.timeEnd("graphql time");
        console.log("ストア情報:", shop);
        resolve(shop);
      }).catch((err) => {
        console.timeEnd("graphql time");
        console.error(err);
        reject(err);
      });
  });
}
async function getProduct(shopOrigin, handle, accessToken) {
  const shopify = new Shopify({
    shopName: shopOrigin,
    accessToken: accessToken,
    apiVersion: process.env.SHOPIFY_API_VERSION,
  });
  const query = `{
    shop {
      name
    },
    productByHandle(handle: "${handle}") {
      id
      handle
      title
      description
      onlineStorePreviewUrl
      variants(first: 1){
        edges{
          node{
            price
            compareAtPrice
          }
        }
      }
      images(first: 1) {
        edges {
          node {
            id
            originalSrc
          }
        }
      }
    }
  }`;
  return new Promise((resolve, reject) => {
    console.time("graphql time");
    shopify.graphql(query)
      .then((products) => {
        console.timeEnd("graphql time");
        console.log("最大100個の商品データ:", products);
        resolve(products);
      }).catch((err) => {
        console.timeEnd("graphql time");
        console.error(err);
        reject(err);
      });
  });
}

module.exports = {
  getAllProducts,
  getShop,
  getProduct,
}
