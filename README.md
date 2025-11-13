
📦 Shopify Order Dashboard
A full-stack web application for managing and visualizing Shopify orders with real-time synchronization, built with React, Node.js, Express, and PostgreSQL.

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo![Node.js](https://img.shields.io/badge/Node.js-20eScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=whiteimg.shields.io/badge/PostgreSQL-16+-4MIT](https://img.shields ✨ Features

🔐 OAuth 2.0 Authentication - Secure Shopify app integration

📊 Order Management - View and sync orders from Shopify stores

🔍 Advanced Filtering - Search and filter orders by status, date, and customer

💾 PostgreSQL Database - Robust data storage with optimized schema

🎨 Modern UI - Clean interface built with React and Tailwind CSS

⚡ Real-time Sync - Instant order synchronization from Shopify

🔄 RESTful API - Well-structured backend API architecture

🚀 Tech Stack
Frontend
React 18 - UI library

TypeScript - Type safety

Vite - Build tool and dev server

Tailwind CSS - Utility-first CSS framework

Axios - HTTP client

Backend
Node.js 20.16 - Runtime environment

Express.js - Web framework

PostgreSQL - Relational database

Shopify API - OAuth 2.0 & Admin API integration

dotenv - Environment variable management

Development Tools
Git - Version control

pgAdmin - Database management

Nodemon - Auto-restart dev server

📁 Project Structure
text
shopify-order-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # PostgreSQL connection
│   │   ├── models/
│   │   │   └── schema.sql           # Database schema
│   │   ├── routes/
│   │   │   ├── shopify.js           # OAuth routes
│   │   │   └── orders.js            # Order CRUD routes
│   │   ├── controllers/
│   │   │   └── orderController.js   # Business logic
│   │   └── app.js                   # Express app setup
│   ├── server.js                    # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── OrderTable.tsx       # Order list component
│   │   │   └── Filters.tsx          # Filter controls
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx        # Main dashboard
│   │   │   └── Home.tsx             # Landing page
│   │   ├── services/
│   │   │   └── api.ts               # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
🛠️ Installation & Setup
Prerequisites
Ensure you have the following installed:

Node.js (v20.16 or higher) - Download

PostgreSQL (v16 or higher) - Download

Git - Download

Shopify Partner Account - Sign up

1️⃣ Clone the Repository
bash
git clone https://github.com/Guri9368/shopify_order_dashboard.git
cd shopify_order_dashboard
2️⃣ Database Setup
Step 1: Create Database

Open PostgreSQL (pgAdmin or psql):

sql
CREATE DATABASE shopify_orders_db;
Step 2: Create Tables

Connect to the database and run the schema:

bash
cd backend/src/models
psql -U postgres -d shopify_orders_db -f schema.sql
Or manually execute backend/src/models/schema.sql in pgAdmin.

3️⃣ Backend Setup
Step 1: Install Dependencies

bash
cd backend
npm install
Step 2: Configure Environment Variables

Create a .env file in the backend folder:

bash
cp .env.example .env
Edit backend/.env:

text
# Server Configuration
PORT=5000
NODE_ENV=development

# Shopify App Credentials
SHOPIFY_API_KEY=your_client_id_here
SHOPIFY_API_SECRET=your_client_secret_here
SHOPIFY_SCOPES=read_orders,read_products
SHOPIFY_APP_URL=https://your-ngrok-url.ngrok-free.app
SHOPIFY_REDIRECT_URI=https://your-ngrok-url.ngrok-free.app/api/auth/callback

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopify_orders_db
DB_USER=postgres
DB_PASSWORD=your_postgresql_password

# Frontend URL
FRONTEND_URL=http://localhost:5173
Step 3: Get Shopify Credentials

Go to Shopify Partner Dashboard

Create a new app (public distribution)

Get your Client ID and Client Secret

Update .env with these values

Step 4: Start Backend Server

bash
npm run dev
Expected output:

text
✅ Connected to PostgreSQL database
🚀 Server running on port 5000
4️⃣ Frontend Setup
Step 1: Install Dependencies

bash
cd ../frontend
npm install
Step 2: Start Frontend Server

bash
npm run dev
Expected output:

text
➜  Local:   http://localhost:5173/
5️⃣ Public Tunnel Setup (for OAuth)
For Shopify OAuth to work, you need a public HTTPS URL.

Option A: ngrok (Recommended)

bash
# Download from https://ngrok.com/download
# Extract and run:
ngrok http 5000

# Copy the HTTPS URL and update backend/.env:
# SHOPIFY_APP_URL=https://your-url.ngrok-free.app
# SHOPIFY_REDIRECT_URI=https://your-url.ngrok-free.app/api/auth/callback
Option B: localtunnel

bash
npm install -g localtunnel
lt --port 5000

# Update .env with the provided URL
🎯 Usage
Installing the App
Start all services:

Terminal 1: Backend (npm run dev in backend folder)

Terminal 2: Frontend (npm run dev in frontend folder)

Terminal 3: Tunnel (ngrok or localtunnel)

Visit installation URL:

text
https://your-tunnel-url/api/auth/install?shop=your-store.myshopify.com
Authorize the app on Shopify

Access dashboard at http://localhost:5173/dashboard

Click "Sync Orders" to fetch orders from your Shopify store

📊 Database Schema
Tables
shops

sql
- id (UUID, Primary Key)
- shop_domain (VARCHAR, Unique)
- access_token (TEXT)
- created_at (TIMESTAMP)
orders

sql
- id (UUID, Primary Key)
- shop_id (UUID, Foreign Key)
- shopify_order_id (BIGINT, Unique)
- order_number (VARCHAR)
- email (VARCHAR)
- total_price (DECIMAL)
- financial_status (VARCHAR)
- fulfillment_status (VARCHAR)
- created_at (TIMESTAMP)
- processed_at (TIMESTAMP)
fulfillment_items & order_images

Supporting tables for line items and product images

🔧 API Endpoints
Authentication
GET /api/auth/install - Initiate OAuth flow

GET /api/auth/callback - OAuth callback handler

Orders
GET /api/orders - Fetch all orders

GET /api/orders/:id - Get order by ID

POST /api/orders/sync - Sync orders from Shopify

GET /api/orders/filter - Filter orders by criteria

🎨 Features in Detail
Order Dashboard
View all orders in a clean table format

Real-time sync with Shopify

Filter by status (pending, fulfilled, cancelled)

Search by customer email or order number

Sort by date, amount, or status

Security
OAuth 2.0 authentication

Secure token storage

Environment variable protection

SQL injection prevention

Performance
Optimized database queries

Indexed columns for fast lookups

Efficient API calls with pagination

🐛 Troubleshooting
Database Connection Error
bash
Error: connection refused to localhost:5432
Solution: Ensure PostgreSQL is running

bash
# Windows: Check services
services.msc → PostgreSQL

# Or restart:
pg_ctl restart
Port Already in Use
bash
Error: Port 5000 is already in use
Solution: Change port in .env or kill the process

bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [process_id] /F
OAuth Redirect Error
text
Error: redirect_uri mismatch
Solution: Ensure SHOPIFY_REDIRECT_URI in .env matches the URL configured in Shopify Partner Dashboard

📝 Environment Variables
Variable	Description	Example
PORT	Backend server port	5000
SHOPIFY_API_KEY	Shopify app Client ID	abc123...
SHOPIFY_API_SECRET	Shopify app Client Secret	shpss_...
SHOPIFY_SCOPES	Required API scopes	read_orders,read_products
DB_HOST	PostgreSQL host	localhost
DB_PASSWORD	PostgreSQL password	your_password
🚀 Deployment
Deploy to Heroku
bash
# Install Heroku CLI
heroku login
heroku create shopify-order-dashboard

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SHOPIFY_API_KEY=your_key
heroku config:set SHOPIFY_API_SECRET=your_secret

# Deploy
git push heroku main
Deploy to Vercel (Frontend)
bash
cd frontend
vercel
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

📄 License
This project is licensed under the MIT License.

👨‍💻 Author
Gurmeet

GitHub: https://github.com/Guri9368

Email: gurigurmeet1234567@gmail.com

🙏 Acknowledgments
Shopify API Documentation

React Documentation

PostgreSQL Documentation

 <img width="1919" height="939" alt="image" src="https://github.com/user-attachments/assets/3e7d16c0-282d-4daa-a4c4-ca196a79c957" />


Made with ❤️ for internship assessment
