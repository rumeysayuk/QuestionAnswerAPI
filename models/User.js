const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const Question = require("./Question")

const UserSchema = new mongoose.Schema({
   name: {
      type: String, required: [true, "Please provide a name!"]
   },
   email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
   },
   password: {
      type: String, minlength: [6, "Please provide password with min length 6 "], //validations sadece required gibi alanlarda geçerli.Uniquelerde olmuyor.
      required: ["true", "please provide a password"], select: false,   //bilgiler alınınca bunu gösterme
   },
   role: {
      type: String, default: "user", enum: ["user", "admin"]
   },
   createdAt: {
      type: Date, default: Date.now()
   },
   title: {type: String},
   about: {type: String},
   place: {type: String},
   website: {type: String},
   profileImage: {
      type: String, default: "default.jpg"
   },
   blocked: {
      type: Boolean, default: false
   },
   resetPasswordToken: {
      type: String,
   }, resetPasswordExpire: {
      type: Date
   }
})

UserSchema.methods.generateJwtFromUser = function () {
   const {JWTSECRETKEY, JWTEXPIRE} = process.env
   const payload = {
      id: this._id, name: this.name
   }
   const token = jwt.sign(payload, JWTSECRETKEY, {
      expiresIn: JWTEXPIRE
   })
   return token
}

UserSchema.methods.getResetPasswordTokenFromUser = function () {
   const randomHexString = crypto.randomBytes(15).toString("hex");

   const {RESET_PASSWORD_EXPIRE} = process.env;

   const resetPasswordToken = crypto
      .createHash("SHA256")
      .update(randomHexString)
      .digest("hex");

   this.resetPasswordToken = resetPasswordToken;
   this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

   return resetPasswordToken;
};

UserSchema.pre("save", function (next) {
   //kaydedilmeye hazır data önce buraya gelir.  console.log(this)
   //parola değişme
   if (!this.isModified("password")) {
      next();
   }
   bcrypt.genSalt(10, (err, salt) => {
      if (err) next(err);
      bcrypt.hash(this.password, salt, (err, hash) => {
         if (err) next(err);
         this.password = hash;
         next();
      });
   });
})

UserSchema.post("remove",async function(){
   await Question.deleteMany({
      user:this._id
   });

});

module.exports = mongoose.model("User", UserSchema);