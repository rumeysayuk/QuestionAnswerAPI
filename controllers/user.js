const User = require("../models/User");
const AsyncErrorWrapper = require("express-async-handler")

const getSingleUser = AsyncErrorWrapper(async (req, res, next) => {
    const {id} = req.params
    const user = await User.findById(id)
    return res.status(200).json({
        success: true,
        data: user
    })
})

const getAllUsers = AsyncErrorWrapper(async (req, res, next) => {
    const users = await User.find()

    return res.status(200).json({
        success: true,
        data: users
    })
})


module.exports = {
    getSingleUser,
    getAllUsers
}