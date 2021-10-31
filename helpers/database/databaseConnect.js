const mongoose = require("mongoose")


const databaseConnect = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
    }).then(() => {
        console.log("mongo db connected ...")
    }).catch(err => {
        console.log(err)
    })
}

module.exports = databaseConnect
