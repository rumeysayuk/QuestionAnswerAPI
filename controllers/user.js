const User = require("../models/User")
const AsyncErrorWrapper = require("express-async-handler")
const CustomError = require("../helpers/error/CustomError");

const getSingleUser = AsyncErrorWrapper(async (req, res, next) => {
    const  {id}  = req.params;
    const user=await User.findById(id);
    if (!user) {
        return next(new CustomError("There is no such user with that id"));
    }
    return res.status(200).json({
        success:true,
        data:user
    })
})

module.exports = {
    getSingleUser,
}