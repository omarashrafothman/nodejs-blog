const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

/**
 * GET /
 * HOME
 */
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const perPage = 10;
    const page = parseInt(req.query.page, 10) || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments({});
    const nextPage = page + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

/**
 * GET /post/:id
 * Post
 */
router.get("/post/:id", async (req, res) => {
  try {
    const slug = req.params.id;
    const data = await Post.findById(slug);

    if (!data) {
      return res.status(404).render("404", {
        locals: {
          title: "Post Not Found",
          description: "The requested post could not be found.",
        },
        currentRoute: "/",
      });
    }

    const locals = {
      title: data.title,
      description: data.body.substring(0, 160),
    };

    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.log(error);
    res.status(404).render("404", {
      locals: {
        title: "Post Not Found",
        description: "The requested post could not be found.",
      },
      currentRoute: "/",
    });
  }
});

/**
 * POST /search
 * Search posts
 */
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Search results for NodeJs Blog.",
    };

    const searchTerm = req.body.searchTerm || "";
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    }).sort({ createdAt: -1 });

    res.render("search", {
      data,
      locals,
      currentRoute: "/",
      searchTerm,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

/**
 * GET /about
 * About
 */
router.get("/about", (req, res) => {
  res.render("about", {
    locals: {
      title: "About",
      description: "About Omar Othman and this NodeJs Blog project.",
    },
    currentRoute: "/about",
  });
});

/**
 * GET /contact
 * Contact
 */
router.get("/contact", (req, res) => {
  res.render("contact", {
    locals: {
      title: "Contact",
      description: "Contact form for NodeJs Blog.",
    },
    currentRoute: "/contact",
    success: req.query.success || null,
    error: req.query.error || null,
  });
});

/**
 * POST /contact
 * Contact form submit
 */
router.post("/contact", (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim();
  const message = (req.body.message || "").trim();

  if (!name || !email || !message) {
    return res.redirect("/contact?error=" + encodeURIComponent("All fields are required"));
  }

  // Demo backend handling: validate then acknowledge. No email provider wired yet.
  console.log("Contact message:", { name, email, message });
  res.redirect("/contact?success=" + encodeURIComponent("Thanks! Your message was received."));
});

module.exports = router;
