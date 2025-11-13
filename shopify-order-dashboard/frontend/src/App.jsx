import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const shop = urlParams.get('shop') || localStorage.getItem('shop');

  if (shop && !localStorage.getItem('shop')) {
    localStorage.setItem('shop', shop);
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar shop={shop} />
        <Routes>
          <Route
            path="/dashboard"
            element={
              shop ? <Dashboard shop={shop} /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/"
            element={
              <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to Order Dashboard
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  View and manage your Shopify orders in one place
                </p>
                {!shop && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <p className="text-yellow-800">
                      Please install this app from your Shopify admin to get
                      started.
                    </p>
                  </div>
                )}
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
