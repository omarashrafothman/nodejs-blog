require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const mainRoutes = require("./server/routes/main");
const adminRoutes = require("./server/routes/admin");
const port = process.env.PORT || 3000;

const connectDb = require("./server/config/db");
const { isActiveRoute } = require("./server/helpers/routeHelpers");

// middleware
const app = express();
connectDb();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

// templating engine
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main");
app.use(express.static("public"));

app.locals.isActiveRoute = isActiveRoute;

app.use("/", mainRoutes);
app.use("/", adminRoutes);

app.use((req, res) => {
  res.status(404).render("404", {
    locals: {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    },
    currentRoute: req.path,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
