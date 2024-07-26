const catchAsync = require('./catchAsync');

exports.renderView = (template, title, additionalData = {}) => 
  catchAsync(async (req, res, next) => {
    const data = { title, ...additionalData };
    res.status(200).render(template, data);
  });
