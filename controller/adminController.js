const userModel=require("../model/userSchema")
const AdminModel = require('../model/adminSchema')



const dashboard = async(req, res)=> {
    await res.render('./admin/dashboard',{Admin:true})
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

const logOut = (req,res)=>{
    console.log("okay");
    req.session.isadAuth = false;
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Error destroying session');
      } else {
       res.redirect("/")
      }
    });
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
    await res.render('./admin/orderList',{Admin:true})
}
const products = async(req,res)=>{
    await res.render('./admin/productList',{Admin:true})
  }

//@desc login a admin
//@router Post admin/login
//@access public
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
      console.log("================================");
        const admin = await AdminModel.findOne({ email });
        console.log(admin);
        if (!admin) {
            return res.status(400).json({ message: "Invalid credencial" });
        }
        if (!password) {
            return res.status(400).json({ message: "Invalid password" });
        }
        req.session.isadAuth = true;

        res.render('./admin/dashboard', { message: 'Login successful',Admin:true});
    } catch (error) {
      console.log("================================");
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {loginAdmin,dashboard,adminLogin,addCoupen,coupen,userList,deleteUser,products,orders,logOut,blockUser}