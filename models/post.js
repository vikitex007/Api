const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title"],
        trim: true,
        maxlength: [100, "Title cannot be more than 100 characters"],
    },   

    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [500, "Description cannot be more than 500 characters"],
    },

    location:{
        type:String,
        required: [true, "Please add a location"],
    },

    price: {
        type: String,
        required: [true, "Please add a price"], 
    },

    image: {
        type: String, 
        required: false,
    },

    negotiable: { 
        type: Boolean,
        default: true,
    },

    postedBy: {
        type: String,
        // ref: 'User', 
        default: null,
        required: false,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

module.exports = Post;
