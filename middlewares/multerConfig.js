const multer = require('multer');
const path = require('path');



exports.createStorage = (dir) => 
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, dir));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
  });

  exports.createUpload = (dir) => {
  const storage = createStorage(dir);
  return multer({ storage });
};

// const profileUpload = createStorage('public/img/projects');
// const projectUpload = createUpload('public/img/projects');

// const profileUpload = createStorage('public/img/blogs');
// const blogUpload = createUpload('public/img/blogs');









// const storage = (destinationPath) => multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, destinationPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${ext}`);
//   },
// });

// const upload = (destinationPath) => multer({ storage: storage(destinationPath) });

// module.exports = upload;


