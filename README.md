# Node.js Blog

A full-stack, server-rendered blog built with **Node.js**, **Express**, **MongoDB**, and **EJS**.

This project was built to practice and showcase backend engineering skills: routing, authentication, data modeling, CRUD operations, search, pagination, and protected admin workflows.

---

## Live Demo

> Add your deployed URL here after hosting  
> Example: `https://your-app.onrender.com`

---

## Overview

The app has two sides:

| Area | Purpose |
|------|---------|
| **Public site** | Browse posts, search content, read about/contact pages |
| **Admin panel** | Register/login, manage posts (create, edit, delete) |

Authentication is handled with **JWT stored in an HTTP-only cookie**. Passwords are hashed with **bcrypt** before being saved to MongoDB.

---

## Features

### Public
- Home page with latest posts
- Pagination for post lists
- Single post page
- Full-text style search (title + body)
- About page
- Contact form with server-side validation
- Custom 404 page
- Active navigation highlighting

### Admin
- User registration & login
- JWT authentication (HTTP-only cookie)
- Protected dashboard
- Create / edit / delete posts (CRUD)
- Method override for `PUT` and `DELETE` from HTML forms
- Logout and cookie cleanup
- Friendly error messages (no raw JSON responses for form actions)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Views | EJS + express-ejs-layouts |
| Auth | JSON Web Tokens (`jsonwebtoken`) |
| Password security | bcrypt |
| Cookies | cookie-parser |
| Forms | method-override |
| Config | dotenv |
| Dev tooling | nodemon |

---

## Project Structure

```text
nodejs-blog/
├── app.js                      # App entry point & middleware
├── package.json
├── .env                        # Environment variables (not committed)
├── .gitignore
├── public/
│   ├── css/index.css           # Styles
│   ├── js/script.js            # Search UI behavior
│   └── images/                 # Static assets
├── server/
│   ├── config/db.js            # MongoDB connection
│   ├── helpers/routeHelpers.js # Active route helper
│   ├── models/
│   │   ├── Post.js             # Post schema
│   │   └── User.js             # User schema
│   └── routes/
│       ├── main.js             # Public routes
│       └── admin.js            # Auth + admin CRUD routes
└── views/
    ├── layouts/                # Main & admin layouts
    ├── partials/               # Header, footer, search
    ├── admin/                  # Dashboard & post forms
    ├── index.ejs
    ├── post.ejs
    ├── search.ejs
    ├── about.ejs
    ├── contact.ejs
    └── 404.ejs
```

---

## Architecture Notes

### Request flow
1. Express receives the request
2. Middleware runs (`urlencoded`, cookies, method-override, static files)
3. Route handlers in `main.js` / `admin.js` process logic
4. Mongoose talks to MongoDB
5. EJS renders the response with the correct layout

### Authentication flow
1. User registers or logs in
2. Password is verified / hashed with bcrypt
3. Server signs a JWT containing `userId`
4. Token is stored in an **HTTP-only** cookie
5. `authMiddleware` protects admin routes
6. Logout clears the cookie

### Data models

**User**
- `username` (unique, required)
- `password` (hashed, required)

**Post**
- `title` (required)
- `body` (required)
- `createdAt` / `updatedAt` (timestamps)

---

## Getting Started

### Prerequisites
- Node.js 18+ recommended
- MongoDB Atlas account (or local MongoDB)
- Git

### 1) Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/nodejs-blog.git
cd nodejs-blog
```

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5001
DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@CLUSTER/DB_NAME
JWT_SECRET=your_strong_secret_key
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default fallback: `3000`) |
| `DATABASE_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign/verify JWT tokens |

> Never commit `.env` to GitHub. It is ignored by `.gitignore`.

### 4) Seed dummy posts (optional)

Insert 20 sample posts for demos and first-time setup:

```bash
npm run seed
```

If posts already exist and you want to replace them:

```bash
npm run seed -- --force
```

### 5) Run the app

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Then open:

```text
http://localhost:5001
```

Admin panel:

```text
http://localhost:5001/admin
```

---

## Routes Reference

### Public routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Home page with paginated posts |
| `GET` | `/post/:id` | Single post details |
| `POST` | `/search` | Search posts by title/body |
| `GET` | `/about` | About page |
| `GET` | `/contact` | Contact form page |
| `POST` | `/contact` | Submit contact form |

### Admin / Auth routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/admin` | No | Login & register page |
| `POST` | `/admin` | No | Login |
| `POST` | `/register` | No | Register + auto login |
| `GET` | `/dashboard` | Yes | Admin dashboard |
| `GET` | `/add-post` | Yes | Create post form |
| `POST` | `/add-post` | Yes | Save new post |
| `GET` | `/edit-post/:id` | Yes | Edit post form |
| `PUT` | `/edit-post/:id` | Yes | Update post |
| `DELETE` | `/delete-post/:id` | Yes | Delete post |
| `GET` | `/logout` | No | Clear auth cookie |

---

## How to Use the Admin Panel

1. Go to `/admin`
2. Register a new account (password minimum 6 characters)
3. You will be redirected to `/dashboard` automatically
4. Click **Add New** to create a post
5. Use **Edit** / **Delete** to manage existing posts
6. Click **Logout** to end the session

---

## What This Project Demonstrates

- Building a complete Express backend from scratch
- Connecting and querying MongoDB with Mongoose
- Designing schemas and validating input
- Implementing secure authentication (JWT + bcrypt + cookies)
- Protecting routes with middleware
- Server-side rendering with EJS layouts/partials
- CRUD operations for real resources
- Search and pagination patterns
- Handling form submissions and HTTP method overrides
- Environment-based configuration
- Clean project separation (`routes`, `models`, `config`, `views`)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-restart) |
| `npm start` | Start with Node |

---

## Security Notes

- Passwords are hashed with bcrypt (never stored in plain text)
- JWT is stored in an HTTP-only cookie to reduce XSS token theft risk
- Admin routes are protected by auth middleware
- Sensitive config lives in `.env` (not in source control)

> For production, also enable HTTPS, stronger secrets, rate limiting, and stricter cookie flags (`secure`, `sameSite`).

---

## Future Improvements

- [ ] Role-based access (admin vs editor)
- [ ] Image upload for posts
- [ ] Rich text editor
- [ ] Flash messages with sessions
- [ ] Email sending for contact form
- [ ] Unit / integration tests
- [ ] Deploy to Render / Railway / Vercel

---

## Author

**Omar Othman**  
Full Stack Developer

- GitHub: [Your GitHub Profile](https://github.com/YOUR_USERNAME)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/YOUR_USERNAME)

---

## License

This project is open source and available under the [ISC License](LICENSE).
