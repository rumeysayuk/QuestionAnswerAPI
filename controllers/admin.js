const User = require("../models/User")
const AsyncErrorWrapper = require("express-async-handler")

const blockUser = AsyncErrorWrapper(async (req, res, next) => {
   const {id} = req.params
   const user = await User.findById(id)

   user.blocked = !user.blocked

   await user.save()
   return res.status(200).json({
      success: true,
      message: "Block - Unblock Successfully"
   })

})

const deleteUser = AsyncErrorWrapper(async (req, res, next) => {
   const {id} = req.params

   const user = await User.findById(id)

   await user.remove()

   return res.status(200).json({
      success:true,
      message:"Delete operation successfully"
   })

})
module.exports = {
   blockUser,
   deleteUser
}