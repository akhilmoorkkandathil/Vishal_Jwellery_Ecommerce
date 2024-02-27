const mongoose=require('mongoose')
const Schema = mongoose.Schema;



const walletSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    wallet: {
      type: Number,
      default: 0,
    },
    walletTransactions: [
      {
        date: { type: Date },
        type: { type: String },
        amount: { type: Number },
      },
    ],
  });
  
  const walletModel = mongoose.model("wallets", walletSchema);

module.exports=walletModel