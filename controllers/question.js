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
   let query = Question.find()
   const populate = true
   const populateObject = {
      path: "user",
      select: "name profileImage"
   }
   //search
   if (req.query.search) {
      const searchObject = {}
      const regex = new RegExp(req.query.search, "i")
      searchObject["title"] = regex
      query = query.where(searchObject)
   }
   //populate
   if (populate) {
      query = query.populate(populateObject)
   }
   //pagination
   const page = req.query.page || 1
   const limit = req.query.limit || 5
   //mongo metotlar skip(2) 2 tane atlar 0 ve 1. kaydı gecer 2 den başlayarak getirir. limit(2) 2 tane atlar 0 ve 1.kaydı gecer 2 ve 3 ü getirir
   const startIndex = (page - 1) * limit
   const endIndex = page * limit
   const pagination = {}
   if (startIndex > 0) {
      pagination.previous={
         page:page-1,
         limit:limit
      }
   }
   const questions = await query;
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
