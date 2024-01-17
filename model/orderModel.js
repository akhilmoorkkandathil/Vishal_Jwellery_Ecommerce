const mongoose=require('mongoose')

const orderschema=mongoose.Schema({
    orderId:{
        type:String,
        unique:true
        },
        userId:{
            type:String,
            required:true
        },
        userName:{
            type:String,
            required:true
        },
        items:{
            type:Array,
            required:true
        }, 
        totalPrice:{
            type:Number,
            required:true
        },
        totalOfferPrice:{
            type:Number,

        },
        shippingAddress:{
            type:Object,
            required:true
        },
        paymentMethod:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            required:true
        },
        status:{
            type:String,
            required:true,

        },
        razor_payment_id:{
            type:String,
        },
        updatedAt:{
            type:Date,
        }
});

const orderModel = new mongoose.model("orders",orderschema);

module.exports=orderModel;