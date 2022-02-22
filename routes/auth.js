const express = require("express")
const {register, getUser, login, logout,uploadProfileImage,forgotPassword,resetPassword} = require("../controllers/auth")
const {getAccessToRoute} = require("../middlewares/authorization/auth")
const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/logout", getAccessToRoute, logout)
router.post("/forgotpassword",forgotPassword)
router.get("/profile", getAccessToRoute, getUser)
router.post("/upload", getAccessToRoute, uploadProfileImage)
router.put("/resetpassword",resetPassword)
module.exports = router;
