const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors= require("cors")
const userRouter=require("./routes/users-routes")

const app = express();
app.use(cors())
app.use(bodyParser.json());


app.use("/", userRouter);

mongoose
  .connect(
    // "mongodb+srv://intellilines:intellilines@cluster0.iwdcbmu.mongodb.net/?retryWrites=true&w=majority"
    "mongodb://localhost:27017/Intellilines"
  )
  .then(() => {
    console.log("success")
    app.listen(7000);
  })
  .catch(() => {
    console.log("error in connecting db");
  });