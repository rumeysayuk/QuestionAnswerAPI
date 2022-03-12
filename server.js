const express = require("express");
const app = express();
const CustomErrorHandler = require("./middlewares/error/customErrorHandler")
const path = require("path")
const fileUpload =require("express-fileupload")

//express body middleware
app.use(express.json())
app.use(fileUpload())
//environment variables
require("dotenv").config({
    path: ".env"
});
const routes = require("./routes")
const databaseConnect = require("./helpers/database/databaseConnect")
databaseConnect().then(() => {
    console.log("mongo db connection success")
});
//static files
app.use(express.static(path.join(__dirname, "public")))
// app.use()

//Routes Middleware
app.use("/api", routes)

app.use(CustomErrorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App started on : ${PORT}: ${process.env.NODE_ENV}`);
})

