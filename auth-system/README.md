# 🔐 Full-Stack JWT Authentication System

> Production-ready signup/login auth using React + Vite, Node.js, Express, MongoDB, and JWT.

---

## 📁 Project Structure

```
auth-system/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   └── authController.js   # Signup, Login, GetMe logic
│   ├── middleware/
│   │   ├── auth.js             # JWT verification middleware
│   │   └── errorHandler.js     # Centralized error handling
│   ├── models/
│   │   └── User.js             # Mongoose User schema
│   ├── routes/
│   │   └── authRoutes.js       # Route definitions + validation
│   ├── utils/
│   │   └── jwt.js              # generateToken / verifyToken helpers
│   ├── .env.example            # Environment variable template
│   ├── package.json
│   └── server.js               # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── PrivateRoute.jsx    # Protects authenticated routes
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state (login/logout)
    │   ├── hooks/
    │   │   └── useForm.js          # Custom form + validation hook
    │   ├── pages/
    │   │   ├── SignupPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── DashboardPage.jsx
    │   ├── services/
    │   │   └── api.js              # Axios instance with JWT interceptor
    │   ├── App.jsx                 # Router setup
    │   ├── main.jsx
    │   └── index.css               # Global design system
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚡ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- npm or yarn

---

### 1. Clone / Extract the project

```bash
cd auth-system
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://pikadee015_db_user:2s2cGw2PenGnBP1Z@cluster0.rk4ahjd.mongodb.net/mern-auth?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=58108f93b322754b98761968c8fe2b64f6727d05147648cd6885921e4d9cea1f4ac054ba1969a866a4ab6fbd9dcbe3afc02810bda4eafdc621a89fd6719bf635
NODE_ENV=development
```

> **MongoDB Atlas** (cloud): replace MONGO_URI with your Atlas connection string.

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open: **http://localhost:5173**

---

## 🌐 API Reference

### POST `/api/auth/signup`

```json
// Request Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "confirmPassword": "secret123"
}

// Success Response (201)
{
  "success": true,
  "message": "Account created successfully! Please log in.",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "createdAt": "..." }
}
```

### POST `/api/auth/login`

```json
// Request Body
{
  "email": "john@example.com",
  "password": "secret123"
}

// Success Response (200)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

### GET `/api/auth/me` *(Protected)*

```
Headers: Authorization: Bearer <token>
```

---

## 🧪 Testing with Postman

1. **Health check**: `GET http://localhost:5000/api/health`

2. **Signup**:
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/signup`
   - Body: raw JSON (see above)

3. **Login**:
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/login`
   - Copy the `token` from the response

4. **Get Profile** (protected):
   - Method: `GET`
   - URL: `http://localhost:5000/api/auth/me`
   - Header: `Authorization: Bearer <paste token here>`

5. **Test invalid token**: Change one character in the token → expect `401 Invalid token`

---

## 🎤 Interview Explanation

### 1. Folder Structure
> "I separated concerns clearly. The backend follows MVC: **models** define data shape, **controllers** hold business logic, **routes** define endpoints, and **middleware** handles cross-cutting concerns like auth and errors. The frontend uses a **context** for global state, a **services** layer for all API calls, and **pages** for each view."

---

### 2. API Flow

```
Client → POST /api/auth/login
       → Express route receives request
       → express-validator checks email/password format
       → Controller: find user in MongoDB
       → bcrypt.compare() checks password
       → generateToken() creates JWT
       → Response: { token, user }
```

---

### 3. Authentication Flow

```
1. User signs up → password hashed with bcrypt (12 salt rounds) → stored in MongoDB
2. User logs in → bcrypt.compare() → JWT generated with userId + email → returned to client
3. Client stores JWT in localStorage
4. Every subsequent request: Axios interceptor attaches "Authorization: Bearer <token>"
5. Backend protect middleware: extracts token → jwt.verify() → attaches user to req.user
6. Protected controller runs with req.user available
```

---

### 4. JWT Working

> "JWT has 3 parts separated by dots: **Header** (algorithm), **Payload** (userId, email, expiry), and **Signature** (HMAC-SHA256 of header+payload using JWT_SECRET). The server never stores the token — it just re-verifies the signature on each request. If someone tampers with the payload, the signature won't match and we return 401."

```
eyJhbGciOiJIUzI1NiJ9  ← Header (base64)
.eyJ1c2VySWQiOiIuLi4ifQ  ← Payload (base64)
.SflKxwRJSMeKKF2QT4fw  ← Signature (HMAC)
```

---

### 5. Database Schema

```javascript
User {
  name:      String   // required, 2-50 chars
  email:     String   // required, unique, lowercase, regex validated
  password:  String   // hashed (never returned in queries — select: false)
  createdAt: Date     // auto-generated by timestamps: true
  updatedAt: Date     // auto-generated by timestamps: true
}
```

> "The `select: false` on password means Mongoose never returns it by default — I have to explicitly do `.select('+password')` in the login controller where I need it to compare."

---

### 6. Security Best Practices Used

| Practice | Implementation |
|---|---|
| Password hashing | bcrypt with 12 salt rounds |
| No password in responses | `select: false` + `toJSON()` override |
| Generic login error | "Invalid email or password" (prevents email enumeration) |
| Token expiry | JWT expires in 1 day |
| CORS configured | Only allows frontend origin |
| Environment variables | All secrets in `.env` |
| Centralized errors | One errorHandler middleware |

---

## 🎁 Bonus Features Included

- ✅ Logout functionality (clears token + context state)
- ✅ Token expiration handling (auto-redirect to login with message)
- ✅ Loading spinners on all async actions
- ✅ Session restore on page refresh (localStorage → context)
- ✅ Protected route redirects with return-to path
- ✅ Real-time field validation on blur
- ✅ Server-side validation with express-validator


---

## 🚀 Production Deployment Guide

### Backend — Deploy to Render / Railway / Fly.io

1. Push `backend/` to a GitHub repo
2. Create a new Web Service, set **build command**: `npm install`, **start command**: `npm start`
3. Set these environment variables in the dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://...your Atlas URI...
   JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
   CLIENT_URL=https://your-frontend.vercel.app
   ```

### Frontend — Deploy to Vercel / Netlify

1. Push `frontend/` to GitHub
2. Import into Vercel/Netlify
3. Set this environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```
4. Build command: `npm run build`, Output dir: `dist`

### MongoDB Atlas (free tier)

1. Go to https://cloud.mongodb.com → Create free cluster
2. Database Access → Add user with password
3. Network Access → Allow `0.0.0.0/0` (or your server IP)
4. Connect → Drivers → copy the connection string → paste into `MONGO_URI`

---

## 🔒 Security Features in Production Build

| Feature | Implementation |
|---|---|
| HTTP security headers | `helmet` middleware |
| Brute force protection | `express-rate-limit` (10 auth attempts / 15min / IP) |
| Global rate limit | 100 requests / 15min / IP |
| Body size limit | 10kb max (prevents DoS) |
| Password hashing | bcrypt, 12 salt rounds |
| JWT expiry | 24 hours |
| Email enumeration prevention | Generic "invalid email or password" |
| Startup env validation | Crashes clearly if secrets missing |
| CORS locked | Only allows `CLIENT_URL` origin |
| Request timeout | 10 seconds (frontend Axios) |
