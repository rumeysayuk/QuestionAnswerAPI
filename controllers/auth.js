const User = require("../models/User");
const AsyncErrorWrapper = require("express-async-handler")
const {tokenHelpers} = require("../helpers/authorization/tokenHelpers")
const {validateUserInput} = require("../middlewares/input/inputHelpers")
const CustomError = require("../helpers/error/CustomError");

const register = AsyncErrorWrapper(async (req, res, next) => {
    const {name, email, password, role} = req.body;

    const user = await User.create({
        name, email, password, role
    })
    tokenHelpers(user, res)
    const token = user.generateJwtFromUser();
    console.log(token)
    res.status(200).json({
        success: true,
        data: user,
        message: "register successfully"
    })
})
const login = AsyncErrorWrapper(async (req, res, next) => {
    const {email, password} = req.body;
    if (!validateUserInput(email, password)) {
        return next(new CustomError("Please check your inputs!", 400))
    }
    const user=User.findOne({email})
    res.status(200).json({
        success: true
    })
});

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
    getUser
}
