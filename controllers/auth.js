const User = require("../models/User");

const register = async (req, res, next) => {
    const {name, email, password} = req.body;
    try {
        const user = await User.create({
            name, email, password
        })
        res.status(200).json({
            success: true,
            data: user,
            message: "register successfully"
        })
    } catch (err) {
        return next(err);
    }

}

const login = () => {

}

const errorTest = async (req, res, next) => {
    return next(new Error("bir hata oluştu"))
}


module.exports = {
    login,
    register,
    errorTest
}
