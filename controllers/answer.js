const Answer = require("../models/Answer")
const Question = require("../models/Question")
const AsyncErrorWrapper = require("express-async-handler")
const CustomError = require("../helpers/error/CustomError");

const addNewAnswerToQuestion = AsyncErrorWrapper(async (req, res, next) => {
   const {question_id} = req.params

   const user_id = req.user.id
   const info = req.body
   const answer = await Answer.create({
      ...info,
      question: question_id,
      user: user_id
   })

   return res.status(200).json({
      success: true,
      data: answer
   })
})

const getAllAnswersByQuestion = AsyncErrorWrapper(async (req, res, next) => {
   const {question_id} = req.params
   const question = await Question.findById(question_id).populate({
      path: "answers",
      select: "content"
   })
   const answers = question.answers

   return res.status(200).json({
      success: true,
      count: answers.length,
      data: answers
   })
})

const getSingleAnswer = AsyncErrorWrapper(async (req, res, next) => {
   const {answer_id} = req.params
   const answer = await Answer.findById(answer_id).populate({
      path: "question",
      select: "title"
   }).populate({
      path: "user",
      select: "name profileImage"
   })

   return res.status(200).json({
      success: true,
      data: answer
   })
})

const editAnswer = AsyncErrorWrapper(async (req, res, next) => {
   const editInfo = req.body
   const answer = await Answer.findByIdAndUpdate(req.params.answer_id, editInfo, {
      new: true,
      runValidators: true
   })
   return res.status(200).json({
      success: true,
      data: answer
   })
})

const deleteAnswer = AsyncErrorWrapper(async (req, res, next) => {
   const {answer_id} = req.params;

   const {question_id} = req.params;
   await Answer.findByIdAndRemove(answer_id);
   const question = await Question.findById(question_id);
   question.answers.splice(question.answers.indexOf(answer_id), 1);
   question.answerCount = question.answers.length;

   await question.save();

   return res.status(200).json({
      success: true,
      message: "Answer Deleted successfully",
   });
});

const likeAnswer = AsyncErrorWrapper(async (req, res, next) => {
   const {answer_id} = req.params;
   const answer = await Answer.findById(answer_id);
   if (answer.likes.includes(req.user.id)) {
      return next(new CustomError("You already like this answer", 400));
   }
   answer.likes.push(req.user.id);
   await answer.save();
   return res.status(200).json({
      success: true,
      data: answer,
   });
});

const undoLikeAnswer = AsyncErrorWrapper(async (req, res, next) => {
   const {answer_id} = req.params;
   const answer = await Answer.findById(answer_id);

   if (!answer.likes.includes(req.user.id)) return next(new CustomError("You can't undo like for this answer", 400))
   const index = answer.likes.indexOf(req.user.id)

   answer.likes.splice(index, 1)
   await answer.save();
   return res.status(200).json({
      success: true,
      data: answer,
   });
});

module.exports = {
   addNewAnswerToQuestion,
   getAllAnswersByQuestion,
   getSingleAnswer,
   editAnswer,
   deleteAnswer,
   likeAnswer,
   undoLikeAnswer
}