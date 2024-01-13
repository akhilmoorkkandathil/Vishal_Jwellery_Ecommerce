const cartModel = require('../model/cartSchema');
const { randomUUID } = require('crypto');
const orderModel = require('../model/orderModel')
const { default: ShortUniqueId } = require('short-unique-id');
const moment = require("moment");
let date = moment();


module.exports = {
    orderPage: async(req,res)=>{
        try {
            const userId = req.session.userId;

            const orders = await orderModel.find({userId:userId})
            console.log(orders);
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
            const payMethode = req.body.paymentMethod;
            const userId = req.session.userId;
            const user = req.session.user;
            const username = user.username;
            const uid = new ShortUniqueId();
            const selectedAddress = user.address[0];
            const cartProducts = await cartModel.find({userId:userId});
            const items = cartProducts[0].item;
            const order = new orderModel({
                orderId: uid.randomUUID(6),
                userId: userId,
                userName: username,
                items: items,
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
                  console.log(cart);

            res.redirect('/orders')
        } catch (error) {
            console.log(error);
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
            const filter = { orderId: orderId };
            const update = { status: "Cancelled" };

            await orderModel.updateOne(filter, update);
            await res.redirect('/orders')
        } catch (error) {
            console.log(error);
        }
    },
    orderShipped: async (req,res) => {
        try {
            const orderId = req.params.id;
    const filter = { orderId: orderId, status: { $ne: 'Cancelled' } };
    const update = { status: "Shipped" };
    const order = await orderModel.updateOne(filter, { $set: update });

    console.log("Update Result:", order);
            await res.redirect('/admin/orders')
        } catch (error) {
            console.log(error);
        }
    },
    viewOrderdProducts: async (req,res) => {
        try {
            const userId = req.session.userId;
            const orders = await orderModel.find({userId:userId})
            console.log(orders);
            res.render('./user/orderedProducs',{order:order})
        } catch (error) {
            console.log(error);
        }
    }
}