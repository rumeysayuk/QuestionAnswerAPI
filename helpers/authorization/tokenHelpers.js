const tokenHelpers = (user, res) => {
    const token = user.generateJwtFromUser();
    const {JWTCOOKIE, NODE_ENV} = process.env;
    return res.status(200).cookie("access_token", token, {
        httpOnly:true,
        expires: new Date(Date.now() + parseInt(JWTCOOKIE) * 1000*60),
        secure: NODE_ENV !== "DEVELOPMENT"
    }).json({
        success: true,
        access_token: token,
        data: {
            name: user.name,
            email: user.email
        }
    })
}
const isTokenIncluded = (req) => {
    return (req.headers.authorization && req.headers.authorization.startsWith("Bearer "));
}
const getAccessTokenFromHeader = (req) => {
    const authorization = req.headers.authorization
    const accessToken = authorization.split(" ")[1]
    return accessToken
}


module.exports = {
    tokenHelpers,
    isTokenIncluded,
    getAccessTokenFromHeader
};