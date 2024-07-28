const mongoose= require('mongoose')

const subscriptionSchema= new mongoose.Schema({
    userid: { type: String, required: true},
    username: { type: String, required: true},
    useremail: { type: String, required: true},
    packagename: { type: String, required: true},
    packageprice: { type: String, required: true },
    subscriptiondate:{
        type: Date,
        default: function(){
            const currentDate = new Date();
            return currentDate;
        }
    },
    expiry:{
        type: Date,
        default: function(){
            const oneMonthFromNow = new Date();
            oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
            return oneMonthFromNow;
        }
    }
})

module.exports= mongoose.model("Subscription", subscriptionSchema)