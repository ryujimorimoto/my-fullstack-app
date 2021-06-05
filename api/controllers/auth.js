
const shopifySignature  = require('./_shopifySignature');
const auth = require('../models/auth');

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
  console.log(shopOrigin, code, access_token_endpoint)
  await auth.storeTokenSave(shopOrigin, code, access_token_endpoint)
    .then( token => { res.json(token) })
    .catch( err => { res.json({error: err}) });
}

const shop_exist = async (req, res, next) => {
  console.log("======= Auth Controller ======");
  console.log('GET /shop/exist', req);
  const shopOrigin = req.apiGateway.event.queryStringParameters.shop;
  await auth.getStoreData(shopOrigin)
    .then( data => res.json(data))
    .catch( err => res.json({error: err}));
}

const allow = async (req, res, next) => {
  console.log("======= Auth Controller ======");
  console.log('POST /api_allow', req);
  const body = req.body;
  console.log("body:",body)
  const shopOrigin = body.shop_domain;
  const allowData = body.allow

  await auth.putStoreAllowData(shopOrigin, allowData)
    .then( data => {res.json(data)})
    .catch( err => {res.json(err)});
}

const app_uninstall = async (req, res, next) => {
  console.log("======= Auth Controller ======");
  console.log('POST /app/uninstall', req);
  const body = req.body;
  console.log("body:",body)
  // body: { 
  //   id: 51512508569,
  // name: 'Forest Book',
  // email: 'forest.book.programmer@gmail.com',
  // domain: 'xn-eeuway0cad4fuavbe0ora14a.myshopify.com',
  // province: 'Kanagawa',
  // country: 'JP',
  // address1: '港北区大倉山6丁目32-15',
  // zip: '222-0037',
  // city: '横浜市',
  // source: null,
  // phone: '09083627681',
  // latitude: 35.5324351,
  // longitude: 139.6209837,
  // primary_locale: 'ja',
  // address2: '32-15 Ivy Field Ⅰ 203号室',
  // created_at: '2020-12-09T00:44:09-05:00',
  // updated_at: '2021-05-24T21:10:41-04:00',
  // country_code: 'JP',
  // country_name: 'Japan',
  // currency: 'JPY',
  // customer_email: 'forest.book.programmer@gmail.com',
  // timezone: '(GMT-05:00) America/New_York',
  // iana_timezone: 'America/New_York',
  // shop_owner: '森本竜治',
  // money_format: '¥{{amount_no_decimals}}',
  // money_with_currency_format: '¥{{amount_no_decimals}} JPY',
  // weight_unit: 'kg',
  // province_code: 'JP-14',
  // taxes_included: false,
  // auto_configure_tax_inclusivity: null,
  // tax_shipping: null,
  // county_taxes: true,
  // plan_display_name: 'Developer Preview',
  // plan_name: 'partner_test',
  // has_discounts: false,
  // has_gift_cards: true,
  // myshopify_domain: 'xn-eeuway0cad4fuavbe0ora14a.myshopify.com',
  // google_apps_domain: null,
  // google_apps_login_enabled: null,
  // money_in_emails_format: '¥{{amount_no_decimals}}',
  // money_with_currency_in_emails_format: '¥{{amount_no_decimals}} JPY',
  // eligible_for_payments: true,
  // requires_extra_payments_agreement: false,
  // password_enabled: true,
  // has_storefront: true,
  // eligible_for_card_reader_giveaway: false,
  // finances: true,
  // primary_location_id: 58163495065,
  // cookie_consent_level: 'implicit',
  // visitor_tracking_consent_preference: 'allow_all',
  // checkout_api_supported: true,
  // multi_location_enabled: true,
  // setup_required: false,
  // pre_launch_enabled: false,
  // enabled_presentment_currencies: [ 'JPY' ],
  // force_ssl: true
  // }
  res.statusCode(200);
}


module.exports = {
  oauth,
  shop_exist,
  allow,
  app_uninstall,
}