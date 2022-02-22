const User = require("../models/User");
const AsyncErrorWrapper = require("express-async-handler")
const {tokenHelpers} = require("../helpers/authorization/tokenHelpers")
const {validateUserInput, comparePassword} = require("../helpers/input/inputHelpers")
const CustomError = require("../helpers/error/CustomError");
const path = require("path");
const sendEmail=require("../helpers/libraries/sendEmail")

const register = AsyncErrorWrapper(async (req, res, next) => {
    const {name, email, password, role} = req.body;

    const user = await User.create({
        name, email, password, role
    })
    tokenHelpers(user, res)
})
const login = AsyncErrorWrapper(async (req, res, next) => {
    const {email, password} = req.body;
    if (!validateUserInput(email, password)) {
        return next(new CustomError("Please check your inputs!", 400))
    }

    const user = await User.findOne({email}).select("+password")
    if (!comparePassword(password, user.password)) {
        return next(new CustomError("Please check your credentials", 400))
    }
    tokenHelpers(user, res)
});

const logout = AsyncErrorWrapper(async (req, res, next) => {
    const {NODE_ENV} = process.env
    return res.status(200).cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV !== "DEVELOPMENT"
    }).json({
        success: true,
        message: "Logout successful"
    })
})

const getUser = (req, res, next) => {
    console.log(req.body)
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    })
}

const uploadProfileImage = (req, res, next) => {
    if (!req?.files?.profileImage) {
        return res.status(400).json({
            error: "Please choose file image!"
        })
    }
    const extension = path.extname(req.files.profileImage.name);
    const fileName = `${req?.user?.id}${extension}`

    const folderPath = path.join(__dirname, "../", "public/uploads/images", fileName);
    req.files.profileImage.mv(folderPath, async (err) => {
        if (err) return next(new CustomError(err, 400));

        await User.findOneAndUpdate({_id: req.user.id}, {profileImage: fileName})
            .then((updatedUser) => {
                console.log(updatedUser)
                res.status(200).json({
                    success: true,
                    message: "Image successfully saved to database"
                })
            }).catch(() => {
                return next(new CustomError("upload success but an error occurred while registering to the database.", 500))
            })

    })
    res.status(200).json({
        success: true,
        message: "image upload successfully"
    })
}

const forgotPassword=AsyncErrorWrapper(async(req,res,next)=>{
  const resetEmail=req.body.email;
  const user=await User.findOne({email:resetEmail})
  if(!user){
      return next(new CustomError("There is no user with that email",400))
  }
  const resetPasswordToken=user.getResetPasswordTokenFromUser();
  await user.save();
  const resetPasswordUrl=`http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

  const emailTemplate=`
  <h3>Reset your password</h3>
  <p>This <a href='${resetPasswordUrl}' target='_blank'>Link</a> will be expire in 1 hour</p>
  `;

  try {
      await sendEmail({
          from:process.env.STMP_USER,
          to:resetEmail,
          subject:"Reset Your Password",
          html:emailTemplate
      });
     return res.status(200).json({
        success:true,
        message:"Token sent to your email"
    });
  } catch (error) {
      user.resetPasswordToken=undefined;
      user.resetPasswordExpire=undefined;

      await user.save();

      return next(new CustomError("Email could not be send",500))
  }

})  

const resetPassword=AsyncErrorWrapper(async(req,res,next)=>{
    const {resetPasswordToken}=req.query;
    const {password}=req.body;

    if(!resetPasswordToken){
      return next(new CustomError("Please provide a valid token",400))
    } 
    let user=await User.findOne({
        resetPasswordToken:resetPasswordToken,
        resetPasswordExpire:{$gt :Date.now()}
    });
    if(!user){
        return next (new CustomError("Invalid token or session expired",404))
    }
    user.password=password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();


 return res.status(200).json({
     success:true,
     message:"Reset Password Process Succesfully",
 })
})

module.exports = {
    login,
    register,
    getUser,
    logout,
    uploadProfileImage,
    forgotPassword,
    resetPassword
}
