# Eventora - Event Booking Platform

Eventora is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to facilitate seamless event discovery, booking, and management. It includes advanced features like 2FA account verification via OTP and automated email confirmation alerts.

## 📂 Repository Structure

The project is structured as a monorepo:

*   **`client/`**: React application built with Vite and Tailwind CSS.
*   **`server/`**: The primary Node.js/Express API server (runs on Port `5000`) that handles users, events, and bookings.
*   **`api/`**: An alternative Express backend (runs on Port `3000`) for a Hotel & Room booking service (kept as reference).

---

## 🚀 Key Features

*   **Secure Authentication**: Register and login with secure password hashing (`bcryptjs`) and JWT token authentication.
*   **2FA OTP Verification**: Sends account verification and booking verification codes to user emails via Nodemailer.
*   **User Dashboard**: Users can browse upcoming events, book tickets, check booking statuses (`pending`, `confirmed`, `cancelled`), and cancel bookings.
*   **Admin Dashboard**: Admins can manage the platform by creating, editing, and deleting events, as well as confirming pending bookings.
*   **Capacity Control**: Real-time deduction and restoration of seat counts upon booking confirmation and cancellation.
*   **Automated Email Notifications**: Booking confirmations are instantly emailed to users.

---

## 🛠️ Tech Stack

*   **Frontend**: React (v19), React Router DOM (v7), Tailwind CSS, Axios, React Icons, Vite
*   **Backend**: Node.js, Express.js, Mongoose (MongoDB ODM), Nodemailer, JsonWebToken, BcryptJS
*   **Database**: MongoDB (Local or MongoDB Atlas)

---

## 💻 Local Setup & Installation

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system.

### 1. Configure the Backend (Server)
1. Navigate to the `server` directory:
    ```bash
    cd server
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/eventBooking   # Replace with Atlas URI if needed
    JWT_SECRET=your_jwt_secret_key
    EMAIL_USER=your_gmail_address
    EMAIL_PASS=your_gmail_app_password                 # 16-character App Password
    FRONTEND_URL=http://localhost:5173                 # Local frontend development port
    ```
4. Seed the database with sample users and events:
    ```bash
    node seed.js
    ```
5. Start the backend server in development mode:
    ```bash
    npm run dev
    ```

### 2. Configure the Frontend (Client)
1. Open a new terminal and navigate to the `client` directory:
    ```bash
    cd client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the `client` directory:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
4. Start the frontend development server:
    ```bash
    npm run dev
    ```

---

## 🧪 Default Test Accounts
If you ran the seed script (`node seed.js`), you can log in with:

*   **Admin Account**:
    *   **Email**: `admin@eventora.com`
    *   **Password**: `password123`
*   **User Account**:
    *   **Email**: `user@eventora.com`
    *   **Password**: `password123`

---

## 🌐 Deployment Configuration

### Frontend (Vercel)
Ensure the following Environment Variable is set in your Vercel Project Settings:
*   `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

### Backend (Render)
Configure these Environment Variables on the Render dashboard:
*   `MONGO_URI` = `mongodb+srv://<username>:<password>@cluster0...` (MongoDB Atlas connection string)
*   `PORT` = `5000`
*   `JWT_SECRET` = `your_jwt_secret_key`
*   `EMAIL_USER` = `your_gmail_address`
*   `EMAIL_PASS` = `your_gmail_app_password`
*   `FRONTEND_URL` = `https://your-vercel-frontend-domain.vercel.app`

*Note: Make sure to whitelist all IPs (`0.0.0.0/0`) in MongoDB Atlas Network Access so Render's cloud servers can connect successfully.*
