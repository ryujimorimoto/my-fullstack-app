const crypto = require('crypto');
const qs = require('qs');

/* --- Check if the given signature is correct or not --- */
const shopifySignature = function(json) {
    const temp = JSON.parse(JSON.stringify(json));
    const code = temp.code;
    const hmac = temp.hmac;
    const shop = temp.shop;
    const timestamp = temp.timestamp;
    console.log("hmac:", hmac);

    console.log("timestamp", crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(qs.stringify({ timestamp })).digest('hex'))
    console.log("code:", crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(qs.stringify({ code })).digest('hex'))
    console.log("shop:", crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(qs.stringify({ shop })).digest('hex'))
    console.log("code and timestamp", crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(qs.stringify({ code, timestamp })).digest('hex'))
    console.log("shop and timestamp", crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(qs.stringify({ shop, timestamp })).digest('hex'))
    console.log("code and shop:", crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(qs.stringify({ code, shop })).digest('hex'))


    let generatedHash = crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    const msg = qs.stringify({ code, shop, timestamp });
    console.log("message:", msg);
    generatedHash.update(msg);
    generatedHash.digest('hex');
    console.log("sha256 hash (HEX):", generatedHash);
    console.log("sha256 hash (HEX):", crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(msg).digest('hex'));

    return crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET) == hmac;
};

module.exports = shopifySignature