const express = require("express")
const {
   register, getUser, login, logout, uploadProfileImage,
   uploadMulterProfileImage, forgotPassword, editDetails
} = require("../controllers/auth")
const {getAccessToRoute} = require("../middlewares/authorization/auth")
const profileImageUpload = require("../middlewares/libraries/profileImageUpload");
const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/logout", getAccessToRoute, logout)
router.post("/forgotpassword", forgotPassword);
router.get("/profile", getAccessToRoute, getUser)
router.post("/upload", getAccessToRoute, uploadProfileImage)
router.post(
   "/uploadMulter",
   getAccessToRoute, profileImageUpload.single("profileImage"),
   uploadMulterProfileImage
);
router.put("/edit", getAccessToRoute, editDetails)
module.exports = router;
