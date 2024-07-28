const mongoose= require('mongoose')

const noteSchema= new mongoose.Schema({
    email: { type: String, required: true},
    date: { type: String, required: true},
    type: { type: String, required: true },
    language:{type: String, required: true},
    keywords: { type: [String], required: true},
    content: { type: String, required: true },
})

module.exports= mongoose.model("Note", noteSchema)