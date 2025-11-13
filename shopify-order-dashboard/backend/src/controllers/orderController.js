const queries = require('../models/queries');
const OrderSyncService = require('../services/orderSyncService');
const ShopifyService = require('../services/shopifyService');

const orderController = {
  // GET /orders - List all orders
  getAllOrders: async (req, res) => {
    const { shop } = req.query;

    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }

    try {
      const shopRecord = await queries.findShopByDomain(shop);

      if (!shopRecord) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      const orders = await queries.getAllOrders(shop);

      res.json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  },

  // GET /orders/:id - Get single order details
  getOrderDetails: async (req, res) => {
    const { id } = req.params;

    try {
      const order = await queries.getOrderById(id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const fulfillmentItems = await queries.getFulfillmentItemsByOrderId(
        order.id
      );

      res.json({
        success: true,
        data: {
          ...order,
          line_items: fulfillmentItems,
        },
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ error: 'Failed to fetch order details' });
    }
  },

  // POST /orders/sync - Sync orders from Shopify
  syncOrders: async (req, res) => {
    const { shop } = req.query;

    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }

    try {
      const shopRecord = await queries.findShopByDomain(shop);

      if (!shopRecord) {
        return res.status(404).json({ error: 'Shop not installed' });
      }

      const syncedOrders = await OrderSyncService.syncOrders(
        shop,
        shopRecord.access_token
      );

      res.json({
        success: true,
        message: `Synced ${syncedOrders.length} orders`,
        count: syncedOrders.length,
      });
    } catch (error) {
      console.error('Error syncing orders:', error);
      res.status(500).json({ error: 'Failed to sync orders' });
    }
  },
};

module.exports = orderController;
