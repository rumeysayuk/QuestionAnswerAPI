const express = require("express")
const router = express.Router();
const {
   askNewQuestion, getAllQuestions, getSingleQuestion, editQuestion, deleteQuestion, likeQuestion,
   undoLikeQuestion
} = require("../controllers/question")
const {getAccessToRoute, getQuestionOwnerAccess} = require("../middlewares/authorization/auth")
const questionQueryMiddleware = require("../middlewares/query/questionQueryMiddleware")
const {checkQuestionExist} = require("../middlewares/database/databaseErrorHelpers")
const answerQueryMiddleware = require("../middlewares/query/answerQueryMiddleware")
const answer = require("./answer")
const Question = require("../models/Question")


router.get("/", questionQueryMiddleware(Question, {
      population: {
         path: "user",
         select: "name profileImage"
      }
   }
), getAllQuestions)
router.get("/:id", checkQuestionExist, answerQueryMiddleware(Question, {
   population: [
      {
         path: "user",
         select: "profileImage"
      },
      {
         path: "answers",
         select: "content"
      }
   ]
}), getSingleQuestion)
router.post("/ask", getAccessToRoute, askNewQuestion);
router.put("/:id/edit", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion);
router.delete("/delete/:id", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion)
router.get("/:id/like", [getAccessToRoute, checkQuestionExist], likeQuestion)
router.get("/:id/undo-like", [getAccessToRoute, checkQuestionExist], undoLikeQuestion)

router.use("/:question_id/answers", checkQuestionExist, answer)

module.exports = router;
