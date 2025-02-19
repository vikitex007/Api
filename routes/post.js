const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const upload = require("../middleware/uploads");

const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    uploadImage,
    getPostsByUser
} = require("../controllers/post");

router.post("/uploadImage", upload, uploadImage);
router.get("/getAllPosts", getPosts);
router.get("/:id", getPost);
router.get("/user/:userId", getPostsByUser);

router.post("/createPost", createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
