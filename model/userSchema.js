const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username:{
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
    },
    address: {
        type: [{
          saveas:{type:String},
          fname:{type:String},
          lname:{type:String},
          pincode:{type:Number},
          locality: { type: String},
          address: { type: String},
          altphone:{type:Number},
          city: { type: String },
          state:{type:String},
          country:{type:String},
          phone:{type:Number},
          landmark:{type:String}
        }]},
    isAdmin:{
        type:Boolean,
        default:false,
        required:true,
    },
    status:{
        type:Boolean,
        default:false,
        required:true
    },
    usedCoupons:
     [{ type: String }],
    referelCode:{ 
        type:String
    }
})

const usersModel= mongoose.model("Users",userSchema);
module.exports =usersModel;