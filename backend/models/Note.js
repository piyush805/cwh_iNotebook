const mongoose = require("mongoose");
const { Schema } = mongoose;
// Note model
const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    timeStamp: {
        type: String,
        default: Date.new
    }
})

module.exports = mongoose.model("notes", NotesSchema);