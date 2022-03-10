const Question = require("../models/Question")
const CustomError = require("../helpers/error/CustomError")
const AsyncErrorWrapper = require("express-async-handler")

const askNewQuestion = AsyncErrorWrapper(async (req, res, next) => {
    const info =req.body

    const question =await Question.create({
        info,
        user:req.user.id
    })

    return res.status(200).json({
        success:true,
        data:question
    })
})


module.exports = {
    askNewQuestion
}
