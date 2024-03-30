const mongoose = require('mongoose')

const subsSchema = mongoose.Schema({
  email: String,
});

const Subscriber = mongoose.model("user-subscribers", subsSchema)

module.exports =  Subscriber



const userSchema=mongoose.Schema({
  userName:String,
  email:String,
  password:String,
});
const Rigesterd = mongoose.model("users-rigestred", userSchema)
module.exports= Rigesterd

