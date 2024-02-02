const mongoose=require('mongoose')


const couponSchema=new mongoose.Schema({
    couponCode:{
        type:String,
        required:true,
        upppercase:true
    },
    type:{
        type:String,
        required:true
        
    },
    minimumPrice:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
        required:true
    },
    maxRedeem:{
        type:Number,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:true
    }
})


couponSchema.index({expiry:1},{expireAfterSeconds:0})

const couponModel=new mongoose.model("coupons",couponSchema)

module.exports=couponModel