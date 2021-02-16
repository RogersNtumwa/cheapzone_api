const express = require("express");
const app = express();
const dotenv = require("dotenv");
const dbconnect = require("./src/config/database");
const path = require("path");

const products = require("./src/routes/product");
const categories = require("./src/routes/category");
const users = require("./src/routes/auth");
const roles = require("./src/routes/roles");
const orders = require("./src/routes/order");
const userRoute = require("./src/routes/user");

const appError = require("./src/utils/appError");

// security packages
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

app.use(express.json({ limit: "25mb" }));

// Sanitize data
app.use(mongoSanitize());

// Set security haeders
app.use(helmet());

// Prevent xss attacks
app.use(xss());

// Rate liimit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 minutes
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable cors
app.use(cors());

// access to environment variables
dotenv.config({ path: "./src/config/config.env" });

// serving static files
app.use(express.static(path.join(__dirname, "src/public")));

// connect to Database
dbconnect();

// api routes
app.use("/api/v1/products", products);
app.use("/api/v1/category", categories);
app.use("/api/v1/users", users);
app.use("/api/v1/roles", roles);
app.use("/api/v1/orders", orders);
app.use("/api/v1/user", userRoute);

// Error handling
app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res
    .status(err.statusCode)
    .json(
      { status: err.status, message: err.message } || "Unknown error occured"
    );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
