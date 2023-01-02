/*File for connecting to mongo databse*/ 
const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/";

const connectToMongo =()=>{
    mongoose.connect(mongoURI,()=>{
    })
}
module.exports = connectToMongo;