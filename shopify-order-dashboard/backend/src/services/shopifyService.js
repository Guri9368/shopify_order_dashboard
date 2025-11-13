const axios = require('axios');
const crypto = require('crypto');
const shopifyConfig = require('../config/shopify');

class ShopifyService {
  constructor(shop, accessToken) {
    this.shop = shop;
    this.accessToken = accessToken;
    this.apiVersion = '2024-10';
  }

  // Verify HMAC for incoming requests
  static verifyHmac(query, hmac) {
    const { hmac: _hmac, ...params } = query;
    const message = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    const generatedHash = crypto
      .createHmac('sha256', shopifyConfig.apiSecret)
      .update(message)
      .digest('hex');

    return generatedHash === hmac;
  }

  // Build authorization URL
  static buildAuthUrl(shop, state) {
    const authUrl = `https://${shop}/admin/oauth/authorize`;
    const params = new URLSearchParams({
      client_id: shopifyConfig.apiKey,
      scope: shopifyConfig.scopes,
      redirect_uri: shopifyConfig.redirectUri,
      state: state,
      grant_options: [],
    });

    return `${authUrl}?${params.toString()}`;
  }

  // Exchange authorization code for access token
  static async getAccessToken(shop, code) {
    const accessTokenUrl = `https://${shop}/admin/oauth/access_token`;

    try {
      const response = await axios.post(accessTokenUrl, {
        client_id: shopifyConfig.apiKey,
        client_secret: shopifyConfig.apiSecret,
        code: code,
      });

      return response.data;
    } catch (error) {
      console.error('Error getting access token:', error.response?.data);
      throw error;
    }
  }

  // Fetch orders using GraphQL (last 60 days)
  async fetchOrders(limit = 50) {
    const query = `
      query GetOrders($first: Int!) {
        orders(first: $first, query: "created_at:>=${this.getDateDaysAgo(60)}") {
          edges {
            node {
              id
              name
              email
              createdAt
              updatedAt
              displayFinancialStatus
              displayFulfillmentStatus
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              customer {
                firstName
                lastName
                email
              }
              shippingAddress {
                address1
                address2
                city
                province
                zip
                country
              }
              billingAddress {
                address1
                address2
                city
                province
                zip
                country
              }
              lineItems(first: 50) {
                edges {
                  node {
                    id
                    name
                    quantity
                    sku
                    price
                    product {
                      id
                      title
                    }
                    variant {
                      id
                      title
                      image {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    try {
      const response = await this.graphqlRequest(query, { first: limit });
      return response.data.orders;
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data);
      throw error;
    }
  }

  // Make GraphQL request to Shopify
  async graphqlRequest(query, variables = {}) {
    const url = `https://${this.shop}/admin/api/${this.apiVersion}/graphql.json`;

    try {
      const response = await axios.post(
        url,
        {
          query: query,
          variables: variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': this.accessToken,
          },
        }
      );

      if (response.data.errors) {
        console.error('GraphQL Errors:', response.data.errors);
        throw new Error('GraphQL request failed');
      }

      return response.data;
    } catch (error) {
      console.error('GraphQL Request Error:', error.message);
      throw error;
    }
  }

  // Helper: Get date X days ago in ISO format
  getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.setDate() - days);
    return date.toISOString().split('T')[0];
  }

  // Fetch single order details
  async fetchOrderDetails(orderId) {
    const query = `
      query GetOrder($id: ID!) {
        order(id: $id) {
          id
          name
          email
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          customer {
            firstName
            lastName
            email
          }
          lineItems(first: 100) {
            edges {
              node {
                id
                name
                quantity
                sku
                price
                variant {
                  id
                  title
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await this.graphqlRequest(query, { id: orderId });
      return response.data.order;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }
}

module.exports = ShopifyService;
