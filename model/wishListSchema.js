const mongoose=require('mongoose')


const wishList = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    },
    sessionId: String,
    item: [
        {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        
        },
    ],

  });
  
 const wishListSchema = mongoose.model('wishList', wishList);
  
  module.exports = wishListSchema;