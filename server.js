const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.error(err.name, err.message);
  console.error("shutting down the server due to uncaught exception...");
  process.exit(1);
});

// Load environment variables from .env file
dotenv.config({ path: "./config.env" });

const app = require("./app");

// if (process.env.NODE_ENV === "development") {
const DB = process.env.DATABASE;
// }

// const DB = process.env.PROD_DATABASE;

// const DB =
//   process.env.NODE_ENV === "development"
//     ? process.env.DATABASE
//     : process.env.PROD_DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    socketTimeoutMS: 45000, // 45 seconds timeout
  })
  .then(() => console.log("DB Connection Established!"))
  .catch((err) => {
    console.error("DB Connection Failed! Shutting down the server...");
    console.error(err);
    process.exit(1);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! 💥 Shutting down the server...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SiGTERM', () => {
  console.log('SIGTERM received. Shutting down the server...');
  server.close(() => {
    console.log('💥 Process Terminated')
  });
})