import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import OrderList from './OrderList';
import OrderDetail from './OrderDetail';
import { orderService } from '../services/api';

const Dashboard = ({ shop }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shop) {
      fetchOrders();
    }
  }, [shop]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getAllOrders(shop);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      await orderService.syncOrders(shop);
      await fetchOrders();
    } catch (err) {
      setError('Failed to sync orders. Please try again.');
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSelectOrder = async (order) => {
    try {
      const response = await orderService.getOrderDetails(
        order.shopify_order_id
      );
      setSelectedOrder(response.data);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600 mt-1">
            Viewing orders from the last 60 days
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`}
          />
          <span>{syncing ? 'Syncing...' : 'Sync Orders'}</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            Total Orders
          </h3>
          <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            $
            {orders
              .reduce((sum, order) => sum + parseFloat(order.total_price), 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">
            Avg Order Value
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            $
            {orders.length > 0
              ? (
                  orders.reduce(
                    (sum, order) => sum + parseFloat(order.total_price),
                    0
                  ) / orders.length
                ).toFixed(2)
              : '0.00'}
          </p>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      ) : (
        <OrderList orders={orders} onSelectOrder={handleSelectOrder} />
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
