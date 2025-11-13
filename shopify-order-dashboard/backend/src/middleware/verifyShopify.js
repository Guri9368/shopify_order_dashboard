const ShopifyService = require('../services/shopifyService');

const verifyShopify = (req, res, next) => {
  const { shop, hmac } = req.query;

  if (!shop || !hmac) {
    return res.status(400).json({ error: 'Missing shop or hmac parameter' });
  }

  const isValid = ShopifyService.verifyHmac(req.query, hmac);

  if (!isValid) {
    return res.status(403).json({ error: 'Invalid HMAC signature' });
  }

  next();
};

module.exports = verifyShopify;
