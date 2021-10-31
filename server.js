const express = require("express");
const app = express();

//environment variables
require("dotenv").config({
    path: "./config/env/.env"
});


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App started on : ${PORT}: ${process.env.NODE_ENV}`);
})

app.get("/", (req, res) => {
    res.send("hello ı write this code sacf")
})
