const Project = require("./../models/projectModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const upload = require("./../middlewares/multerConfig");

// Set up multer for file uploads
// const projectUpload = upload("public/img/projects");

exports.getProject = factory.getOne(Project);
exports.getAllProjects = factory.getAll(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);
// exports.uploadProjectImages = projectUpload.fields([
//   { name: "desktopImg" },
//   { name: "mobileImg" },
// ]);

// exports.createProject = catchAsync(async (req, res) => {
//   console.log("Request body:", req.body); // Log body data
//   console.log("Request files:", req.files); // Log files

//   const { title, description, liveUrl, githubUrl, technologies } = req.body;
//   const desktopImg = req.files.desktopImg[0].filename;
//   const mobileImg = req.files.mobileImg[0].filename;

//   // Ensure technologies is an array
//   let techArray;
//   try {
//     techArray = JSON.parse(technologies);
//     if (!Array.isArray(techArray)) {
//       throw new Error("Technologies should be an array");
//     }
//   } catch (e) {
//     // If parsing fails, assume it's a comma-separated string
//     techArray = technologies.split(",").map((tech) => tech.trim());
//   }

//   // Save the project to the database
//   const newProject = await Project.create({
//     title,
//     description,
//     liveUrl,
//     githubUrl,
//     technologies: techArray,
//     desktopImg,
//     mobileImg,
//   });

//   res.status(201).json({
//     status: "success",
//     data: {
//       project: newProject,
//     },
//   });
// });
