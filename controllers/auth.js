const User = require("../models/User");
const AsyncErrorWrapper = require("express-async-handler")
const {tokenHelpers} = require("../helpers/authorization/tokenHelpers")
const {validateUserInput, comparePassword} = require("../middlewares/input/inputHelpers")
const CustomError = require("../helpers/error/CustomError");
const path = require("path");
const mongoose = require("mongoose")

const register = AsyncErrorWrapper(async (req, res, next) => {
    const {name, email, password, role} = req.body;

    const user = await User.create({
        name, email, password, role
    })
    tokenHelpers(user, res)
})
const login = AsyncErrorWrapper(async (req, res, next) => {
    const {email, password} = req.body;
    if (!validateUserInput(email, password)) {
        return next(new CustomError("Please check your inputs!", 400))
    }

    const user = await User.findOne({email}).select("+password")
    if (!comparePassword(password, user.password)) {
        return next(new CustomError("Please check your credentials", 400))
    }
    tokenHelpers(user, res)
});

const logout = AsyncErrorWrapper(async (req, res, next) => {
    const {NODE_ENV} = process.env
    return res.status(200).cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV !== "DEVELOPMENT"
    }).json({
        success: true,
        message: "Logout successful"
    })
})

const getUser = (req, res, next) => {
    console.log(req.body)
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    })
}
const uploadProfileImage = (req, res, next) => {
    if (!req?.files?.profileImage) {
        return res.status(400).json({
            error: "Please choose file image!"
        })
    }
    const extension = path.extname(req.files.profileImage.name);
    const fileName = `${req?.user?.id}${extension}`

    const folderPath = path.join(__dirname, "../", "public/uploads/images", fileName);
    req.files.profileImage.mv(folderPath, async (err) => {
        if (err) return next(new CustomError(err, 400));

        await User.findOneAndUpdate({_id: req.user.id}, {profileImage: fileName})
            .then((updatedUser) => {
                console.log(updatedUser)
                res.status(200).json({
                    success: true,
                    message: "Image successfully saved to database"
                })
            }).catch(() => {
                return next(new CustomError("upload success but an error occurred while registering to the database.", 500))
            })

    })
    res.status(200).json({
        success: true,
        message: "image upload successfully"
    })
}

module.exports = {
    login,
    register,
    getUser,
    logout,
    uploadProfileImage
}
