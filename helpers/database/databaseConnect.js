const mongoose = require("mongoose")

const databaseConnect = async () => {
 return  mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
        })
}

module.exports = databaseConnect
