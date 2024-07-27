const multer = require("multer");

const Project = require("./../models/projectModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");


// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/projects");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `project-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

exports.getProject = factory.getOne(Project);
exports.getAllProjects = factory.getAll(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);
exports.uploadProjectImages = upload.fields([
  { name: "desktopImg" },
  { name: "mobileImg" },
]);

exports.createProject = catchAsync(async (req, res) => {
  const { title, description, liveUrl, githubUrl, technologies } = req.body;
  const desktopImg = req.files.desktopImg[0].filename;
  const mobileImg = req.files.mobileImg[0].filename;

  // Save the project to the database
  const newProject = await Project.create({
    title,
    description,
    liveUrl,
    githubUrl,
    technologies: JSON.parse(technologies),
    desktopImg,
    mobileImg,
  });

  res.status(201).json({
    status: "success",
    data: {
      project: newProject,
    },
  });
});
