const cartModel=require("../model/cartSchema")
const productModel=require("../model/productSchema")

const cartProducts =async (req,res)=>{
    const product = await cartModel.find()
    await res.render('./user/cart',{product})
  }

const addToCart = async(req,res)=>{
    const pid = req.params.id;
    const product = await productModel.findById(pid)
    const user = req.session.user
    const userid=user._id


    const name = product.name
    const price = product.price
    const quantity=1
    const images=product.images

    const newItem = {
      productId: pid,
      quantity: 1,
      price: price,
      stock :stock,
      total: quantity * price,
    };
    cart.item.push(newItem);
   
    console.log(user);
    
    res.redirect('/cart')

}
module.exports={addToCart,cartProducts}