const User = require("../models/User");
const AsyncErrorWrapper = require("express-async-handler")
const {tokenHelpers} = require("../helpers/authorization/tokenHelpers")
const {validateUserInput, comparePassword} = require("../middlewares/input/inputHelpers")
const CustomError = require("../helpers/error/CustomError");

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
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    })
}

module.exports = {
    login,
    register,
    getUser,
    logout
}
