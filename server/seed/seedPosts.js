require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("../models/Post");

const posts = [
  {
    title: "Learn the basics of Node.js and its architecture",
    body: "Node.js is a JavaScript runtime built on Chrome's V8 engine. Learn how its event-driven, non-blocking architecture works and why it is popular for building scalable backend applications.",
  },
  {
    title: "Discover how to use Express.js",
    body: "Express.js is a minimal and flexible Node.js web framework. This post covers routing, middleware, request handling, and how to structure a clean Express application.",
  },
  {
    title: "Building APIs with Node.js",
    body: "Learn how to design and build RESTful APIs using Node.js and Express. Topics include route design, status codes, validation, and returning consistent JSON responses.",
  },
  {
    title: "Understand how to work with MongoDB and Mongoose",
    body: "MongoDB stores documents in a flexible JSON-like format. Mongoose adds schemas, validation, and helpful query helpers to make working with MongoDB in Node.js easier and safer.",
  },
  {
    title: "Authentication and Authorization in Node.js",
    body: "Explore authentication patterns in Node.js apps, including username/password login, JWT tokens, HTTP-only cookies, protected routes, and role-based access ideas.",
  },
  {
    title: "Password Security with bcrypt",
    body: "Never store plain-text passwords. This post explains hashing, salting, and how bcrypt helps protect user credentials even if your database is exposed.",
  },
  {
    title: "Working with JWT and Cookies",
    body: "JSON Web Tokens are useful for stateless authentication. Learn how to sign tokens, verify them in middleware, and store them securely using HTTP-only cookies.",
  },
  {
    title: "Asynchronous Programming with Node.js",
    body: "Callbacks, promises, and async/await are core to Node.js. Understand how asynchronous code works and how to avoid common pitfalls like unhandled promise rejections.",
  },
  {
    title: "Server-Side Rendering with EJS",
    body: "EJS lets you generate HTML on the server with JavaScript templates. Learn layouts, partials, loops, conditionals, and how SSR helps SEO and first-page load speed.",
  },
  {
    title: "CRUD Operations Explained",
    body: "Create, Read, Update, and Delete are the foundation of most apps. This post walks through implementing full CRUD for blog posts using Express routes and Mongoose models.",
  },
  {
    title: "Search and Filtering in MongoDB",
    body: "Learn how to search documents with regular expressions, combine multiple conditions with $or, and return useful results for a blog search feature.",
  },
  {
    title: "Pagination for Large Data Sets",
    body: "Loading every record at once does not scale. Discover how skip/limit pagination works, how to calculate next pages, and how to keep list pages fast.",
  },
  {
    title: "Middleware in Express Applications",
    body: "Middleware functions sit between the request and your final route handler. Use them for logging, authentication, parsing bodies, and centralized error handling.",
  },
  {
    title: "Environment Variables and Configuration",
    body: "Keep secrets out of source control. Learn how dotenv works, which values belong in .env, and how to configure apps differently for development and production.",
  },
  {
    title: "Handling Forms and method-override",
    body: "HTML forms mainly support GET and POST. With method-override, your app can support PUT and DELETE from forms, which is useful for update and delete actions in admin panels.",
  },
  {
    title: "Deployment of Node.js applications",
    body: "Understand the steps for deploying a Node.js app: environment variables, database access, build/start scripts, and common hosting options for backend projects.",
  },
  {
    title: "Error Handling Best Practices",
    body: "Good apps fail gracefully. Learn how to catch route errors, return useful messages to users, log details for developers, and avoid leaking sensitive information.",
  },
  {
    title: "Designing Clean Project Structure",
    body: "Separate routes, models, config, helpers, and views to keep your codebase maintainable. A clear folder structure makes collaboration and future features much easier.",
  },
  {
    title: "Building an Admin Dashboard",
    body: "An admin panel is where content management happens. Learn how to protect dashboard routes, list resources, and provide create/edit/delete workflows for blog posts.",
  },
  {
    title: "From Tutorial to Portfolio Project",
    body: "Turn learning into proof of skill. This post covers how a Node.js blog can demonstrate backend fundamentals on GitHub: auth, CRUD, MongoDB, SSR, and clean architecture.",
  },
];

async function seedPosts() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to database");

    const force = process.argv.includes("--force");
    const existingCount = await Post.countDocuments();

    if (existingCount > 0 && !force) {
      console.log(`Skipped seeding: ${existingCount} posts already exist.`);
      console.log("Run with --force to delete existing posts and re-seed:");
      console.log("  npm run seed -- --force");
      process.exit(0);
    }

    if (force) {
      await Post.deleteMany({});
      console.log("Existing posts deleted");
    }

    await Post.insertMany(posts);
    console.log(`Seeded ${posts.length} dummy posts successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

seedPosts();
