import React from 'react';
import {
  X,
  Package,
  User,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
} from 'lucide-react';

const OrderDetail = ({ order, onClose }) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const shippingAddress = order.shipping_address
    ? typeof order.shipping_address === 'string'
      ? JSON.parse(order.shipping_address)
      : order.shipping_address
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Order {order.order_number}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Customer Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span>{' '}
                  {order.customer_name}
                </p>
                <p className="text-gray-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {order.customer_email}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-primary" />
                Order Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Total:</span> {order.currency}{' '}
                  {parseFloat(order.total_price).toFixed(2)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Status:</span>{' '}
                  <span className="status-badge status-paid">
                    {order.financial_status}
                  </span>
                </p>
                <p className="text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                Shipping Address
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  {shippingAddress.address1}
                  {shippingAddress.address2 && `, ${shippingAddress.address2}`}
                </p>
                <p className="text-gray-700">
                  {shippingAddress.city}, {shippingAddress.province}{' '}
                  {shippingAddress.zip}
                </p>
                <p className="text-gray-700">{shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Line Items */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Package className="w-5 h-5 mr-2 text-primary" />
              Items ({order.line_items_count})
            </h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.line_items &&
                    order.line_items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.name}
                              </p>
                              {item.sku && (
                                <p className="text-sm text-gray-500">
                                  SKU: {item.sku}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          {order.currency} {parseFloat(item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
