const CustomError = require("../../helpers/error/CustomError")
const jwt = require("jsonwebtoken")
const AsyncErrorWrapper = require("express-async-handler")
const {isTokenIncluded, getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers")
const User = require("../../models/User")

const getAccessToRoute = (req, res, next) => {
    const {JWTSECRETKEY} = process.env
    if (!isTokenIncluded(req)) {
        // 401 Unauthorized  403 forbidden
        return next(new CustomError("You are not authorized to access this route", 401))
    }
    const accessToken = getAccessTokenFromHeader(req)
    jwt.verify(accessToken, JWTSECRETKEY, (err, decoded) => {
        if (err) {
            return next(new CustomError("You are not authorized to access this route", 401))
        }
        req.user = {
            id: decoded.id,
            name: decoded.name
        }
        next();
    })
};

const getAdminAccess = AsyncErrorWrapper(async (req, res, next) => {
    const {id} = req.user
    const user = await User.findById(id)
    if (user.role !== "admin") {
        return next(new CustomError("Only admins can access this route", 403))
    }
    next()
})
module.exports = {
    getAccessToRoute,
    getAdminAccess
}