const register = (req, res) => {
    res.status(201).json({
        success: true,
        message: "register successfully"
    })
}

const login = () => {

}


module.exports = {
    login,
    register,
}
