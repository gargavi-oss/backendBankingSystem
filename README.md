# 💳 Banking Transaction Backend API

A secure banking backend built with **Node.js**, **Express.js**, and **MongoDB** that supports user authentication, account management, balance tracking, and fund transfers with idempotency protection.

## 🚀 Features

* User Registration & Authentication
* JWT-Based Authorization
* Multi-Account Support
* Account Balance Management
* Secure Fund Transfers
* Idempotent Transactions
* Initial System Funding
* Transaction Ledger Tracking
* Logout Functionality
* MongoDB Integration

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt.js
* REST APIs

---

## 📂 Project Structure

```bash
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── services/
├── db/
└── index.js
├── app.js
└── constant.js


```

---

## 🔐 Authentication APIs

### Register User

```http
POST /api/auth/register
```

Request Body:

```json
{
  "name": "Avi",
  "email": "user@example.com",
  "password": "Password@123"
}
```

### Login

```http
POST /api/auth/login
```

Request Body:

```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

### Logout

```http
POST /api/auth/logout
```

---

## 🏦 Account APIs

### Create Account

```http
POST /api/accounts/create
```

Request Body:

```json
{
  "currency": "USD"
}
```

### Get User Accounts

```http
GET /api/accounts/info
```

### Get Account Balance

```http
GET /api/accounts/balance/:accountId
```

Example:

```http
GET /api/accounts/balance/ACCOUNT_ID
```

---

## 💸 Transaction APIs

### Initial System Funding

Used to provide initial funds to a newly created account through a dedicated system-controlled account.

```http
POST /api/transactions/system/intial-funds
```

#### Request Body

```json
{
  "toAccount": "ACCOUNT_ID",
  "amount": 10000,
  "idempotencyKey": "unique-key"
}
```

> **Security Note**
>
> Initial fund issuance is restricted to a dedicated **System Account/User**. Regular users cannot create money or release initial funds. This design ensures controlled money issuance, prevents unauthorized balance creation, and maintains the integrity of the transaction ledger.


### Transfer Funds

```http
POST /api/transactions/create
```

Request Body:

```json
{
  "fromAccount": "ACCOUNT_ID",
  "toAccount": "ACCOUNT_ID",
  "amount": 4000,
  "idempotencyKey": "unique-key"
}
```

---

## 🔄 Idempotency Support

To prevent duplicate transactions caused by retries or network failures, each transaction requires a unique idempotency key.

```json
{
  "idempotencyKey": "unique-key"
}
```

A transaction with the same key will only be processed once.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

EMAIL_PASS=your_email_password
```

---

## ▶️ Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/banking-transaction-backend.git
cd banking-transaction-backend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run in production:

```bash
npm start
```

---

## 🧪 API Testing

The project includes a Postman collection covering:

* User Registration
* Login
* Account Creation
* Balance Inquiry
* Initial Funding
* Fund Transfer
* Logout

Import the Postman collection and test all endpoints locally.

---

## 🔒 Security Features

* Password Hashing using bcrypt
* JWT Authentication
* Protected Routes
* Transaction Idempotency
* Input Validation
* Secure Database Operations

---

## 📈 Future Enhancements

* Transaction History
* Account Statements
* Currency Conversion
* Rate Limiting
* Fraud Detection System
* Admin Dashboard
* Email & SMS Notifications

---

## 👨‍💻 Author

### Avi Garg

Backend Developer passionate about building scalable and secure systems using Node.js, Express, MongoDB, and modern backend architecture.

**Skills:** Node.js • Express.js • MongoDB • REST APIs • JWT • Mongoose • System Design
