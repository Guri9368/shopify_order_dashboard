const pool = require('../config/database');

const queries = {
  // Shop queries
  findShopByDomain: async (shopDomain) => {
    const result = await pool.query(
      'SELECT * FROM shops WHERE shop_domain = $1',
      [shopDomain]
    );
    return result.rows[0];
  },

  createShop: async (shopDomain, accessToken, scope) => {
    const result = await pool.query(
      `INSERT INTO shops (shop_domain, access_token, scope) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (shop_domain) 
       DO UPDATE SET access_token = $2, scope = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [shopDomain, accessToken, scope]
    );
    return result.rows[0];
  },

  // Order queries
  getAllOrders: async (shopDomain) => {
    const result = await pool.query(
      `SELECT * FROM orders 
       WHERE shop_domain = $1 
       ORDER BY created_at DESC`,
      [shopDomain]
    );
    return result.rows;
  },

  getOrderById: async (shopifyOrderId) => {
    const result = await pool.query(
      'SELECT * FROM orders WHERE shopify_order_id = $1',
      [shopifyOrderId]
    );
    return result.rows[0];
  },

  createOrder: async (orderData) => {
    const {
      shopId,
      shopDomain,
      shopifyOrderId,
      orderNumber,
      email,
      totalPrice,
      currency,
      financialStatus,
      fulfillmentStatus,
      customerName,
      customerEmail,
      shippingAddress,
      billingAddress,
      lineItemsCount,
      status,
      createdAt,
    } = orderData;

    const result = await pool.query(
      `INSERT INTO orders (
        shop_id, shop_domain, shopify_order_id, order_number, email, 
        total_price, currency, financial_status, fulfillment_status,
        customer_name, customer_email, shipping_address, billing_address,
        line_items_count, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (shopify_order_id) 
      DO UPDATE SET 
        financial_status = $8, 
        fulfillment_status = $9,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        shopId,
        shopDomain,
        shopifyOrderId,
        orderNumber,
        email,
        totalPrice,
        currency,
        financialStatus,
        fulfillmentStatus,
        customerName,
        customerEmail,
        JSON.stringify(shippingAddress),
        JSON.stringify(billingAddress),
        lineItemsCount,
        status,
        createdAt,
      ]
    );
    return result.rows[0];
  },

  // Fulfillment item queries
  createFulfillmentItem: async (itemData) => {
    const {
      orderId,
      returnId,
      lineItemId,
      productId,
      variantId,
      sku,
      name,
      quantity,
      price,
      reason,
      imageUrl,
    } = itemData;

    const result = await pool.query(
      `INSERT INTO fulfillment_items (
        order_id, return_id, line_item_id, product_id, variant_id,
        sku, name, quantity, price, reason, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        orderId,
        returnId,
        lineItemId,
        productId,
        variantId,
        sku,
        name,
        quantity,
        price,
        reason,
        imageUrl,
      ]
    );
    return result.rows[0];
  },

  getFulfillmentItemsByOrderId: async (orderId) => {
    const result = await pool.query(
      'SELECT * FROM fulfillment_items WHERE order_id = $1',
      [orderId]
    );
    return result.rows;
  },

  // Image queries
  createImage: async (imageUrl, returnItemId) => {
    const result = await pool.query(
      'INSERT INTO images (image_url, return_item_id) VALUES ($1, $2) RETURNING *',
      [imageUrl, returnItemId]
    );
    return result.rows[0];
  },
};

module.exports = queries;
