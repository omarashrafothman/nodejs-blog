const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

/**
 * Check Login
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/admin");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.redirect("/admin");
  }
};

const createToken = (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "1d" });
};

/**
 * GET /admin
 * Admin - Login / Register Page
 */
router.get("/admin", async (req, res) => {
  try {
    if (req.cookies.token) {
      try {
        jwt.verify(req.cookies.token, jwtSecret);
        return res.redirect("/dashboard");
      } catch (error) {
        res.clearCookie("token");
      }
    }

    const locals = {
      title: "Admin",
      description: "Admin login and registration for NodeJs Blog.",
    };

    res.render("admin/index", {
      locals,
      layout: adminLayout,
      error: req.query.error || null,
      success: req.query.success || null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

/**
 * POST /admin
 * Admin - Check Login
 */
router.post("/admin", async (req, res) => {
  try {
    const username = (req.body.username || "").trim();
    const password = req.body.password || "";

    if (!username || !password) {
      return res.redirect("/admin?error=" + encodeURIComponent("Username and password are required"));
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.redirect("/admin?error=" + encodeURIComponent("Invalid credentials"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.redirect("/admin?error=" + encodeURIComponent("Invalid credentials"));
    }

    const token = createToken(user._id);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.redirect("/admin?error=" + encodeURIComponent("Login failed. Please try again."));
  }
});

/**
 * POST /register
 * Admin - Register
 */
router.post("/register", async (req, res) => {
  try {
    const username = (req.body.username || "").trim();
    const password = req.body.password || "";

    if (!username || !password) {
      return res.redirect("/admin?error=" + encodeURIComponent("Username and password are required"));
    }

    if (username.length < 3) {
      return res.redirect("/admin?error=" + encodeURIComponent("Username must be at least 3 characters"));
    }

    if (password.length < 6) {
      return res.redirect("/admin?error=" + encodeURIComponent("Password must be at least 6 characters"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    const token = createToken(user._id);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.redirect("/admin?error=" + encodeURIComponent("Username already in use"));
    }

    res.redirect("/admin?error=" + encodeURIComponent("Registration failed. Please try again."));
  }
});

/**
 * GET /dashboard
 * Admin Dashboard
 */
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Admin dashboard for managing blog posts.",
    };

    const data = await Post.find().sort({ createdAt: -1 });
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

/**
 * GET /add-post
 * Admin - Create New Post Form
 */
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Create a new blog post.",
    };

    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
      error: req.query.error || null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

/**
 * POST /add-post
 * Admin - Create New Post
 */
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    const title = (req.body.title || "").trim();
    const body = (req.body.body || "").trim();

    if (!title || !body) {
      return res.redirect("/add-post?error=" + encodeURIComponent("Title and content are required"));
    }

    await Post.create({ title, body });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.redirect("/add-post?error=" + encodeURIComponent("Could not create post"));
  }
});

/**
 * GET /edit-post/:id
 * Admin - Edit Post Form
 */
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Edit an existing blog post.",
    };

    const data = await Post.findById(req.params.id);

    if (!data) {
      return res.redirect("/dashboard");
    }

    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
      error: req.query.error || null,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/dashboard");
  }
});

/**
 * PUT /edit-post/:id
 * Admin - Update Post
 */
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const title = (req.body.title || "").trim();
    const body = (req.body.body || "").trim();

    if (!title || !body) {
      return res.redirect(
        `/edit-post/${req.params.id}?error=` + encodeURIComponent("Title and content are required")
      );
    }

    await Post.findByIdAndUpdate(req.params.id, {
      title,
      body,
      updatedAt: Date.now(),
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.redirect(`/edit-post/${req.params.id}?error=` + encodeURIComponent("Could not update post"));
  }
});

/**
 * DELETE /delete-post/:id
 * Admin - Delete Post
 */
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.redirect("/dashboard");
  }
});

/**
 * GET /logout
 * Admin Logout
 */
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin");
});

module.exports = router;
