# Prisma Press Backend

A modern, scalable RESTful Blog API built with **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

The backend provides complete authentication, user management, blog posts, comments, profile management, role-based authorization, and admin analytics.

---

## 🚀 Features

### Authentication
- JWT Authentication
- Access Token & Refresh Token
- HTTP-only Cookies
- Secure Password Hashing using bcrypt
- Token Refresh API

### User Management
- User Registration
- User Login
- Get Current User
- Update Profile
- Profile Creation with User Registration

### Blog Posts
- Create Posts
- Update Posts
- Delete Posts
- Get Single Post
- Get All Posts
- Search Posts
- Pagination
- Sorting
- Filter by:
  - Tags
  - Status
  - Featured
  - Author
- View Count Tracking
- My Posts API

### Comments
- Create Comment
- Update Own Comment
- Delete Own Comment
- Get Comment by ID
- Get Comments by Author
- Comment Moderation (Admin)
- Ownership Validation

### Admin Features
- Dashboard Statistics
- User Statistics
- Post Statistics
- Comment Statistics
- Total Views

### Security
- JWT Authentication
- Role Based Authorization
- Protected Routes
- Password Hashing
- HTTP-only Cookies
- Global Error Handling

---

# 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| Authentication | JWT |
| Password Hashing | bcrypt |
| Cookie Handling | cookie-parser |
| CORS | cors |
| Environment | dotenv |

---

# 📁 Project Structure

```
src
│
├── app
│   ├── config
│   ├── middleware
│   ├── modules
│   │   ├── auth
│   │   ├── users
│   │   ├── posts
│   │   ├── comments
│   │   └── profile
│   │
│   ├── routes
│   ├── helpers
│   ├── interfaces
│   ├── types
│   └── utils
│
├── app.ts
├── server.ts
└── generated
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/your-username/prisma-press-backend.git
```

Move into the project

```bash
cd prisma-press-backend
```

Install dependencies

```bash
npm install
```

or

```bash
pnpm install
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

DATABASE_URL=

APP_URL=

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=1h

JWT_REFRESH_EXPIRES_IN=7d
```

---

# 🗄 Database Setup

Generate Prisma Client

```bash
npx prisma generate
```

Run Migration

```bash
npx prisma migrate dev
```

Seed Database (optional)

```bash
npx prisma db seed
```

---

# ▶️ Running the Project

Development

```bash
npm run dev
```

Production Build

```bash
npm run build
```

Start Production

```bash
npm start
```

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/login` |
| POST | `/api/auth/refresh-token` |

---

## Users

| Method | Endpoint |
|---------|----------|
| POST | `/api/users/register` |
| GET | `/api/users/me` |
| PUT | `/api/users/my-profile` |

---

## Posts

| Method | Endpoint |
|---------|----------|
| GET | `/api/posts` |
| GET | `/api/posts/my-posts` |
| GET | `/api/posts/stats` |
| GET | `/api/posts/:postId` |
| POST | `/api/posts` |
| PATCH | `/api/posts/:postId` |
| DELETE | `/api/posts/:postId` |

---

## Comments

| Method | Endpoint |
|---------|----------|
| GET | `/api/comments/:commentId` |
| GET | `/api/comments/author/:authorId` |
| POST | `/api/comments` |
| PATCH | `/api/comments/:commentId` |
| DELETE | `/api/comments/:commentId` |
| PATCH | `/api/comments/:commentId/moderate` |

---

# 🔍 Query Parameters

Posts API supports

```
search
tags
status
isFeatured
authorId
page
limit
sortBy
sortOrder
```

Example

```
GET /api/posts?search=prisma&page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

---

# 👤 Roles

There are two application roles.

- USER
- ADMIN

### USER

- Create Posts
- Update Own Posts
- Delete Own Posts
- Create Comments
- Update Own Comments
- Delete Own Comments

### ADMIN

- Manage Every Post
- Moderate Comments
- Access Statistics
- Full Administrative Privileges

---

# 📊 Statistics

Admin dashboard provides

- Total Users
- Admin Users
- Regular Users
- Total Posts
- Published Posts
- Draft Posts
- Archived Posts
- Total Comments
- Approved Comments
- Total Views

---

# 🔒 Authentication

Protected routes require an access token.

```
Authorization: <access_token>
```

Refresh token is stored as an HTTP-only cookie.

---

# ❌ Error Handling

The project includes

- Global Error Handler
- Prisma Error Handler
- Validation Error Handling
- 404 Route Handler
- Consistent API Response Format

---

# 📦 Scripts

```bash
npm run dev       # Development

npm run build     # Build Project

npm start         # Start Production

npm run lint      # Run Linter

npm run format    # Format Code
```

---

# 📚 Learning Objectives

This project demonstrates practical implementation of:

- REST API Design
- Express.js Architecture
- TypeScript Best Practices
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Role Based Authorization
- Cookie Authentication
- Pagination
- Search & Filtering
- Error Handling
- Modular Project Structure

---

# 🤝 Contributing

Contributions are welcome!

Feel free to fork the repository, create a new branch, and submit a pull request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Ahsan Habib**

Software Engineering Student

Backend Developer | TypeScript | Node.js | Express.js | Prisma | PostgreSQL