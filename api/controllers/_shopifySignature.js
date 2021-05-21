const crypto = require('crypto');
const qs = require('qs');

/* --- Check if the given signature is correct or not --- */
const shopifySignature = function(json) {
    const temp = JSON.parse(JSON.stringify(json));
    const code = temp.code;
    const hmac = temp.hmac;
    const shop = temp.shop;
    const host = temp.host;
    const state = temp.state;
    const timestamp = temp.timestamp;
    const msg = qs.stringify({ code, host, shop, state, timestamp });
    console.log("message:", msg);
    console.log("temp:", temp);
    console.log("SHOPIFY_API_SECRET:", process.env.SHOPIFY_API_SECRET);
    console.log("hmac:", hmac);
    console.log("sha256 hash (HEX):", crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(msg).digest('hex'));

    return crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(msg).digest('hex') == hmac;
};

module.exports = shopifySignature