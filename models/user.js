const mongoose= require('mongoose')

const userSchema= new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true, minlength:6},
    package: { type: String, required: true , default: "basic"},
    expiry:{
        type: Date,
        default: function(){
            const oneMonthFromNow = new Date();
            oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
            return oneMonthFromNow;
        }
    }
})

module.exports= mongoose.model("User", userSchema)