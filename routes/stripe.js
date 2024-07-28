const subscription = require("../models/subscription");
const User = require("../models/user");

const router = require("express").Router();
const stripe = require("stripe")("sk_test_51MnlBxJcmIhVRf5dVFxPvP3m21A0lakkVdmpo3nGhdFndOqUgQcRneDs9PZUFlZCtPjerCm5bGLKGl3SidiJ1cK400tPov3cfY")

router.post("/subscribe", async(req, res) => {
    console.log("accessed")
    const { userid, username, packagename, packageprice, tokenId, amount, email } = req.body;
    stripe.charges.create(
      {
        source: tokenId,
        amount: amount,
        currency: "usd",
      },
      async(stripeErr, stripeRes) => {
        if (stripeErr) {
          res.status(500).json({"success": "0", "message": "error while payment"});
        } else {
            console.log("payment done")
            try{
              const newsubscription= new subscription({
                userid,
                username,
                useremail:email,
                packagename,
                packageprice,
              })
              await newsubscription.save()
              console.log("subscription saved")
              let expiryDate = new Date(newsubscription.expiry);
              const options = { day: 'numeric', month: 'long', year: 'numeric' };
              const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', options);
              let user
              try {
                user = await User.findOne({ email: email });
              } catch (err) {
                console.log("User not found")
                return res.send("User not fount");
              }
              let currentDate = new Date(); 
              expiryDate = new Date();
              expiryDate.setMonth(currentDate.getMonth() + 1);
              user.package=packagename;
              user.expiry=expiryDate
              try {
                await user.save();
              } catch (err) {
                
                return res.send("Could not update user");
              }
 
              res.status(201)
              .json({
                userid: newsubscription.userid,
                username: newsubscription.username,
                useremail:newsubscription.useremail,
                packagename: newsubscription.packagename,
                packageprice: newsubscription.packageprice,
                subscriptionDate: newsubscription.subscriptiondate,
                expiry: formattedExpiryDate
          
              })
            }
            catch(e){
              console.log("error while creating subscription in db")
            }
        }
      }
    );
  });
  

  router.post("/cancel", async(req, res) => {
    const { email } = req.body;
    let user
    try {
      user = await User.findOne({ email: email });
    } catch (err) {
      return res.send("User not found");
    }
    user.package="free";
    try {
       await user.save();
       res.status(201)
              .json({
                "success": "1"
              })
    } catch (err) {
      
      res.status(404)
              .json({"success":"0", "message":"Cant cancel Subscription. Try Again Later"});
    }

 
 
  })

router.post("/newsubscription", async(req, res) => {
  const { userid, username,useremail, packagename, packageprice } = req.body;
  
  try{
    const newsubscription=  new subscription({
      userid,
      username,
      useremail,
      packagename,
      packageprice,
    })
    await newsubscription.save()
    console.log("done")
    res.status(201)
    .json({
      userid: newsubscription.userid,
      username: newsubscription.username,
      useremail:newsubscription.useremail,
      packagename: newsubscription.packagename,
      packageprice: newsubscription.packageprice,
      subscriptionDate: newsubscription.subscriptiondate,
      expiry: newsubscription.expiry

    })
  }
  catch(e){
    console.log("error while creating subscription")
    console.log(e)
  }

  })


  module.exports = router;