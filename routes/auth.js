const express = require("express")
const {register, getUser, login, logout,uploadProfileImage} = require("../controllers/auth")
const {getAccessToRoute} = require("../middlewares/authorization/auth")
const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/logout", getAccessToRoute, logout)
router.get("/profile", getAccessToRoute, getUser)
router.post("/upload", getAccessToRoute, uploadProfileImage)
module.exports = router;
