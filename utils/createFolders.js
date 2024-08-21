const fs = require("fs");
const path = require("path");

// Function to create directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    "public/uploads/images",
    "public/uploads/zips",
    "public/uploads/blogs",
    "public/uploads/projects",
    "public/uploads/users",
    "public/uploads/items",
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

module.exports = createUploadDirs;
