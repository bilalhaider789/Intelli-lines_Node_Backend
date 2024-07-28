
const User = require("../models/user");
const Note = require("../models/note");


const demo = async (req, res, next) => {
    console.log("requested")
    const data= ( await User.find());
    return res.status(200).json(data);
  };


const alldata = async (req, res, next) => {
try{
const email= req.body.email
const data= ( await Note.find({email: email}));

return res.send(data);
}
catch(e){
    console.log(e)
    res.send({"success":"0"})
}
};

const deletenote = async (req, res, next) => {
    try{
    const id= req.body.id
    console.log(id)
    await Note.findByIdAndDelete(id)
    return res.status(200).json({"success":"1"});
    }
    catch(e){
        console.log(e)
        res.send({"success":"0"})
    }
    };


const createnote=async(req, res)=>{
    console.log("created route accessed")
    const data=req.body
    console.log(data)
    let currentDate = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    try{
        const createdNote= new Note({
            email: data.email,
            date: formattedDate,
            type: data.type,
            keywords: data.keywords,
            language: data.language,
            content: data.type=="key"? data.content.replace(/\r?\n|\r/g, "."):data.content.replace(/\r?\n|\r/g, " "),
        })
        createdNote.save()
        console.log(data.content.replace(/\r?\n|\r/g, "."))
        res.send({"success":"1"})
    }
    catch(e){
        console.log(e)
        res.send({"mess":"Note cant be created at the moment", "success":"0"})
    }
}


exports.alldata=alldata;
exports.deletenote=deletenote;
exports.createnote=createnote;
exports.demo = demo;