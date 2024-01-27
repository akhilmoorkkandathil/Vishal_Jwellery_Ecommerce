const userModel=require("../model/userSchema")
const adminModel = require('../model/adminSchema')
const orderModel=require('../model/orderModel')



const dashboard = async(req, res)=> {
  const admin = await adminModel.find()
  const adminName = admin.name;

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
    await res.render('./admin/dashboard',{Admin:true,adminName:adminName})
}


const adminLogin = async(req,res)=>{
    await res.render('./admin/adminLogin',{Single:true})
}


const addCoupen = async(req,res)=>{
    await res.render('./admin/addCoupen',{Admin:true})
}


const coupen = async (req,res)=>{
    await res.render('./admin/coupenList',{Admin:true})
}

const logOut = (req, res) => {
  console.log("Logging out");
  
  // Clear the session variable
  req.session.isadAuth = false;
  
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error destroying session');
    } else {
      // Clear the 'isadAuth' cookie
      res.clearCookie('myCookie');
      
      // Redirect to the logout page or wherever you want after logout
      res.redirect("/admin/");
    }
  });
};

const errorPage = async (req,res) => {
  await res.render('./admin/errorPage',{Single:true})
}



const userList = async(req,res)=>{
  try {
    const users = await userModel.find();
    // console.log(users);
    let obj=[]
        let maps =users.map((item)=>{
            let test={
                "_id":item._id,
                "username":item.username,
                "email":item.email,
                "phone":item.phone,
                "status":item.status,
            }
            obj.push(test)
        })
        console.log(obj);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        req.session.isadAuth = true;
    res.render("./admin/customerList", { users: obj,Admin:true });
} catch (error) {
  console.log(error);
  res.send(error);
}
}


///delete user
const deleteUser = async (req, res) => {
  try {
    console.log("=====================1");
    const id = req.params.id;
    await userModel.deleteOne({ _id: id });
    res.redirect("/admin/customers");
  } catch (error) {
    console.log("=====================1");
    console.log(error);
    res.send(error);
  }
};

// product unlisting 
const blockUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log(user);

    user.status = !user.status;
    await user.save();
    res.redirect("/admin/customers");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const orders = async(req,res)=>{
  const orders = await orderModel.find().sort({ createdAt: -1 })
  let obj=[]
        let maps =orders.map((item)=>{
            let test={
                "orderId":item.orderId,
                "userName":item.userName,
                "totalPrice":item.totalPrice,
                "shippingAddress":item.shippingAddress,
                "paymentMethod":item.paymentMethod,
                "status":item.status,
                "createdAt":item.createdAt.toString().substring(0, 10),
            }
            obj.push(test)
        })
  console.log(orders);
  req.session.isadAuth = true;
    await res.render('./admin/orderList',{Admin:true,orders:obj});
}
const products = async(req,res)=>{
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    await res.render('./admin/productList',{Admin:true});
  }

//@desc login a admin
//@router Post admin/login
//@access public
// admin login action 
const adminLogined = async (req, res) => {
  const {email,password}=req.body;
  try {
    
    const user = await AdminModel.findOne({ email,password });
    
    if (user) {
      req.session.isadAuth = true;
      res.redirect("/admin/dashboard");
    } else {
      req.flash("error", "Invalid email or Password");
      res.render("admin/adminlogin",{Single:true});
    }
  } catch (error) {
    console.log(error);
    res.redirect('/admin/error')
  }
};

module.exports = {dashboard,adminLogin,addCoupen,coupen,userList,deleteUser,products,orders,logOut,blockUser,adminLogined,errorPage}