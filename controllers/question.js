const Question = require("../models/Question")
const AsyncErrorWrapper = require("express-async-handler")
const CustomError = require("../helpers/error/CustomError")

const askNewQuestion = AsyncErrorWrapper(async (req, res, next) => {
   const info = req.body
   const question = await Question.create({
      ...info,
      user: req.user.id
   })

   return res.status(200).json({
      success: true,
      data: question
   })
})

const getAllQuestions = AsyncErrorWrapper(async (req, res, next) => {
   const questions = await Question.find()

   return res.status(200).json({
      success: true,
      data: questions
   })
})

const getSingleQuestion = AsyncErrorWrapper(async (req, res, next) => {
   const {id} = req.params
   const question = await Question.findById(id)

   return res.status(200).json({
      success: true,
      data: question
   })
})

const editQuestion = AsyncErrorWrapper(async (req, res, next) => {
   const editInfo = req.body

   const question = await Question.findByIdAndUpdate(req.params.id, editInfo, {
      new: true,
      runValidators: true
   })
   return res.status(200).json({
      success: true,
      data: question
   })


})

const deleteQuestion = AsyncErrorWrapper(async (req, res, next) => {
   const {id} = req.params

   await Question.findByIdAndDelete(id)


   return res.status(200).json({
      success: true,
      message: "Delete question successfully"
   })

})

const likeQuestion = AsyncErrorWrapper(async (req, res, next) => {
   const {id} = req.params;
   const question = await Question.findById(id);
   if (question.likes.includes(req.user.id)) {
      return next(new CustomError("You already like this question", 400));
   }
   question.likes.push(req.user.id);
   await question.save();
   return res.status(200).json({
      success: true,
      data: question,
   });
});

const undoLikeQuestion = AsyncErrorWrapper(async (req, res, next) => {
   const {id} = req.params;
   const question = await Question.findById(id);

   if (!question.likes.includes(req.user.id)) return next(new CustomError("You can't undo like for this question", 400))
   const index = question.likes.indexOf(req.user.id)

   question.likes.splice(index, 1)
   await question.save();
   return res.status(200).json({
      success: true,
      data: question,
   });
});

module.exports = {
   askNewQuestion,
   getAllQuestions,
   getSingleQuestion,
   editQuestion,
   deleteQuestion,
   likeQuestion,
   undoLikeQuestion
}
