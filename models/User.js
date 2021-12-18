const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name!"]
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Please try different email"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        minlength: [6, "Please provide password with min length 6 "],
        required: ["true", "please provide a password"],
        select: false,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    title: {type: String},
    about: {type: String},
    place: {type: String},
    website: {type: String},
    profileImage: {
        type: String,
        default: "default.jpg"
    },
    blocked: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model("User", UserSchema);