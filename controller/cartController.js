const { resolve } = require("path")
const cartModel=require("../model/cartSchema")
const productModel=require("../model/productSchema")
const objectId = require('mongodb').ObjectId

const cartProducts = async (req, res) => {
  try {
      const userId = req.session.userId;
      const sessionId = req.session.id;
  
      let cart;

      if (userId) {
          cart = await cartModel.findOne({ userId: userId }).populate({
              path: 'item.productId',
              select: 'images name price stock',
          });
          //console.log(cart);
      } else {
        
          cart = await cartModel.findOne({ sessionId: sessionId }).populate({
              path: 'item.productId',
              select: 'images name price',
          });
      }

      
      if (!cart || !cart.item) {

          
            cart = new cartModel({
              sessionId: req.session.id,
              item: [],
              total: 0,
            });
      }
      //console.log(cart.item);
      req.session.checkout=true
      let obj=[]
        let maps =cart.item.map((item)=>{
            let test={
                "_id":item.productId._id,
                "name":item.productId.name,
                "price":item.productId.price,
                "images":item.productId.images,
                "stock":item.stock,
            }
            obj.push(test)
          });
          //console.log(obj);
      res.render('./user/cart', { cart:obj , login:req.session.user});
    
  } catch (err) {
    console.log(err);
    res.render("users/serverError");
}
};
  const addToCart = async (req, res) => {
    try {
      const pid = req.params.id;
      const product = await productModel.findOne({ _id: pid });
      const userid = req.session.userId;
      const price = product.price;
      const stock = product.stock;
      const quantity = 1;
  
      if (stock==0){
        res.redirect('/cartpage')
      }else{
      let cart;
      if (userid) {
        cart = await cartModel.findOne({ userId: userid });
      }
      
      if (!cart) {
        cart = new cartModel({
          sessionId: req.session.id,
          item: [],
          total: 0,
        });
      }
      const productExist = cart.item.findIndex((item) => item.productId == pid);
      if (productExist !== -1) {
        cart.item[productExist].quantity += 1;
        cart.item[productExist].total = cart.item[productExist].quantity * price;
      } else {
        const newItem = {
          productId: pid,
          quantity: 1,
          price: price,
          stock: stock,
          total: quantity * price,
        };
        cart.item.push(newItem);
      }
  
      if (userid && !cart.userId) {
        cart.userId = userid;
      }
  
      cart.total = cart.item.reduce((acc, item) => acc + item.total, 0);
      await cart.save();
      res.redirect("/cart");
    }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };

const removeProduct = async(req,res)=> {
  try {
    let index = req.params.index;
    console.log(index);
    let userid = req.session.userId;
    const cart = await cartModel.findOne({ userId: userid });
    console.log(cart);
    cart.item.splice(index,1)
    console.log("==============");
    console.log(cart);
    
    await cart.save();

    res.redirect('/cart')

  } catch (error) {
    
  }
} 


module.exports={addToCart,cartProducts,removeProduct}