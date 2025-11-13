import React from 'react';
import { ShoppingCart, DollarSign, User, Calendar } from 'lucide-react';

const OrderList = ({ orders, onSelectOrder }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      PAID: 'status-paid',
      PENDING: 'status-pending',
      REFUNDED: 'status-refunded',
      PARTIALLY_REFUNDED: 'status-refunded',
      FULFILLED: 'status-fulfilled',
      UNFULFILLED: 'status-unfulfilled',
    };
    return statusMap[status] || 'status-badge';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">No orders found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onSelectOrder(order)}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer animate-fade-in"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {order.order_number}
              </h3>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(order.created_at)}
              </p>
            </div>
            <span
              className={`status-badge ${getStatusClass(
                order.financial_status
              )}`}
            >
              {order.financial_status}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-700">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm">{order.customer_name}</span>
            </div>

            <div className="flex items-center text-gray-700">
              <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-semibold">
                {order.currency} {parseFloat(order.total_price).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center text-gray-700">
              <ShoppingCart className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm">{order.line_items_count} items</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <span
              className={`status-badge ${getStatusClass(
                order.fulfillment_status
              )}`}
            >
              {order.fulfillment_status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
