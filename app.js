require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
// using csurf to prevent CSRF Attacks
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_PASS}@cluster0.ir4appl.mongodb.net/shop?retryWrites=true&w=majority`;

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpq" ||
    file.mimetype === "image/jeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: "my secret",
    resave: false, // is meaning the session will not be saved on every request that is done => performance
    saveUninitialized: false, // ensure that no session gets saved for a request where it doesn't need to be saved because nothing was changed about it
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

// fetch user in middleware before routing
app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});
// Add csrfToken in Middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  // console.log('res.locals', res.locals);
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

mongoose.set("strictQuery", false);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("DB connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log("DB connect fail");
    console.log("err", err);
  });
