const express = require("express")
const {getSingleUser, getAllUsers} = require("../controllers/user")
const {checkUserExists} = require("../middlewares/database/databaseErrorHelpers")
const router = express.Router();

router.get("/:id", checkUserExists, getSingleUser)
router.get("/", getAllUsers)

module.exports = router;