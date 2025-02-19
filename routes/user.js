const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const upload = require("../middleware/uploads");

const {
  getUsers,
  getUser,
  register,
  login,
  updateUser,
  deleteUser,
  uploadImage,
  getMe,
} = require("../controllers/user");

// Ensure `upload.single("image")` is used for file upload
router.post("/uploadImage", upload, uploadImage);

// Registration should be public
router.post("/register", register);
router.post("/login", login);

// Protected Routes (Requires authentication)
router.get("/getUsers", getUsers);
router.get("/me", protect, getMe);
router.get("/:id", protect, getUser);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

module.exports = router;
