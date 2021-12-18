const CustomErrorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(400).json({
        success: false
    })
}
module.exports = CustomErrorHandler;