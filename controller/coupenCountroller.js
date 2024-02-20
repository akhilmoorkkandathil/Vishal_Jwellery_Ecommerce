const { Redirect } = require('twilio/lib/twiml/VoiceResponse')
const coupenModel = require('../model/coupenSchema')
const userModel = require('../model/userSchema')
const {
    alphanumValid,
    onlyNumbers,
    zerotonine,
    uppercaseAlphanumValid,
    isFutureDate

  } = require("../utils/Validator");

module.exports = {
    CoupenPage: async(req,res ,next) => {
        try {
            const coupens = await coupenModel.find({})
            console.log(coupens);
            let obj=[]
            let maps =coupens.map((item)=>{
                let test={
                    "_id":item._id,
                    "couponCode":item.couponCode,
                    "type":item.type,
                    "minimumPrice":item.minimumPrice,
                    "discount":item.discount,
                    "maxRedeem":item.maxRedeem,
                    "expiry":item.expiry.toISOString().substring(0, 10),
                    "status":item.status,
                }
                obj.push(test)
            })
            res.render('./admin/coupenList',{Admin:true,coupens:obj})
        } catch (error) {
            res.redirect('/admin/error')
        }
    },

    addCoupen: async (req,res ,next) => {
        try {
            const {couponCode,minimumPrice,discount,expiry,maxRedeem,couponType}=req.body

        const couponValid=uppercaseAlphanumValid(couponCode)
        const minimumValid = onlyNumbers(minimumPrice) 
        const discountValid = onlyNumbers(discount)
        const expiryValid= isFutureDate(expiry)
        const maxredeemValid = onlyNumbers(maxRedeem)
        

        if(!couponValid){
            console.log("=======1234");
            req.flash("error","Enter a Uppercase Alphanumeric coupen code")
            return res.redirect("/admin/addCoupen")
        }
        else if(!minimumValid){
            console.log("=======1234");
            req.flash("error", "Enter Numeric value for Minimum Amount")
            return res.redirect("/admin/addCoupen")
        }
        else if(!discountValid){
            console.log("=======1234");
            req.flash("error", "Enter a Number as discount")
            return res.redirect("/admin/addCoupen")
        }
        else if(!expiryValid){
            console.log("=======1234");
            req.flash("error", "Select correct date")
            return res.redirect("/admin/addCoupen")
        }
        else if(!maxredeemValid){
            console.log("=======1234");
            req.flash("error", "Enter numeric value for Max Redeem")
            return res.redirect("/admin/addCoupen")

        }  
        const couponExists = await coupenModel.findOne({ couponCode: couponCode });
        if (couponExists) {
            req.flash("error", "Coupen Code Already Exist")
            res.redirect('/admin/addCoupen');
        } else {
            
            let coupen=await coupenModel.create({
                couponCode: couponCode,
                type:couponType,
                minimumPrice:minimumPrice,
                discount:discount,
                maxRedeem:maxRedeem,
                expiry:expiry.toString()
                })
            res.redirect('/admin/coupens')

    }
        } catch (error) {
            console.log(error);
            res.redirect('/admin/error')
        }
    },
    editCoupenPage: async (req,res ,next) => {
        try {
            const id = req.query.id;
            req.session.coupenId=id;
            const coupens = await coupenModel.find({_id:id})
            console.log(coupens);
            let obj=[]
            let maps =coupens.map((item)=>{
                let test={
                    "_id":item._id,
                    "couponCode":item.couponCode,
                    "type":item.type,
                    "minimumPrice":item.minimumPrice,
                    "discount":item.discount,
                    "maxRedeem":item.maxRedeem,
                    "expiry":item.expiry.toISOString().substring(0, 10),
                    "status":item.status,
                }
                obj.push(test)
            })
            console.log(obj);
            res.render('./admin/editCoupen',{Admin:true,coupen:obj})
        } catch (error) {
            res.redirect('/admin/error');
        }
    },

    editCoupen: async (req,res ,next) => {
        try {
            console.log("===================");
            const id = req.session.coupenId;
            const productDetails=req.body;
            const coupen= await coupenModel.updateOne({_id:id},{
                $set: {
                    couponCode:productDetails.couponCode,
                    type:productDetails.type,
                    minimumPrice:productDetails.minimumPrice,
                  discount:productDetails.discount,
                  maxRedeem:productDetails.maxRedeem,
                  expiry:productDetails.expiry
                }
              })
              console.log("okay");
              res.redirect("/admin/coupens");
          } catch (error) {
            console.log(error);
            res.redirect('/admin/error')
          }
    },
    unlistCoupen: async (req,res ,next) => {
        try {
            const id = req.query.id;
      const coupen = await coupenModel.findById(id);
  
      if (!coupen) {
        return res.status(404).send("Product not found");
      }
    
      coupen.status = !coupen.status;
      await coupen.save();
      res.redirect("/admin/coupens");
        } catch (error) {
            res.redirect('/admin/error');
        }
    },
    deleteCoupen: async (req,res ,next) => {
        try {
            const id = req.query.id;
      await coupenModel.deleteOne({ _id: id });
      res.redirect("/admin/coupens");
        } catch (error) {
            res.redirect('/admin/error');
        }
    },
     applyCoupon : async (req, res) => {
        try {
            console.log("=============");
          const { couponCode, subtotal } = req.body;
          const userId=req.session.userId
          const coupon = await coupenModel.findOne({ couponCode: couponCode });
          console.log(coupon);
          
          if (coupon&&coupon.status===true) {
      
              const user = await userModel.findById(userId);
      
              if (user && user.usedCoupons.includes(couponCode)) {
                res.json({ success: false, message: "Already Redeemed" });
              }
              else if (coupon.expiry > new Date() && coupon.minimumPrice <= subtotal) {
                  console.log("Coupon is valid");
                  let dicprice;
                  let price;
                  if(coupon.type==="percentageDiscount"){
                    dicprice = (subtotal * coupon.discount) / 100;
                    if(dicprice>=coupon.maxRedeem){
                      dicprice=coupon.maxRedeem
                    }
                    price = subtotal - dicprice;
                  }else if(coupon.type==="flatDiscount"){
                    dicprice=coupon.discount
                    price=subtotal-dicprice
      
                  }
                  
                  console.log(price);
                  req.session.price=price
      
                  const user=await userModel.findByIdAndUpdate(
                    userId,
                    { $addToSet: { usedCoupons: couponCode } },
                    { new: true }
                  );
                  console.log(user);
                  res.json({ success: true, dicprice, price });
              } else {
                  res.json({ success: false, message: "Invalid Coupon" });
              }
          } else {
              res.json({ success: false, message: "Coupon not found" });
          }
          
        } catch (err) {
          console.log(err);
          res.redirect('/admin/error')
      }
      },
      
       revokeCoupon:async(req,res ,next)=>{
        try{
      
          const { couponCode, subtotal } = req.body;
          console.log(subtotal,typeof(subtotal));
          const userId=req.session.userId
          const coupon = await coupenModel.findOne({ couponCode: couponCode });
          console.log(coupon);
          
          if (coupon) {
      
              const user = await userModel.findById(userId);
      
             
              if (coupon.expiry > new Date() && coupon.minimumPrice <= subtotal) {
                  console.log("Coupon is valid");
                  const dprice = (subtotal * coupon.discount) / 100;
                  const dicprice = 0;
      
                  const price = subtotal + dicprice;
                  console.log(price);
      
                  await userModel.findByIdAndUpdate(
                    userId,
                    { $pull: { usedCoupons: couponCode } },
                    { new: true }
                  );
                  req.session.price=price
                  res.json({ success: true, dicprice, price });
              } else {
                  res.json({ success: false, message: "Invalid Coupon" });
              }
          } else {
              res.json({ success: false, message: "Coupon not found" });
          }
          
      
        }
        catch (err) {
          console.log(err);
          res.redirect('/admin/error')
      }
    }
}