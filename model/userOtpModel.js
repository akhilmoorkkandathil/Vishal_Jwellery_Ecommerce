// module importing 
const mongoose=require("mongoose")


// schema structuring 
const otpSchema=new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    otp: { type: Number, required: true },
    expiry: { type: Date,required:true }, 
})


// model creating 
const otpModel=new mongoose.model("otp_details",otpSchema)

// module exporting 
module.exports=otpModel