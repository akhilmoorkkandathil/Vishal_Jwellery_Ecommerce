const walletModel = require('../model/walletSchema')

module.exports = {
    walletPage:async(req,res)=>{
        const userId= req.session.userId;
        const wallet = await walletModel.findOne({ userId: userId });
        res.render('./user/walletPage',{login:req.session.user,wallet:wallet.wallet})
    },
    createWallet:async(req,res)=>{
        try {
            const userId = req.session.userId;
            let user = await walletModel
              .findOne({ userId: userId })
              .sort({ "walletTransactions.date": -1 });
        
            if (!user) {
              wallet = await walletModel.create({ userId: userId });
            }
        
        
            res.render("./user/wallet", {  wallet:wallet });
          } catch (err) {
            console.log(err);
            res.redirect('/error')
          }
    },
    addToWallet:async(req,res)=>{
        try {
            const userId = req.session.userId;
            const Amount = parseFloat(req.body.Amount);
            console.log(Amount);
            const wallet = await walletModel.findOne({ userId: userId });
            if (!wallet) {
               await walletModel.create({ 
                userId: userId,
                wallet:Amount,
                walletTransactions:[
                    {
                        type: "Credited",
                        amount: Amount,
                        date: new Date(),
                      }
                ]
             });
            }else{
                const wallet = await walletModel.findOne({ userId: userId });

    wallet.wallet += Amount;
    wallet.walletTransactions.push({
      type: "Credited",
      amount: Amount,
      date: new Date(),
    });

    
    await wallet.save();
            }
            
        
            res.redirect("/wallet");
          } catch (err) {
            console.log(err);
            res.redirect('/error')
          }
    },
    walletTransaction : async (req, res) => {
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
      }  catch (err) {
        console.log(err);
        res.redirect('/error')
    }
    }
    
}