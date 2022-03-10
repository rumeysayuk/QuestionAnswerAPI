const express = require("express")
const {getAccessToRoute, getAdminAccess} = require("../middlewares/authorization/auth")
const {blockUser, deleteUser} = require("../controllers/admin")
const {checkUserExists} = require("../middlewares/database/databaseErrorHelpers");
const router = express.Router()

router.use([getAccessToRoute, getAdminAccess])
//block user
router.get("/block/:id", checkUserExists, blockUser)

//delete user
router.delete("/user/:id", checkUserExists, deleteUser)

module.exports = router
