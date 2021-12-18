const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError")
const AsyncErrorWrapper = require("express-async-handler")

const register = AsyncErrorWrapper(async (req, res, next) => {
    const {name, email, password, role} = req.body;
    try {
        const user = await User.create({
            name, email, password,role
        })
        res.status(200).json({
            success: true,
            data: user,
            message: "register successfully"
        })
    } catch (err) {
        return next(err);
    }

})

const login = () => {

}

const errorTest = async (req, res, next) => {
    return next(new TypeError("Type error"))
}


module.exports = {
    login,
    register,
    errorTest
}
