const crypto = require('crypto');
const ShopifyService = require('../services/shopifyService');
const queries = require('../models/queries');

const authController = {
  // Install endpoint - initiates OAuth flow
  install: (req, res) => {
    const { shop } = req.query;

    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }

    // Generate random state for security
    const state = crypto.randomBytes(16).toString('hex');

    // Store state in session/cookie for verification
    res.cookie('state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600000, // 10 minutes
    });

    // Build and redirect to Shopify authorization URL
    const authUrl = ShopifyService.buildAuthUrl(shop, state);
    res.redirect(authUrl);
  },

  // OAuth callback endpoint
  callback: async (req, res) => {
    const { shop, code, state } = req.query;
    const storedState = req.cookies.state;

    // Verify state to prevent CSRF
    if (state !== storedState) {
      return res.status(403).json({ error: 'State verification failed' });
    }

    if (!shop || !code) {
      return res.status(400).json({ error: 'Missing shop or code parameter' });
    }

    try {
      // Exchange code for access token
      const tokenData = await ShopifyService.getAccessToken(shop, code);
      const { access_token, scope } = tokenData;

      // Save shop and access token to database
      await queries.createShop(shop, access_token, scope);

      console.log(`✅ App installed successfully for shop: ${shop}`);

      // Clear state cookie
      res.clearCookie('state');

      // Redirect to frontend dashboard
      res.redirect(`${process.env.FRONTEND_URL}/dashboard?shop=${shop}`);
    } catch (error) {
      console.error('OAuth callback error:', error.message);
      res.status(500).json({ error: 'Failed to complete installation' });
    }
  },
};

module.exports = authController;
