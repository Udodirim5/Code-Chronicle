const Social = require('./../models/socialModel');
const factory = require('./handlerFactory');

exports.getSocial = factory.getOne(Social);
exports.getAllSocials = factory.getAll(Social);
exports.deleteSocial = factory.deleteOne(Social);
exports.createSocial = factory.createOne(Social);

exports.updateSocials = async (req, res) => {
  try {
    const userId = req.user._id; // Get the currently logged-in user's ID

    const socialData = {
      twitter: req.body.twitter,
      facebook: req.body.facebook,
      telegram: req.body.telegram,
      github: req.body.github,
      instagram: req.body.instagram,
      linkedin: req.body.linkedin,
      youtube: req.body.youtube,
      whatsapp: req.body.whatsapp,
      user: userId, // Ensure the user field is set
    };

    // Find the social record for the user
    let social = await Social.findOne({ user: userId });

    if (!social) {
      // If no social record exists, create a new one
      social = new Social(socialData);
    } else {
      // Update the existing social record
      social = await Social.findByIdAndUpdate(social._id, socialData, { new: true, runValidators: true });
    }

    await social.save();

    res.status(200).json({
      status: 'success',
      data: {
        social,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
