const usersModel = require('../model/userSchema');
const walletModel = require('../model/walletSchema')

module.exports = {
  walletPage: async (req, res, next) => {
    const userId = req.session.userId;
    console.log(userId);

    // Find the user and extract referral code
    let user = await usersModel.findOne({ _id: userId });
    let arr = [{ referelCode: user.referelCode }];

    // Find the wallet for the user
    let wallet = await walletModel.findOne({ userId: userId });

    if (!wallet) {
        // If wallet doesn't exist, create a new one with initial balance of 0
        wallet = await walletModel.findOneAndUpdate(
            { userId: userId },
            { $setOnInsert: { userId: userId, wallet: 0 } },
            { upsert: true, new: true }
        );
    }

    // Extract wallet balance
    let obj = [{ wallet: wallet.wallet }];

    // Extract wallet transaction history sorted by date in descending order
    let obj2 = [];
    if (wallet.walletTransactions.length > 0) {
        obj2 = wallet.walletTransactions.map(transaction => ({
            wallet: wallet.wallet,
            date: transaction.date.toString().substring(0, 10),
            type: transaction.type,
            amount: transaction.amount
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    res.render('./user/walletPage', { wallet: obj[0], user: arr[0], walletHistory: obj2, login: req.session.user });
}
  ,
    createWallet:async(req,res ,next)=>{
        try {
            const userId = req.session.userId;
            let user = await walletModel
              .findOne({ userId: userId })
              .sort({ "walletTransactions.date": -1 });
        
            if (!user) {
              wallet = await walletModel.create({ userId: userId });
            }
        
        
            res.render("./user/wallet", {  wallet:wallet });
          } catch (error) {
            console.log(error);
           error.status = 500;
      next(error);
          }
    },
    addToWallet:async(req,res ,next)=>{
        try {
            const userId = req.session.userId;
            const Amount = parseFloat(req.body.Amount);
            console.log(Amount);
            const wallet = await walletModel.findOne({ userId: userId });
                wallet.wallet += Amount;
                wallet.walletTransactions.push({
                  type: "Credited",
                  amount: Amount,
                  date: new Date(),
                });

    
    await wallet.save();
            
        
            res.redirect("/wallet");
          } catch (error) {
            console.log(error);
           error.status = 500;
      next(error);
          }
    },
    walletTransaction : async (req,res,next) => {
      try {
        console.log("iiiiide ethi mwone..........")
         const userId=req.session.userId
         const amount=req.body.amount 
         const user=await walletModel.findOne({userId:userId})
         console.log("user",user)
         console.log("amount",amount);
         const wallet=user.wallet
         console.log("wallet",wallet);
    
         if(user.wallet>=amount){
          user.wallet-=amount
          await user.save();
    
          const wallet=await walletModel.findOne({userId:userId})
          
          
              wallet.walletTransactions.push({type:"Debited",
              amount:amount,
              date:new Date()})
              await wallet.save();
          
          res.json({success:true})
         }
         else{
          res.json({success:false,message:"don't have enought money"})
         }
      }  catch (error) {
        console.log(error);
       error.status = 500;
      next(error);
    }
    }
    
}