# 💳 Banking Transaction Backend API

A secure banking backend built with **Node.js**, **Express.js**, **MongoDB**, **Docker**, and **Express.js** that supports user authentication, account management, balance tracking, and fund transfers with idempotency protection.

---

## 🌐 Live Deployment

### AWS EC2

**Base URL**

```text
http://51.21.253.237:3000/
```

> The backend is containerized using **Docker** and deployed on an **AWS EC2** instance.

---

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
* Dockerized Deployment
* AWS EC2 Deployment

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcrypt.js
* REST APIs
* Docker
* Docker Compose
* AWS EC2
* Postman

---

## 📂 Project Structure

```text
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── services/
├── db/
├── index.js
├── app.js
└── constant.js
```

---

## 🐳 Docker

### Build Image

```bash
docker build -t banking-backend .
```

### Run Container

```bash
docker run -p 3000:3000 --env-file .env banking-backend
```

### Docker Compose

```bash
docker compose up --build
```

---

## ☁️ Deployment

The application is deployed on an **AWS EC2** instance using Docker.

Deployment workflow:

* Dockerized Node.js backend
* Docker Compose for container orchestration
* MongoDB Atlas as the cloud database
* AWS EC2 Ubuntu server hosting
* Environment variables managed using `.env`
* REST APIs exposed on port **3000**

Live URL:

```text
http://51.21.253.237:3000/
```

---

## 🔐 Authentication APIs

*(Keep your existing API documentation here.)*

---

## 🏦 Account APIs

*(Keep existing content.)*

---

## 💸 Transaction APIs

*(Keep existing content.)*

---

## 🔄 Idempotency Support

*(Keep existing content.)*

---

## ⚙️ Environment Variables

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

EMAIL_PASS=your_email_password
```

---

## ▶️ Installation

```bash
git clone https://github.com/yourusername/banking-transaction-backend.git

cd banking-transaction-backend

npm install

npm run dev
```

### Production

```bash
npm start
```

Or using Docker:

```bash
docker compose up --build
```

---

## 🧪 API Testing

The project includes a **Postman Collection** covering:

* User Registration
* Login
* Logout
* Account Creation
* Balance Inquiry
* Initial Funding
* Fund Transfer

---

## 🔒 Security Features

* JWT Authentication
* bcrypt Password Hashing
* Protected Routes
* Input Validation
* Transaction Idempotency
* Secure Database Operations
* Environment Variable Configuration

---

## 📈 Future Enhancements

* Transaction History
* Account Statements
* Currency Conversion
* Rate Limiting
* Fraud Detection
* Admin Dashboard
* Email & SMS Notifications

---

## 👨‍💻 Author

### Avi Garg

Backend Developer passionate about building scalable, secure, and cloud-native backend systems using Node.js, Express.js, MongoDB, Docker, AWS EC2, and modern backend architecture.

**Skills:** Node.js • Express.js • MongoDB • REST APIs • JWT • Docker • Docker Compose • AWS EC2 • Mongoose • System Design
