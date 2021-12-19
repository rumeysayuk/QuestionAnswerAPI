const express = require("express");
const app = express();
const CustomErrorHandler = require("./middlewares/error/customErrorHandler")

//express body middleware
app.use(express.json())

//environment variables
require("dotenv").config({
    path: "./config/env/.env"
});
const routes = require("./routes")
const databaseConnect = require("./helpers/database/databaseConnect")
databaseConnect().then(() => {
    console.log("mongo db connection success")
});


//Routes Middleware
app.use("/api", routes)
app.use(CustomErrorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App started on : ${PORT}: ${process.env.NODE_ENV}`);
})

