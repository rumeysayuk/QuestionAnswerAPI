const express = require("express")
const {addNewAnswerToQuestion, getAllAnswersByQuestion, getSingleAnswer,editAnswer,deleteAnswer,likeAnswer,undoLikeAnswer} = require("../controllers/answer")
const {getAccessToRoute} = require("../middlewares/authorization/auth")
const {checkQuestionAndAnswerExist} = require("../middlewares/database/databaseErrorHelpers");
const {getAnswerOwnerAccess} = require("../middlewares/authorization/auth")

const router = express.Router({mergeParams: true});

router.post("/", getAccessToRoute, addNewAnswerToQuestion)
router.get("/", getAllAnswersByQuestion)
router.get("/:answer_id", checkQuestionAndAnswerExist, getSingleAnswer)
router.put("/:answer_id/edit", [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], editAnswer)
router.delete("/:answer_id/delete", [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], deleteAnswer);
router.get("/:answer_id/like", [getAccessToRoute, checkQuestionAndAnswerExist], likeAnswer)
router.get("/:answer_id/undo-like", [getAccessToRoute, checkQuestionAndAnswerExist], undoLikeAnswer)


module.exports = router;