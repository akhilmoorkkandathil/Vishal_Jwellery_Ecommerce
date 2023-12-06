const userModel=require("../model/userSchema")
const AdminModel = require('../model/adminSchema')
const categoryModel=require('../model/categorySchema')



const dashboard = async(req, res)=> {
    await res.render('./admin/dashboard',{Admin:true})
}

const adminLogin = async(req,res)=>{
    await res.render('./admin/adminLogin',{Single:true})
}


const catList = async (req,res)=>{
    try {
        console.log("=================");
        // Assuming productModel.find() returns an array of objects
        const categories = await categoryModel.find()
        //console.log(products);
        let obj=[]
        let maps =categories.map((iteam)=>{
            let test={
                "_id":iteam._id,
                "name":iteam.name,
                "description":iteam.description
            }
            obj.push(test)
        })
        //console.log(obj);
        await res.render('./admin/categoryList',{obj,Admin:true})
    } catch (err) {
        console.log(err);
        res.send("Error Occurred");
    }
    
}

// admin new category adding 
const addCategory = async (req, res) => {
    try {
        const catName = req.body.catname;
        const catdes = req.body.catdes;
        await categoryModel.insertMany({ name: catName, description: catdes,status:true });
        res.redirect("/admin/category");
     
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  



// product unlisting 
const unlistCategory = async (req, res) => {
    try {
      const id = req.params.id;
      const Category = await categoryModel.findById(id);
  
      if (!Category) {
        return res.status(404).send("Category not found");
      }
  
      console.log(Category);
  
      Category.status = !Category.status;
      await Category.save();
      res.redirect("/admin/category");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };
  
  // category deleting
  const deletingCategory = async (req, res) => {
    try {
        console.log("okay");
      const id = req.params.id;
      const category = await categoryModel.deleteOne({ _id: id });
      res.redirect("/admin/category");
      console.log("okay deleted");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  

  // admin category update page
  const updatecat = async (req, res) => {
    try {
        const id = req.params.id;
        const cat = await categoryModel.findOne({ _id: id });
        res.render("admin/updatecat", { itemcat: cat });
      
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  
  
  // admin category updating
  const updatecategory = async (req, res) => {
    try {
        const id = req.params.id;
        const catName = req.body.categoryName;
        const catdec = req.body.description;
        await categoryModel.updateOne(
          { _id: id },
          { name: catName, description: catdec }
        );
        res.redirect("/admin/category");
      
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  

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

module.exports = {loginAdmin,dashboard,adminLogin,addCoupen,coupen,userList,deleteUser,products,orders,addCategory,catList,unlistCategory,deletingCategory,logOut}