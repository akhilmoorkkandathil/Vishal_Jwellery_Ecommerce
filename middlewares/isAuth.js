const userModel=require('../model/userSchema')

const userAuth = async (req, res, next) => {
    try {
        const user = req.session.user;
        
        if (!user) {
            // If user session doesn't exist, redirect to login
            return res.render("./user/login", { Single: true });
        }
        
        const phone = user.phone;
        const usr = await userModel.find({ phone: phone });
        
        if (!usr || usr.length === 0) {
            // If no user found, destroy session and redirect to login
            req.session.destroy();
            return res.render("./user/login", { Single: true });
        }
        
        const obj = usr.map((item) => {
            return {
                status: item.status
            };
        });

        if (req.session.isAuth && obj[0].status) {
            // If authenticated and status exists and is true, proceed
            return next();
        } else {
            req.session.isAuth = false;
            res.clearCookie('myCookie');
            req.session.destroy();
            res.redirect("/");
        }
    } catch (error) {
        console.log("Error occurred");
        console.log(error);
        res.render("./user/login", { Single: true });
    }
}


const userRegister = (req,res)=>{
    if(req.session.signup){
        next()
    }else{
        res.render("./user/register",{Single:true});
    }
}

module.exports={
    userAuth,
    userRegister
    
}