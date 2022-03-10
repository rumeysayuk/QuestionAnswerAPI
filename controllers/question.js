const Question = require("../models/Question")
const CustomError = require("../helpers/error/CustomError")
const AsyncErrorWrapper = require("express-async-handler")

const askNewQuestion = AsyncErrorWrapper(async (req, res, next) => {
    const info =req.bodyf
    const question =await Question.create({
        ...info,
        user:req.user.id
    })

    return res.status(200).json({
        success:true,
        data:question
    })
})

const getAllQuestions=AsyncErrorWrapper(async(req,res,next)=>{
  const questions=await Question.find()

  return res.status(200).json({
      success:true,
      data:questions
  })
})

const getSingleQuestion=AsyncErrorWrapper(async(req,res,next)=>{
    const id =req.params
    const question=await Question.findById(id)
  
    return res.status(200).json({
        success:true,
        data:question
    })
  })
  


module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion
}
