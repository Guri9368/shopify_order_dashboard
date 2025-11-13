require('dotenv').config();

module.exports = {
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecret: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_SCOPES,
  appUrl: process.env.SHOPIFY_APP_URL,
  redirectUri: process.env.SHOPIFY_REDIRECT_URI,
};
