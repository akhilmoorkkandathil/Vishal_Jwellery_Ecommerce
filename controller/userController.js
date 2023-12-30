
const userModel = require('../model/userSchema')
const productModel=require('../model/productSchema')
const categoryModel=require('../model/categorySchema')
const otpModel = require("../model/userOtpModel");
const bcrypt = require('bcrypt')
const session = require('express-session')
const twilioClient = require('../config/twilioService');
const {
    nameValid,
    emailValid,
    phoneValid,
    confirmpasswordValid,
    passwordValid,
  } = require("../utils/userValidator");

//const errorHandler = require('../middlewares/errorhandlerMiddleware')



//@desc Home page
//@router Get /
//@acess public
const home = async(req,res)=>{
  const dproduct = await productModel.find({status:true,category:"Dining"}).limit(4)
  let dobj=[]
      let dmaps =dproduct.map((iteam)=>{
          let test={
              "_id":iteam._id,
              "name":iteam.name,
              "price":iteam.price,
              "images":iteam.images,
              "category":iteam.category,
              "stock":iteam.stock,
              "status":iteam.status,
              "description":iteam.description
          }
          dobj.push(test)
      })
      //console.log(cobj);
      const bproducts = await productModel.find({status:true,category:"Bedroom"}).limit(4)
      let bobj=[]
          let bmaps =bproducts.map((iteam)=>{
              let test={
                  "_id":iteam._id,
                  "name":iteam.name,
                  "price":iteam.price,
                  "images":iteam.images,
                  "category":iteam.category,
                  "stock":iteam.stock,
                  "status":iteam.status,
                  "description":iteam.description
              }
              bobj.push(test)
          })
          const sproducts = await productModel.find({status:true,category:"Study Room"}).limit(4)
          let sobj=[]
              let smaps =sproducts.map((iteam)=>{
                  let test={
                      "_id":iteam._id,
                      "name":iteam.name,
                      "price":iteam.price,
                      "images":iteam.images,
                      "category":iteam.category,
                      "stock":iteam.stock,
                      "status":iteam.status,
                      "description":iteam.description
                  }
                  sobj.push(test)
              })
              const newProducts = await productModel.find({ status: true })
                                  .sort({ createdAt: -1 }) // Sort in descending order based on createdAt field
                                  .limit(3); // Limit the results to 3
          let newobj=[]
              let newmaps =newProducts.map((iteam)=>{
                  let test={
                      "_id":iteam._id,
                      "name":iteam.name,
                      "price":iteam.price,
                      "images":iteam.images,
                      "category":iteam.category,
                      "stock":iteam.stock,
                      "status":iteam.status,
                      "description":iteam.description
                  }
                  newobj.push(test)
              })
        const categories = await categoryModel.find({status:true})
          let arr=[]
          let map =categories.map((cat)=>{
            let val={
              name:cat.name
            }
            arr.push(val)
          })
          if(req.session.isAuth ===true){
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
            await res.render('./user/home',{dproducts:dobj,bproducts:bobj,sproducts:sobj,categories:arr,login:true,newproducts:newobj})
          }else{
            await res.render('./user/home',{dproducts:dobj,bproducts:bobj,sproducts:sobj,newproducts:newobj,categories:arr})
          }
          
    
}

//@desc Login page
//@router Get /login
//@acess public
const login = async(req,res)=>{
    await res.render('./user/login',{Single:true})
}


//@desc Register page
//@router Get /register
//@acess public
const register = async(req,res)=>{
    res.render('./user/register',{Single:true})
}


const verifyPage =async (req, res) => {
    try {
      req.session.user=req.session.user
      console.log(req.session.user);
        res.render("./user/otpVerification",{Single:true});
    } catch {
      res.status(200).send("error occured");
    }
  };


//generate otp
const generateotp = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
};



//send otp
const sendOTP = async (phoneNumber, otp) => {
    try {
        const message = await twilioClient.messages.create({
            body: `Your OTP for verification is: ${otp}`,
            from: '+1 912 228 4094',
            to: "+91 8590948623"
        });
        console.log("sended"+message.sid); // Log the message SID upon successful sending
    } catch (error) {
        console.error(error); // Handle error if message sending fails
        throw new Error("Failed to send OTP");
    }
};


const forgotOtp=async(req,res)=>{
  res.render('./user/forgotPassword',{Single:true})
}

const verifyNumber = async(req,res)=>{
  const number=req.body.phone
  const user = await userModel.findOne({ phone: number ,status:true });
  if (!user) {
    req.flash("error", "No user with this phone number");
    return res.redirect('/forgot')
  }else{
    const otp = generateotp();
          console.log(otp);
          const currentTimestamp = Date.now();
          const expiryTimestamp = currentTimestamp + 60 * 1000;
          const filter = { phone: number };
          const update = {
            $set: {
              phone: number,
              otp: otp,
              expiry: new Date(expiryTimestamp),
            },
          };
        
    
          const options = { upsert: true };
    
          await otpModel.updateOne(filter, update, options);
          await sendOTP(number, otp);
          req.session.forgot=true
          req.session.user=user
          res.redirect("/forgototpverify");
  }
}

const resendOtp=async(req,res)=>{
  console.log(req.session.user);
  const number =req.session.user.phone
  const otp = generateotp();
          console.log(otp);
          const currentTimestamp = Date.now();
          const expiryTimestamp = currentTimestamp + 60 * 1000;
          const filter = { phone: number };
          const update = {
            $set: {
              phone: number,
              otp: otp,
              expiry: new Date(expiryTimestamp),
            },
          };
        
    
          const options = { upsert: true };
    
          await otpModel.updateOne(filter, update, options);
          await sendOTP(number, otp);
          req.session.forgot=true
          res.redirect("/forgototpverify");
}

//@desc signup a user
//@router Post /register
//@access public
const registerUser = async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        const cpassword = req.body.confirm_password;
    
        const isusernameValid = nameValid(username);
        const isEmailValid = emailValid(email);
        const isPhoneValid = phoneValid(phone);
        const ispasswordValid = passwordValid(password);
        const iscpasswordValid = confirmpasswordValid(cpassword, password);

        const numberExist = await userModel.findOne({ phone: phone });
        const emailExist = await userModel.findOne({ email: email });

        if (!isusernameValid) {
          console.log("===========================1");
          req.flash("error", "Enter a valid Name");
          return res.redirect('/register')
        } else if (!isEmailValid) {
          console.log("===========================2");
          req.flash("error", "Enter a valid E-mail");
          return res.redirect('/register')
        } else if (!isPhoneValid) {
          console.log("===========================3");
          req.flash("error", "Enter a valid Phone Number");
          return res.redirect('/register')
        } else if (!ispasswordValid) {
          console.log("===========================4");
          req.flash("error", "Password should contain one (A, a, 2)");
          return res.redirect('/register')
        } else if (!iscpasswordValid) {
          console.log("===========================5");
          req.flash("error", "Password and Confirm password should match");
          return res.redirect('/register')
        } else if (numberExist) {
          console.log("===========================6");
          req.flash("error", "This number already have an account");
          return res.redirect('/register')
        } else if (emailExist) {
          console.log("===========================6");
          req.flash("error", "This email already have an account");
          return res.redirect('/register')
        } else {
          const hashedpassword = await bcrypt.hash(password, 10);
          const user = new userModel({
            username: username,
            email: email,
            phone: phone,
            password: hashedpassword,
            status:true
          });
           req.session.user = user;
           req.session.signup = true;
           req.session.forgot = false;
           console.log(req.session.user);

          const otp = generateotp();
          console.log(otp);
          const currentTimestamp = Date.now();
          const expiryTimestamp = currentTimestamp + 60 * 1000;
          const filter = { phone: phone };
          const update = {
            $set: {
              phone: phone,
              otp: otp,
              expiry: new Date(expiryTimestamp),
            },
          };
        
    
          const options = { upsert: true };
    
          await otpModel.updateOne(filter, update, options);
          await sendOTP(phone, otp);
          res.redirect("/verifyotp");
        } 
      }catch (err) {
        console.error("Error:", err);
        res.send("error");
      }
    
};



// otp verifying page 
const verifyotp = async (req, res) => {
    try {
      console.log("======================okkk1=============")
        const enteredotp = req.body.otp;
        const eotp=parseInt(enteredotp)
        const user = req.session.user;
        const phone = req.session.user.phone;
        const userdb = await otpModel.findOne({ phone: phone });
        const otp = userdb.otp;
        console.log(eotp,otp);
        const expiry = userdb.expiry;
        if(eotp!==otp){
          req.flash("error", "Incorrect OTP");
          return res.redirect('/verifyotp')
        }else if (enteredotp == otp ) {
          user.isVerified = true;

          try {
            if (req.session.signup) {
              console.log(req.session.signup);
              await userModel.create(user);
              req.session.signup = false;
              res.redirect("/");
            } else if (req.session.forgot) {
              console.log("======================okkk=============")
              console.log(req.session.forgot);
              res.redirect("/newpassword");
            }
          } catch (error) {
            console.error(error);
            res.status(500).send("Error occurred while saving user data");
          }
        } else {
          res.render("users/otp",{otperror:"Worng password/Time expired"});
        }
     
    } catch (error) {
      console.log(err);
      res.status(500).send("error occured");
    }
  };


  const newPassword=async(req,res)=>{
    res.render('./user/newPassword',{Single:true})
  }

  const setNewPassword = async(req,res)=>{
    const password = req.body.password;
    const cpassword = req.body.confirm_password;
    const ispasswordValid = passwordValid(password);
    const iscpasswordValid = confirmpasswordValid(cpassword, password);

    if (!ispasswordValid) {
      console.log("===========================4");
      req.flash("error", "Password should contain one (A, a, 2)");
      return res.redirect('/register')
    } else if (!iscpasswordValid) {
      console.log("===========================5");
      req.flash("error", "Password and Confirm password should match");
      return res.redirect('/register')
    }else{
      
      const hashedpassword = await bcrypt.hash(password, 10)
            const phone = req.session.user.phone;
            console.log(phone);
            await userModel.updateOne({phone:phone},{password:hashedpassword})
            req.session.newpasspressed=false
            res.redirect('/login')

    }
  }


//@desc login a user
//@router Post /login
//@access public
const loginUser = async (req, res) => {
  console.log("==========================1");
    const { email, password } = req.body;
    const user = await userModel.findOne({ email:email,status:true });
    try {
    if (!email || !password) {
        req.flash("error", "Enter Email & Password");
        return res.redirect('/login')
    }

   
        
        if (!user) {
            req.flash("error", "Invalid username or Password");
            return res.redirect('/login')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          req.flash("error", "Invalid username or Password");
          return res.redirect('/login')
        }

        
        const dproduct = await productModel.find({status:true,category:"Dining"}).limit(4)
        
          req.session.isAuth = true;
          req.session.user = user;
          res.redirect('/')
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};



const loginHome= async (req, res) => {
   try {
        
        const dproduct = await productModel.find({status:true,category:"Dining"}).limit(4)
        let dobj=[]
            let dmaps =dproduct.map((iteam)=>{
                let test={
                    "_id":iteam._id,
                    "name":iteam.name,
                    "price":iteam.price,
                    "images":iteam.images,
                    "category":iteam.category,
                    "stock":iteam.stock,
                    "status":iteam.status,
                    "description":iteam.description
                }
                dobj.push(test)
            })
            //console.log(cobj);
            const bproducts = await productModel.find({status:true,category:"Bedroom"}).limit(4)
            let bobj=[]
                let bmaps =bproducts.map((iteam)=>{
                    let test={
                        "_id":iteam._id,
                        "name":iteam.name,
                        "price":iteam.price,
                        "images":iteam.images,
                        "category":iteam.category,
                        "stock":iteam.stock,
                        "status":iteam.status,
                        "description":iteam.description
                    }
                    bobj.push(test)
                })
                const sproducts = await productModel.find({status:true,category:"Study Room"}).limit(4)
                let sobj=[]
                    let smaps =sproducts.map((iteam)=>{
                        let test={
                            "_id":iteam._id,
                            "name":iteam.name,
                            "price":iteam.price,
                            "images":iteam.images,
                            "category":iteam.category,
                            "stock":iteam.stock,
                            "status":iteam.status,
                            "description":iteam.description
                        }
                        sobj.push(test)
                    })
                
                    const newProducts = await productModel.find({ status: true })
                                  .sort({ _id: -1 }) // Sort in descending order based on createdAt field
                                  .limit(3); // Limit the results to 3
                    let newobj=[]
                        let newmaps =newProducts.map((iteam)=>{
                            let test={
                                "_id":iteam._id,
                                "name":iteam.name,
                                "price":iteam.price,
                                "images":iteam.images,
                                "category":iteam.category,
                                "stock":iteam.stock,
                                "status":iteam.status,
                                "description":iteam.description
                            }
                            newobj.push(test)
                        })
          console.log("==========================2");
          const categories = await categoryModel.find({status:true})
          let arr=[]
          let map =categories.map((cat)=>{
            let val={
              name:cat.name
            }
            arr.push(val)
          })
          req.session.isAuth = true;
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        await res.render('./user/home',{dproducts:dobj,bproducts:bobj,sproducts:sobj,categories:arr,login:true,newproducts:newobj})
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};



const shopProduct = async (req,res)=>{
  console.log("=============ok==============");
  const product = await productModel.find({status:true})
        let obj=[]
            let maps =product.map((iteam)=>{
                let test={
                    "_id":iteam._id,
                    "name":iteam.name,
                    "price":iteam.price,
                    "images":iteam.images,
                    "category":iteam.category,
                    "stock":iteam.stock,
                    "status":iteam.status,
                    "description":iteam.description
                }
                obj.push(test)
            })
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          console.log(req.session.user);
    await res.render('./user/shop',{products:obj,name:"Shop"})
}


const catProduct = async (req,res)=>{
  console.log("=============ok==============");
  let cat = req.params.cat
  
  console.log(cat);
  
  const product = await productModel.find({status:true,category:cat})
        let obj=[]
            let maps =product.map((iteam)=>{
                let test={
                    "_id":iteam._id,
                    "name":iteam.name,
                    "price":iteam.price,
                    "images":iteam.images,
                    "category":iteam.category,
                    "stock":iteam.stock,
                    "status":iteam.status,
                    "description":iteam.description
                }
                obj.push(test)
            })
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
    await res.render('./user/shop',{products:obj,name:cat})
}


const productPage =async (req,res)=>{
  const id = req.params.id;
  const user = req.session.user
  console.log(user);
  console.log("============okay==============");
  console.log(id);
  const products = await productModel.find({ _id: id})
   console.log(products);
        let obj=[]
            let maps =products.map((item)=>{
                let test={
                    "_id":item._id,
                    "name":item.name,
                    "price":item.price,
                    "category":item.category,
                    "images":item.images,
                    "stock":item.stock,
                    "status":item.status,
                    "description":item.description
                }
                obj.push(test)
            })
            console.log(obj);
  await res.render('./user/productPage',{products:obj})
}

const logOut = async (req, res) => {
  try {
    console.log("===========123========");
      req.session.isAuth = false;
      res.clearCookie('myCookie');
      req.session.destroy();
      res.redirect("/");
    
  } catch (error) {
    console.log("error");
    res.send("Error Occured");
  }
};
const addAddress = async (req,res)=>{
  console.log("========");
  await res.render('./user/addAddress',{name:"Add Address"})
}

module.exports = {registerUser,
  loginUser,home,login,
  register,verifyotp,verifyPage,
  shopProduct,productPage,logOut,
  catProduct,
  loginHome,forgotOtp,verifyNumber,
  newPassword,setNewPassword,
  resendOtp,addAddress}