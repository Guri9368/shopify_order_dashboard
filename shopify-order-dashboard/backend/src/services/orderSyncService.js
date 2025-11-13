const ShopifyService = require('./shopifyService');
const queries = require('../models/queries');

class OrderSyncService {
  static async syncOrders(shop, accessToken) {
    try {
      const shopifyService = new ShopifyService(shop, accessToken);
      const ordersData = await shopifyService.fetchOrders(250);

      const shopRecord = await queries.findShopByDomain(shop);
      if (!shopRecord) {
        throw new Error('Shop not found in database');
      }

      const syncedOrders = [];

      for (const edge of ordersData.edges) {
        const order = edge.node;

        // Extract order ID from GraphQL ID
        const shopifyOrderId = order.id.split('/').pop();

        // Prepare order data
        const orderData = {
          shopId: shopRecord.id,
          shopDomain: shop,
          shopifyOrderId: shopifyOrderId,
          orderNumber: order.name,
          email: order.email,
          totalPrice: parseFloat(order.totalPriceSet.shopMoney.amount),
          currency: order.totalPriceSet.shopMoney.currencyCode,
          financialStatus: order.displayFinancialStatus,
          fulfillmentStatus: order.displayFulfillmentStatus || 'unfulfilled',
          customerName: order.customer
            ? `${order.customer.firstName} ${order.customer.lastName}`
            : 'Guest',
          customerEmail: order.customer?.email || order.email,
          shippingAddress: order.shippingAddress,
          billingAddress: order.billingAddress,
          lineItemsCount: order.lineItems.edges.length,
          status: 'active',
          createdAt: order.createdAt,
        };

        // Save order to database
        const savedOrder = await queries.createOrder(orderData);

        // Save line items as fulfillment items
        for (const lineItemEdge of order.lineItems.edges) {
          const lineItem = lineItemEdge.node;
          const lineItemId = lineItem.id.split('/').pop();

          const itemData = {
            orderId: savedOrder.id,
            returnId: null,
            lineItemId: lineItemId,
            productId: lineItem.product?.id.split('/').pop(),
            variantId: lineItem.variant?.id.split('/').pop(),
            sku: lineItem.sku,
            name: lineItem.name,
            quantity: lineItem.quantity,
            price: parseFloat(lineItem.price),
            reason: null,
            imageUrl: lineItem.variant?.image?.url || null,
          };

          await queries.createFulfillmentItem(itemData);
        }

        syncedOrders.push(savedOrder);
      }

      console.log(`✅ Synced ${syncedOrders.length} orders for shop: ${shop}`);
      return syncedOrders;
    } catch (error) {
      console.error('❌ Error syncing orders:', error.message);
      throw error;
    }
  }
}

module.exports = OrderSyncService;
