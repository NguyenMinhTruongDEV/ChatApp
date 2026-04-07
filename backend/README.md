# 🚀 ChatApp Backend

Backend cho ứng dụng ChatApp sử dụng Node.js, Express và MongoDB.
Cung cấp API cho đăng ký, đăng nhập, và hệ thống chat realtime.

---

## 📌 Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Socket.io (Realtime)
* Cloudinary (Upload ảnh - nếu có)

---

## ⚙️ Cài đặt

### 1. Di chuyển vào thư mục backend

```bash
cd backend
```

### 2. Cài dependencies

```bash
npm install
```

### 3. Tạo file `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

# Cloudinary (nếu dùng)
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
```

---

## ▶️ Chạy server

```bash
npm run dev
```

👉 Server chạy tại:
http://localhost:5000

---

## 📂 Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── app.js
├── server.js
├── package.json
└── .env
```

---

## 🔐 Authentication

Sử dụng JWT:

Header:

```
Authorization: Bearer <token>
```

---

## 📡 API cơ bản

### Auth

* POST /api/auth/register
* POST /api/auth/login

### User

* GET /api/users
* GET /api/users/:id

### Message

* GET /api/messages/:conversationId
* POST /api/messages

---

## 🔄 Realtime

* Kết nối bằng Socket.io
* Gửi và nhận tin nhắn realtime
* Hiển thị trạng thái online/offline

---

## 📌 Lưu ý

* Không push file `.env` lên GitHub
* Đảm bảo MongoDB đang chạy
* Kiểm tra port nếu bị trùng

---

## 👨‍💻 Author

* Nguyen Minh Truong
