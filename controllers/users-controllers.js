// const uuid= require('uuid')
// const HttpError = require('../models/http-error')
// const {validationResult}= require('express-validator')
const User = require("../models/user");
const nodemailer = require("nodemailer");

const HttpError = require("../models/http-error");
const { response } = require("express");

const demo = async (req, res, next) => {
  console.log("requested user")
  const data= ( await User.find());
  return res.status(200).json(data);
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  let existingUsesr;
  try {
    existingUsesr = await User.findOne({ email: email });
  } catch (e) {
    console.log("error in finding user");
  }
  if (existingUsesr) {
    res
      .status(422)
      .json({ error: "User of this email already exists", success: false });
    return null;
    // return next( new HttpError("User of this email already existed", 422))
  }
  const createduser = new User({
    name,
    email,
    password,
    package: "free",
    expiry: new Date()
  });
  try {
    createduser.save();
    console.log("user added");
    let expiryDate = new Date(createduser.expiry);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', options);
    res
      .status(201)
      .json({
        userid: createduser.id,
        name: createduser.name,
        email: createduser.email,
        success: true,
        actor: "user",
        package: createduser.package,
        expiry: formattedExpiryDate
      });
  } catch (e) {
    console.log("Error in signup");
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  let existingUsesr;
  try {
    existingUsesr = await User.findOne({ email: email });
  } catch (e) {
    console.log("error in finding user");
  }
  if (!existingUsesr || existingUsesr.password !== password) {
    res.status(422).json({ error: "Credentials invalid", success: false });
    // return next( new HttpError("User of this credentials do not  exists", 422))
    return null;
  }
  let expiryDate = new Date(existingUsesr.expiry);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', options);
  res.json({
    userid: existingUsesr.id,
    name: existingUsesr.name,
    email: existingUsesr.email,
    package: existingUsesr.package,
    expiry: existingUsesr.expiry,
    success: true,
    actor: "user",
  });
};

const forget = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  let existingUsesr;
  try {
    existingUsesr = await User.findOne({ email: email });
  } catch (e) {
    console.log("error in finding user");
  }
  if (!existingUsesr) {
    res.status(422).json({ error: "invalid Email", success: false });
    // return next( new HttpError("User of this credentials do not  exists", 422))
    return null;
  }
  otp = Math.floor(Math.random() * 9000) + 1000;
  sendemail(otp,email)
    .then((response) =>
      res.json({ otp, mess: response.message, success: true })
    )
    .catch((error) => res.status(500).send(error.message));
  return null;
};

const socialogin=async(req,res,next)=>{
  const { email ,name} = req.body;
  password=123123;
  let existingUsesr;
  try {
    existingUsesr = await User.findOne({ email: email });
  } catch (e) {
    console.log("error in finding user");
  }
  if (existingUsesr) {
    let expiryDate = new Date(existingUsesr.expiry);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', options);
    return res.json({
      userid: existingUsesr.id,
      name: existingUsesr.name,
      email: existingUsesr.email,
      package:existingUsesr.package,
      expiry: formattedExpiryDate,
      success: true,
      actor: "user",
    });
  }

  const createduser = new User({
    name,
    email,
    password,
    package: "free",
    expiry: new Date()
  });
  try {
    createduser.save();
    console.log("user added");
    const expiryDate = new Date(createduser.expiry);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', options);
    return res
      .status(201)
      .json({
        userid: createduser.id,
        name: createduser.name,
        email: createduser.email,
        package: createduser.package,
        expiry: formattedExpiryDate,
        success: true,
        actor: "user",
      });
  } catch (e) {
    console.log("Error in signup");
  }


  

}


const resetpas = async (req, res, next) => {
  const { email,password } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    return res.send("User not fount");
  }
  user.password=password;
  try {
    await user.save();
  } catch (err) {
    
    return res.send("Could not update user");
  }
  expiryDate = new Date(user.expiry);
  let options = { day: 'numeric', month: 'long', year: 'numeric' };
  let formattedExpiryDate = expiryDate.toLocaleDateString('en-US', options);
  res.status(200).json({ userid: user.id,
    name: user.name,
    email: user.email,
    package: user.package,
    expiry: formattedExpiryDate,
    success: true,
    actor: "user",});
};


const changepass = async (req, res, next) => {
  const { email,password } = req.body;
  console.log(email+password)
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    return res.send("User not fount");
  }
  user.password=password;
  try {
    await user.save();
  } catch (err) {
    
    return res.send("Could not update user");
  }

  res.status(200).json({ userid: user.id,
    name: user.name,
    email: user.email,
    success: true,
    actor: "user",});
};


const subscribe = async (req, res, next) => {
  const { email,package } = req.body;
  console.log(package)
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    return res.send("User not fount");
  }
  let currentDate = new Date(); 
  let expiryDate = new Date();
  expiryDate.setMonth(currentDate.getMonth() + 1);
  user.package=package;
  user.expiry=expiryDate
  try {
    await user.save();
  } catch (err) {
    
    return res.send("Could not update user");
  }
  expiryDate = new Date(user.expiry);
  let options = { day: 'numeric', month: 'long', year: 'numeric' };
  let formattedExpiryDate = expiryDate.toLocaleDateString('en-US', options);
  res.status(200).json({ userid: user.id,
    name: user.name,
    email: user.email,
    package: user.package,
    expiry:formattedExpiryDate,
    success: true,
    actor: "user",});
};


exports.changepass=changepass;
exports.socialogin=socialogin;
exports.resetpas=resetpas;
exports.forget = forget;
exports.login = login;
exports.signup = signup;
exports.demo = demo;
exports.subscribe = subscribe;

function sendemail(otp, email) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bilalhaider1311@gmail.com",
        pass: "yhtpxuftucxpbhhq",
      },
    });

    const mail_config = {
      from: "Intellilines@gmail.com",
      to: email,
      subject: "Verification Code for Password Reset of Intelli-Lines",
      text: "mail for testing",
      html: `<div><h1>Request for Intellilines Password Reset</h1><h3>Verfication Code : ${otp}</h3></div>`,
    };

    transporter.sendMail(mail_config, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: "error occured" });
      }
      return resolve({ message: " email sent successs" });
    });
  });
}

