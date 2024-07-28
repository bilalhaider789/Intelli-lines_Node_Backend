const User = require("../models/user");
const Note = require("../models/note");
const Subscription = require("../models/subscription");
const Admin = require("../models/admin");
const nodemailer = require("nodemailer");

const demo = async (req, res, next) => {
    console.log("requested admin")
    const data= ( await Admin.find());
    return res.status(200).json(data);
  };


const allusers = async (req, res, next) => {
  console.log("requested admin")
  try{
  const data= ( await User.find());
  return res.status(200).json(data);
  }
  catch(e){
    return res.status(404).json({"mess":"cant find users"})
  }
};

const allsubscriptions = async (req, res, next) => {
  console.log("requested admin")
  try{
  const data= ( await Subscription.find());
  return res.status(200).json(data);
  }
  catch(e){
    return res.status(404).json({"mess":"cant find subscriptions"})
  }
};

const deleteuser = async (req, res, next) => {
  try{
  const id= req.body.id
  console.log(id)
  await User.findByIdAndDelete(id)
  return res.status(200).json({"success":"1"});
  }
  catch(e){
      console.log(e)
      res.send({"success":"0"})
  }
  };



const login = async (req, res, next) => {
const { email, password } = req.body;
console.log(req.body);
let existingUsesr;
try {
    existingUsesr = await Admin.findOne({ email: email });
} catch (e) {
    console.log("error in finding user");
}
if (!existingUsesr || existingUsesr.password !== password) {
    res.status(422).json({ error: "Credentials invalid", success: false });
    // return next( new HttpError("User of this credentials do not  exists", 422))
    return null;
}
res.json({
    userid: existingUsesr.id,
    name: existingUsesr.name,
    email: existingUsesr.email,
    success: true,
    actor: "admin",
});
};
  
  
const forget = async (req, res) => {
    console.log("aaa")
    const { email } = req.body;
    console.log(req.body);
    let existingUsesr;
    try {
      existingUsesr = await Admin.findOne({ email: email });
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
  


const resetpass = async (req, res, next) => {
const { email,password } = req.body;
let user;
try {
    user = await Admin.findOne({ email: email });
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
    actor: "admin",});
};
  
const adduser = async (req, res, next) => {
  const { name, email, password, package } = req.body;
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
    package,
  });
  try {
    createduser.save();
    console.log("user added");
    res
      .status(201)
      .json({
        userid: createduser.id,
        name: createduser.name,
        email: createduser.email,
        success: true,
        actor: "user",
        package: createduser.package,
      });
  } catch (e) {
    console.log("Error in signup");
  }
};
  
  
const edituser = async (req, res, next) => {
  const { name, email, selected } = req.body;
  var user;
  if (selected){  
    try {
      user = await User.findOne({ email: email });
      user.name=name
      user.password=req.body.password
      user.package=req.body.package
      user.save()
      return res.json({success: true,})
      
  } catch (err) {
      return res.send("User not fount");
  }
  }
  else{
    try {
      user = await User.findOne({ email: email });
      user.name=name
      user.package=req.body.package
      user.save()
      return res.json({success: true,})
      
  } catch (err) {
      return res.send("User not fount");
  }
  }
  return {success:false}

}


const changepass = async (req, res, next) => {
  const { email,password } = req.body;
  console.log(req.body)
  let user;
  try {
      user = await Admin.findOne({ email: email });
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
      actor: "admin",});
  };

  
const changename = async (req, res, next) => {
  const { email,name } = req.body;
  let user;
  try {
      user = await Admin.findOne({ email: email });
  } catch (err) {
      return res.send("User not fount");
  }
  user.name=name;
  try {
      await user.save();
  } catch (err) {
      
      return res.send("Could not update user");
  }
  res.status(200).json({ userid: user.id,
      name: user.name,
      email: user.email,
      success: true,
      actor: "admin",});
  };

   
const changeemail = async (req, res, next) => {
  const { email,newemail } = req.body;
  let checkuser
  try {
    checkuser = await Admin.findOne({ email: newemail });
    if (checkuser!=null){
      return res.status(200).json({ mess: "User of this email already exists. Please Try Again with other email",
        success: false,});
    };
    }
 catch (err) {
    return res.send("User not fount");
}
  let user;
  try {
      user = await Admin.findOne({ email: email });
  } catch (err) {
      return res.send("User not fount");
  }
  user.email=newemail;
  try {
      await user.save();
  } catch (err) {
      
      return res.send("Could not update user");
  }
  res.status(200).json({ userid: user.id,
      name: user.name,
      email: user.email,
      success: true,
      actor: "admin",});
  };



exports.login = login;
exports.demo = demo;
exports.forget = forget;
exports.resetpass=resetpass;
exports.allusers=allusers;
exports.deleteuser=deleteuser;
exports.edituser=edituser;
exports.allsubscriptions=allsubscriptions;
exports.adduser=adduser;
exports.changepass=changepass;
exports.changename=changename;
exports.changeemail=changeemail;





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
        subject: "Verification Code for Admin Password Reset of Intelli-Lines",
        text: "Admin Password Reset",
        html: `<div><h1>Request for Intellilines Admin Password Reset</h1><h3>Verfication Code : ${otp}</h3></div>`,
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
  
  