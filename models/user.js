const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true, // Name is required
    trim: true, // Removes leading/trailing whitespaces
  },
  image: {
    type: String, // URL to an image associated with the post (if any)
    required: false,
  },
  phone: {
    type: String,
    required: true, // Maximum age
  },
  location: {
    type: String,
    required: true, // 
  },
  username: {
    type: String,
    required: true,
    unique: true, // Email must be unique
    lowercase: true, // Convert to lowercase
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
  },
 

  isActive: {
    type: Boolean,
    default: true, // Default value is true
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the current date
  },
});

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
    //expiresIn: 5,
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);

