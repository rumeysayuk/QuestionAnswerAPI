const express = require("express");
const app = express();
//environment variables
require("dotenv").config({
    path: "./config/env/.env"
});
const routes = require("./routes")
const databaseConnect = require("./helpers/database/databaseConnect")
databaseConnect();

//Routes Middleware
app.use("/api", routes)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App started on : ${PORT}: ${process.env.NODE_ENV}`);
})

