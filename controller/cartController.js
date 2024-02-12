const { resolve } = require("path")
const cartModel=require("../model/cartSchema")
const productModel=require("../model/productSchema")
const objectId = require('mongodb').ObjectId


module.exports = {
 cartProducts : async (req, res) => {
  try {
      const userId = req.session.userId;
      const sessionId = req.session.id;
  
      let cart;

      if (!userId) {
          cart = await cartModel.findOne({ sessionId: sessionId })
          .populate({
              path: 'item.productId',
              select: 'images name price stock offerPrice',
          });
          
      } else {
        
          cart = await cartModel.findOne({ userId: userId }).populate({
              path: 'item.productId',
              select: '_id images name price offerPrice',
          });
          console.log(cart+"=================");
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
                "productId":item.productId._id,
                "name":item.productId.name,
                "price":item.productId.price,
                "images":item.productId.images,
                "offerPrice":item.productId.offerPrice,
                "stock":item.stock,
                "quantity":item.quantity,
                "userId":item.userId,
                "cartId":item._id,
                "total":item.total,
            }
            obj.push(test)
          });
          console.log(obj);
          req.session.isAuth=true;
          res.render('./user/cart', { products:obj , login:req.session.user});
    
  } catch (err) {
    console.log(err);
    res.redirect('/error')
}
},
   addToCart : async (req, res) => {
    try {
      const pid = req.params.id;
      const product = await productModel.findOne({ _id: pid });
      console.log(product);
      const userid = req.session.userId;
      console.log(product.price,product.offerPrice);
      const price = product.offerPrice || product.price;
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
      req.session.isAuth=true;
      res.redirect("/cart");
    }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

 removeProduct : async(req,res)=> {
  try {
    let index = req.params.index;
    console.log(index);
    let userid = req.session.userId;
    const cart = await cartModel.findOne({ userId: userid });
    console.log(cart);
    cart.item.splice(index,1)
    console.log(cart);
    
    await cart.save();

    res.redirect('/cart')

  } catch (error) {
    res.redirect('/admin/error')
  }
} ,

 updateProduct : async (req,res) => {
  try {
    const { productId, newQuantity,cartId } = req.body;
    cartModel.findOneAndUpdate(
      { _id: cartId, productId: productId },
      { $set: { 'products.$.quantity': newQuantity } },
      { new: true }
    )

  } catch (error) {
    console.log(error);
    res.redirect('/admin/error')
  }
},

updateQuantity : async (req,res) => {
   const { productId, newQuantity  } = req.body;
   try {
   
    const userId = req.session.userId;
    const cart = await cartModel.findOne({ userId: userId });
    

    if (!cart) {
       return res.status(404).json({ error: 'Cart not found' });
    }

    // Find the item in the cart based on productId
    const cartItem = cart.item.find(item => item.productId.toString() === productId);

    if (!cartItem) {
       return res.status(404).json({ error: 'Product not found in the cart' });
    }

    // Check if the new quantity is within the available stock
    if (newQuantity > cartItem.stock) {
       return res.status(400).json({ error: 'New quantity exceeds available stock' });
    }

    // Update the quantity and total in the cart item
    cartItem.quantity = newQuantity;
    cartItem.total = newQuantity * cartItem.price;

    // Recalculate the total for the entire cart
    cart.total = cart.item.reduce((acc, item) => acc + item.total, 0);
    // Save the updated cart to the database
    await cart.save();

    res.json({ success: true, cart });
 } catch (error) {
    console.error('Error updating quantity:', error);
    res.redirect('/admin/error')
 }
},
productQuantity : async (req,res) => {
  const { productId} = req.body;
  try {
  
   
   const product = await productModel.findOne({ _id: productId });
   
   console.log("========",product.stock);
   if (!product) {
      return res.status(404).json({ error: 'Product not found' });
   }
   console.log(product);
   
   res.json({ success: true, product });
   

   
} catch (error) {
   console.error('Error updating quantity:', error);
   res.redirect('/admin/error')
}
}

}

