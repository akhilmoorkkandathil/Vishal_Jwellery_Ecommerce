const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter your name']
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        unique:true,
        tolowercase:true,
    },
    phone:{
        type:Number,
        required:[true,'Please enter your phone'],
        minlength:[10,'please enter a valid phonenumber'],
    },
    password:{
        type:String,
        required:[true,'Please enter password'],
        minlength:[6,'Minimum length is 6 characters']
    }
})

module.exports= mongoose.model("Users",userSchema);