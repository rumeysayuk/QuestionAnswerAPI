const CustomError = require("../../helpers/error/CustomError")
const jwt = require("jsonwebtoken")
const {isTokenIncluded, getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers")
const {decode} = require("jsonwebtoken");


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
module.exports = {
    getAccessToRoute,
}