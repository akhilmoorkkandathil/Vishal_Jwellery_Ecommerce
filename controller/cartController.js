const { resolve } = require("path")
const cartModel=require("../model/cartSchema")
const productModel=require("../model/productSchema")
const objectId = require('mongodb').ObjectId

const cartProducts =async (req,res)=>{
    const product = await cartModel.find()
    await res.render('./user/cart',{product})
  }


// const addToCart = async(req,res)=>{
//     const pid = req.params.id;
//     const product = await productModel.findById(pid)
//     const user = req.session.user
//     const userid=user._id


//     const name = product.name
//     const price = product.price
//     const quantity=1
//     const images=product.images

//     const newItem = {
//       productId: pid,
//       quantity: 1,
//       price: price,
//       total: quantity * price,
//     };
//     cart.item.push(newItem);
   
//     console.log(user);
    
//     res.redirect('/cart')

// }



const addToCart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const productId = req.params.id;

    // Find the user's cart by their ID
    let userCart = await cartModel.findOne({ userId });

    // // If the user's cart doesn't exist, create a new cart
    // if (!userCart) {
    //   userCart = await cartModel.create({ userId, products: [] });
    // }

    // // Add the product to the user's cart if it's not already present
    // if (!userCart.products.includes(productId)) {
    //   userCart.products.push(productId);
    //   await userCart.save();
    // }

    res.redirect("/cart");
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};


module.exports={addToCart,cartProducts}