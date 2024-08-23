const express = require("express");
const session = require('express-session');
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require('cors');
const compression = require('compression');
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const AppError = require("./utils/appError");
const trafficTracker = require("./middlewares/trafficTracker");
const globalErrorHandler = require("./controllers/errorController");

// Import routes
const itemRouter = require("./routes/itemRoute");
const userRouter = require("./routes/userRoute");
const logoRouter = require("./routes/logoRoute");
const viewRouter = require("./routes/viewRoute");
const postRouter = require("./routes/postRoute");
const socialRouter = require("./routes/socialRoute");
const searchRoutes = require("./routes/searchRoute");
const reviewRouter = require("./routes/reviewRoute");
const trafficRouter = require("./routes/trafficRoute");
const projectRouter = require("./routes/projectRoute");
const contactRoutes = require("./routes/contactRoute");
const commentRoutes = require("./routes/commentRoute");
const categoryRoute = require("./routes/categoryRoute");
const purchaseRoute = require("./routes/purchaseRoute");
const createUploadDirs = require('./utils/createFolders');
require("./utils/cronJobs");
require('./utils/tokenCleanup');

const app = express();
app.enable('trust proxy')

createUploadDirs();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) GLOBAL MIDDLEWARES

// Enable CORS
app.use(cors());
app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers with CSP adjustments
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://i.pinimg.com"],
      connectSrc: ["'self'", "ws://localhost:3300", "https://api.ravepay.co"],
      scriptSrc: [
        "'self'",
        "https://unpkg.com",
        "https://checkout.flutterwave.com",
      ],
      frameSrc: ["'self'", "https://checkout-v3-ui-prod.f4b-flutterwave.com"],
      objectSrc: ["'none'"],

      // Add other sources as needed
    },
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set `secure: true` if using HTTPS
}));

// Compress response bodies
app.use(compression());

// Limiting the requests from one IP per hour
const limiter = rateLimit({
  max: 500, // Adjust as necessary
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "name",
      "email",
      "password",
      // Uncomment as necessary
      // 'passwordConfirm',
      // 'bio',
      // 'github',
      // 'linkedin',
      // 'twitter',
      // 'instagram',
    ],
  })
);

// Middleware to handle missing source maps gracefully
app.use((req, res, next) => {
  if (req.path.endsWith(".map")) {
    return res.status(404).send();
  }
  next();
});

// Add request timestamp
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(trafficTracker);

// 2) ROUTES

app.use("/", viewRouter);
app.use("/api", trafficRouter);
app.use("/api/v1", searchRoutes);
app.use("/api/v1/logo", logoRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/socials", socialRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/purchases", purchaseRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/contact-us", contactRoutes);

// Handle requests for favicon.ico
app.get("/favicon.ico", (req, res) => res.status(204).send());

// 3) ERROR HANDLER
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
