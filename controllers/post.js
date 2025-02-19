const asyncHandler = require("../middleware/async");
const Post = require("../models/post");

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
    try {
        const posts = await Post.find({}).populate("postedBy", "name email");
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Get single post
// @route   GET /api/v1/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate("postedBy", "name email");

    if (!post) {
        return res.status(404).json({ message: `Post not found with id of ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: post });
});

// @desc    Create new post
// @route   POST /api/v1/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
    try {
        // req.body.postedBy = req.user;  // Ensure the post is linked to the logged-in user
        const post = await Post.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Update post
// @route   PUT /api/v1/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
    let post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ message: `Post not found with id of ${req.params.id}` });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, data: post });
});

// @desc    Delete post
// @route   DELETE /api/v1/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ message: `Post not found with id of ${req.params.id}` });
    }

    await Post.deleteOne({ _id: post._id });

    res.status(200).json({ success: true, data: {} });
});

// @desc    Get posts by user
// @route   GET /api/v1/posts/user/:userId
// @access  Public
exports.getPostsByUser = asyncHandler(async (req, res, next) => {
    const posts = await Post.find({ postedBy: req.params.userId });

    if (!posts || posts.length === 0) {
        return res.status(404).json({ message: `No posts found for user ID ${req.params.userId}` });
    }

    res.status(200).json({ success: true, count: posts.length, data: posts });
});


exports.uploadImage = asyncHandler(async (req, res, next) => {
    // // check for the file size and send an error message
    if (req.file.size > process.env.MAX_FILE_UPLOAD) {
      return res.status(400).send({
        message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
      });
    }
  
    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file" });
    }
    res.status(200).json({
      success: true,
      data: req.file.filename,
    });
  });