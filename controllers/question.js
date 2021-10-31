const getAllQuestions = (req, res,next) => {
    res.status(200).json({
        success: true,
        // data:"basarıyla getirildi"
    })
}


module.exports = {
    getAllQuestions,

}
