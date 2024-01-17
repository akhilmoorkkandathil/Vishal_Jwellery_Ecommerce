const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter your fullname']
    },
    email:{
            type:String,
            required:[true,'please enter your email'],
            unique:true,
            tolowecase:true,
        },
    password:{
            type:String,
            required:[true,'please enter a password'],
            minlength:[6,'min length is 6 character']
        }
    
})
module.exports= mongoose.model("Admin",adminSchema);