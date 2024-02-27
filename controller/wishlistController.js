const favModel = require('../model/wishListSchema');
const categoryModel = require('../model/categorySchema');
const productModel = require('../model/productSchema');

module.exports = {
    addToWishlist : async (req,res,next) => {
        try {
            console.log("=================");
            const pid = req.query.proId;
            console.log(pid);
            const product = await productModel.findOne({ _id: pid });
        
            const userId = req.session.userId;
            const price = product.price;
          
            let fav;
            if (userId) {
              fav = await favModel.findOne({ userId: userId });
            }
            if (!fav) {
              fav = await favModel.findOne({ sessionId: req.session.id });
            }
        
            if (!fav) {
              fav = new favModel({
                sessionId: req.session.id,
                item: [],
                total: 0,
              });
            }
            
            const productExist = fav.item.findIndex((item) => item.productId == pid);
            
            if (productExist !== -1) {
              
              
            } else {
              const newItem = {
                productId: pid,
                price: price,
              };
              fav.item.push(newItem);
            }
        
            if (userId && !fav.userId) {
              fav.userId = userId;
            }
        
            await fav.save();
            res.redirect('/wishlist');
          }  catch (err) {
            console.log(err);
            res.render("users/serverError")
        }
        },
        wishListProduct:async (req,res,next)=>{
            try {
                const userId = req.session.userId;
                const sessionId = req.session.id;
                const categories = await categoryModel.find();
                let fav;
            
                if (userId) {
                    fav = await favModel.findOne({ userId: userId }).populate({
                        path: 'item.productId',
                        select: 'images name price offerPrice',
                    });
                } else {
                    fav = await favModel.findOne({ sessionId: sessionId }).populate({
                        path: 'item.productId',
                        select: 'images name price offerPrice',
                    });
                }
            
                
                if (!fav || !fav.item) {
                      fav = new favModel({
                        sessionId: req.session.id,
                        item: [],
                        total: 0,
                      });
                }

                let obj=[]
          let maps =fav.item.map((item)=>{
              let test={
                  "productId":item.productId._id,
                  "name":item.productId.name,
                  "price":item.productId.price,
                  "images":item.productId.images,
                  "offerPrice":item.productId.offerPrice,
              }
              obj.push(test)
            });
            console.log(obj);
                req.session.isAuth=true;
                req.session.wishlist=true;
                res.render('./user/wishListPage', { products:obj , login:req.session.user});
            
            } catch (err) {
              console.log(err);
              res.render("users/serverError")
            }
        },
        removeProduct : async(req,res ,next)=> {
          try {
            let index = req.params.index;
            console.log(index);
            let userid = req.session.userId;
            const wishlist = await favModel.findOne({ userId: userid });
            console.log(wishlist);
            wishlist.item.splice(index,1)
            console.log(wishlist);
            
            await wishlist.save();
        
            res.redirect('/wishlist')
        
          } catch (error) {
            error.status = 500;
              next(error);
          }
        }
}