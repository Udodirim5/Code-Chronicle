// routes/api.js
const express = require('express');
const router = express.Router();
const Post = require('../models/postModel'); // Assuming you have a Post model

// Search posts
router.get('/search', async (req, res) => {
  const searchTerm = req.query.q;
  try {
    const posts = await Post.find({ 
      title: { $regex: searchTerm, $options: 'i' } // Case-insensitive search
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error searching posts', error });
  }
});

module.exports = router;
