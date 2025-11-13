import React from 'react';
import { Package } from 'lucide-react';

const Navbar = ({ shop }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">
              Order Dashboard
            </h1>
          </div>
          {shop && (
            <div className="text-sm text-gray-600">
              Shop: <span className="font-semibold">{shop}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
