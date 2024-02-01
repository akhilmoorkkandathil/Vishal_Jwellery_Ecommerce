const cartModel = require('../model/cartSchema');
const { randomUUID } = require('crypto');
const orderModel = require('../model/orderModel')
const { default: ShortUniqueId } = require('short-unique-id');
const moment = require("moment");
let date = moment();
const Razorpay = require('razorpay');
const productModel = require('../model/productSchema');

const razorpayInstance = new Razorpay({ 

// Replace with your key_id 
key_id: process.env.RZP_KEY_ID, 

// Replace with your key_secret 
key_secret: process.env.RZP_KEY_SECRET 
}); 



module.exports = {
orderPage: async(req,res)=>{
    try {
        const userId = req.session.userId;

        const orders = await orderModel.find({userId:userId}).sort({ createdAt: -1 , orderId: -1 })
        console.log(orders);
        console.log(orders[0].items);
        let obj=[]
    let maps =orders.map((item)=>{
        let test={
            "orderId":item.orderId,
            "price":item.totalPrice,
            "status":item.status,
            "paymentMethod":item.paymentMethod,
            "createdAt":item.createdAt.toString().substring(0, 10),
        }
        obj.push(test)
    })
        await res.render('./user/orderDetails',{login:req.session.user,orders:obj})
    } catch (error) {
        console.log("Orders:",error);
    }
},

placeOrder: async(req,res) => {
    try {
        const payMethode = req.body.paymentOption;
        const userId = req.session.userId;
        const user = req.session.user;
        const username = user.username;
        const uid = new ShortUniqueId();
        const selectedAddress = user.address[0];
        const cartProducts = await cartModel.find({userId:userId});
        let total=cartProducts[0].total
        console.log(total);
        const orderId=uid.randomUUID(6)
        
            const order = new orderModel({
                orderId: orderId,
                userId: req.session.userId,
                userName: username,
                items: cartProducts[0].item,
                totalPrice: cartProducts[0].total,
                shippingAddress: selectedAddress,
                paymentMethod: payMethode,
                updatedAt: date.format("YYYY-MM-DD HH:mm"),
                createdAt: date.format("YYYY-MM-DD HH:mm"),
                status: "pending",
                
                });
                await order.save();
                await cartModel.updateOne({ userId: userId }, { $set: { item: [] } });
                const cart = await cartModel.find({userId:userId});
                
                console.log("Order"+order);
        if(payMethode==="COD"){
        res.redirect('/orderSuccess')

        }else{
            console.log("Rasorpay payment started");
            var options = {
                amount: total,  // amount in the smallest currency unit
                currency: "INR",
                receipt: orderId,
                };
                razorpayInstance.orders.create(options, function(err, order) {
                if (err) {
                console.error("Error in patment",err);
                return res.redirect('/error')
                }
                
                   res.redirect('/orderSuccess')
                });
            
        }
            
                
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
},

delAdress: async (req,res) => {
    try {
        console.log(req.body);
        res.redirect('/checkout')
    } catch (error) {
        console.log(error);
    }
},
cacelOrder: async (req,res) => {
    try {
        const orderId = req.params.orderId;
        console.log(orderId);
        const orders = await orderModel.find({orderId:orderId})
        console.log(orders);
        console.log("==============");
    if(orders[0].status==="pending" || orders[0].status==="Shipped"){
        const filter = { orderId: orderId};
        const update = { status: "Cancel" };
        await orderModel.updateOne(filter, { $set: update });
        await res.redirect('/orders')
    }else if(orders[0].status==="Delivered"){
        const filter = { orderId: orderId };
        const update = { status: "Return" };
        await orderModel.updateOne(filter, { $set: update });
        await res.redirect('/orders');
    }else{
        await res.redirect('/orders');
    }
    } catch (error) {
        console.log(error);
    }
},
orderShipped: async (req,res) => {
try {
    const orderId = req.params.id;
    const order = await orderModel.find({orderId: orderId})
if(order[0].status==="pending"){
    const filter = { orderId: orderId};
    const update = { status: "Shipped" };
    await orderModel.updateOne(filter, { $set: update });
    await res.redirect('/admin/orders')
}else if(order[0].status==="Shipped"){
    const filter = { orderId: orderId };
    const update = { status: "Delivered" };
    req.session.returnOrder=true;
    await orderModel.updateOne(filter, { $set: update });
    await res.redirect('/admin/orders');
}else{
    await res.redirect('/admin/orders');
}
    
    } catch (error) {
        console.log(error);
    }
},

viewOrderdProducts: async (req,res) => {
    try {
        const orderId = req.params.orderId;
        const userId = req.session.userId;
        const orders = await orderModel.find({userId:userId,orderId:orderId})
        console.log(orders[0]);
        let maps =orders.map((item)=>{
            let test={
                "orderId":item.orderId,
                "price":item.totalPrice,
                "status":item.status,
                "paymentMethod":item.paymentMethod,
                "createdAt":item.createdAt.toString().substring(0, 10),
            }
            obj.push(test)
        })
        res.render('./user/orderedProducts',{order:orders,login:req.session.user})
    } catch (error) {
        console.log(error);
    }
},

myOrders: async (req, res) => {
    try {
      const orderId = req.params.id;
      console.log(typeof(orderId));
      console.log("============");
      const order1 = await orderModel.find(); 
      console.log(order1[0].items[0]);
      const result = await orderModel.aggregate([
        {
          $match: {
            orderId:orderId,
          },
        },
        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $project: {
            _id: 1,
            orderId: 1,
            userName: 1,
            productName: "$productDetails.name",
            images:"$productDetails.images",
            price: "$productDetails.price",
            quantity: "$items.quantity",
            purchaseDate: "$createdAt",
            status: "$status",
          },
        },
      ]);
      console.log(result);
      let obj=[]
      let maps =result.map((item)=>{
        let test={
            "productName":item.productName,
            "price":item.price,
            "status":item.status,
            "quantity":item.quantity,
            "purchaseDate":item.purchaseDate.toString().substring(0, 10),
            "image":item.images[0],
        }
        obj.push(test)
    })
    if(req.session.user){
        res.render('./user/eachOrderProducts',{orderedProducts:obj,login:req.session.user}); // Corrected typo in the redirect URL
    }else{
        res.render('./admin/eachOrderProducts',{orderedProducts:obj,Admin:true}); // Corrected typo in the redirect URL
    }
     
    } catch (error) {
      console.error(error);
      res.redirect('/error');
    }
  }
  ,

verifyPayment: async (req,res) => {
    try {
        console.log(req.body);
    } catch (error) {
        res.redirect('/error')
    }
},

orderSuccess : async (req,res) => {
    try {
        res.render('./user/orderSuccess',{login:req.session.user})
    } catch (error) {
        
    }
}
}