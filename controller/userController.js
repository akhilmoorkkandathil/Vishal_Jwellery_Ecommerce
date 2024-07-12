
const userModel = require('../model/userSchema')
const productModel=require('../model/productSchema')
const categoryModel=require('../model/categorySchema')
const otpModel = require("../model/userOtpModel");
const bcrypt = require('bcrypt')
require("dotenv").config()
const session = require('express-session')
const twilioClient = require('../config/twilioService');
const {
    nameValid,
    emailValid,
    phoneValid,
    confirmpasswordValid,
    passwordValid,
    onlyNumbers,

  } = require("../utils/Validator");
const usersModel = require('../model/userSchema');
const cartModel = require('../model/cartSchema')
let objectId = require('mongodb').ObjectId;
const coupenModel=require('../model/coupenSchema')
const walletModel=require('../model/walletSchema')
const bannerModel =  require('../model/bannerModel')



//const errorHandler = require('../middlewares/errorhandlerMiddleware')




const createOrder = async (req,res,next) => {
  console.log('body:', req.body);
  var options = {
      amount: 500,
      currency: "INR",
      receipt: "order_rcpt"
  };
  instance.orders.create(options, function (err, order) {
      console.log("order1 :", order);
      res.send({ orderId: order.id})
    })
}

//@desc Home page
//@router Get /
//@acess public
const home = async(req,res ,next)=>{
  
    try {
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
        "offerPrice":iteam.offerPrice
      }
      newobj.push(test)
      })

      const categories = await categoryModel.find({status:true})
      //console.log(categories);
      let arr=[]
      let map =categories.map((cat)=>{
      let val={
      _id:cat._id,
      name:cat.name
      }
      arr.push(val)

      })
      const products = await productModel.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryDetails"
          }
        },
        {
          $unwind: "$categoryDetails"
        },
        {
          $group: {
            _id: "$category",
            categoryName: { $first: "$categoryDetails.name" },
            products: { $push: "$$ROOT" }
          }
        },
        {
          $project: {
            _id: 1,
            categoryName: 1,
            products: { $slice: ["$products", 4] }
          }
        },
        {
          $project: {
            category: "$_id",
            _id:1,
            categoryName: 1,
            products: {
              $map: {
                input: "$products",
                as: "product",
                in: {
                  _id: "$$product._id",
                  name: "$$product.name",
                  images: "$$product.images",
                  price: "$$product.price",
                  offerPrice:"$$product.offerPrice"
                }
              }
            }
          }
        }
      ]);
      //console.log(products);
      let obj = [];
      products.map((iteam)=>{
        let test={
          "_id":iteam._id,
          "category":iteam.categoryName,
          "products":iteam.products,
          
        }
        obj.push(test)
        })
        console.log(obj);

        const banners=await bannerModel.find({})
         let obj2=[]
         const maps = banners.map((x)=>{
           let y={
            _id:x._id,
            images:x.images
           }
           obj2.push(y)
         })
         //console.log(banners);
      if(req.session.isAuth || req.session.signup){
     
       res.render('./user/home',{login:req.session.user,newproducts:newobj,categories:arr,products:obj,image:obj2[0].images})
       req.session.signup=false;
      }else{
       res.render('./user/home',{newproducts:newobj,categories:arr,products:obj,image:obj2[0].images})
      }   
      
    } catch (error) {
     error.status = 500;
      next(error);
    } 
}



//@desc Login page
//@router Get /login
//@acess public
const login = async(req,res ,next)=>{
    try {
      await res.render('./user/login',{Single:true})
    } catch (error) {
     error.status = 500;
      next(error);
    }
}


//@desc Register page
//@router Get /register
//@acess public
const register = async(req,res ,next)=>{
    try {
      res.render('./user/register',{Single:true})
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
}


const optPage =async (req,res,next) => {
    try {
      
        res.render("./user/otpVerification",{Single:true});
    } catch {
     error.status = 500;
      next(error);
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
            from: '+16592448308',
            to: "+918590948623",
        });
        console.log("sended"+message.sid); // Log the message SID upon successful sending
    } catch (error) {
        console.error("==================="+error+"==================="); // Handle error if message sending fails
       error.status = 500;
      next(error);
    }
};


const phonePage=async(req,res ,next)=>{
  try {
    res.render('./user/phonePage',{Single:true})
  } catch (error) {
   error.status = 500;
      next(error);
  }
}

const verifyNumber = async(req,res ,next)=>{
  try {
    const number=req.body.phone
    req.session.phone=number
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
  } catch (error) {
    console.log(error);
   error.status = 500;
      next(error);;
  }
}

const resendOtp=async(req,res ,next)=>{

  try {
    const otp = generateotp();
          console.log(otp);
          const currentTimestamp = Date.now();
          const expiryTimestamp = currentTimestamp + 60 * 1000;
          const number = 8590948623;
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
          res.render("./user/otpVerification",{Single:true});
  } catch (error) {
   error.status = 500;
      next(error);
  }
}


function generateReferralCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let referralCode = '';
  for (let i = 0; i < length; i++) {
    referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return referralCode;
}

//@desc signup a user
//@router Post /register
//@access public
const registerUser = async (req,res,next) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        const cpassword = req.body.confirm_password;
        const refcode = req.body.referalcode;
        const user = await userModel.findOne({ referelCode: refcode });

        if (user) {
            console.log(user);

            // Find or create wallet for the referred user
            let wallet = await walletModel.findOne({ userId: user._id });

            if (!wallet) {
                // If wallet does not exist, create a new wallet
                wallet = new walletModel({
                    userId: user._id,
                    wallet: 200, // Initial wallet balance for referral offer
                    walletTransactions: [{
                        date: new Date(),
                        type: 'Referral Bonus',
                        amount: 200
                    }]
                });
            } else {
                // If wallet exists, update wallet balance and add transaction
                wallet.wallet += 200; // Add 200 rupees to wallet balance
                wallet.walletTransactions.push({
                    date: new Date(),
                    type: 'Referral Bonus',
                    amount: 200
                });
            }
            await wallet.save();
          }

            
    
        const isusernameValid = nameValid(username);
        const isEmailValid = emailValid(email);
        const isPhoneValid = phoneValid(phone);
        const ispasswordValid = passwordValid(password);
        const iscpasswordValid = confirmpasswordValid(cpassword, password);

        //const numberExist = await userModel.findOne({ phone: phone });
        const emailExist = await userModel.findOne({ email: email });
//put it as function
        if (!isusernameValid) {
          req.flash("error", "Enter a valid Name");
          return res.redirect('/register')
        } else if (!isEmailValid) {
          req.flash("error", "Enter a valid E-mail");
          return res.redirect('/register')
        } else if (!isPhoneValid) {
          req.flash("error", "Enter a valid Phone Number");
          return res.redirect('/register')
        } else if (!ispasswordValid) {
          req.flash("error", "Password should contain one (A, a, 2)");
          return res.redirect('/register')
        } else if (!iscpasswordValid) {
          req.flash("error", "Password and Confirm password should match");
          return res.redirect('/register')
        } 
        // else if (numberExist) {
        //   req.flash("error", "This number already have an account");
        //   return res.redirect('/register')
        // } 
        else if (emailExist) {
          req.flash("error", "This email already have an account");
          return res.redirect('/register')
        } else {
          const hashedpassword = await bcrypt.hash(password, 10);
          const referralCode = generateReferralCode();
          const user = new userModel({
            username: username,
            email: email,
            phone: phone,
            password: hashedpassword,
            status:true,
            referelCode: referralCode
          });
          console.log(user._id);
          await walletModel.create({ 
            userId: user._id,
            wallet:0,
            walletTransactions:[
                {
                    type: "Credited",
                    amount: 0,
                    date: new Date(),
                  }
            ]
         });
           req.session.user = user;
           req.session.signup = true;
           req.session.forgot = false;

          const otp = generateotp();
          console.log(otp);
          req.session.otp=otp;
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
      }catch (error) {
        console.error("Error:", error);
       error.status = 500;
      next(error);
      }
    
};



// otp verifying page 
const verifyotp = async (req,res,next) => {
    try {
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
              res.redirect("/");
            } else if (req.session.forgot) {
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
      console.log(error);
     error.status = 500;
      next(error);
    }
  };


  const newPassword=async(req,res ,next)=>{
    res.render('./user/newPassword',{Single:true})
  }

  const setNewPassword = async(req,res ,next)=>{
    try {
      const password = req.body.password;
    const cpassword = req.body.confirm_password;
    const ispasswordValid = passwordValid(password);
    const iscpasswordValid = confirmpasswordValid(cpassword, password);

    if (!ispasswordValid) {
      req.flash("error", "Password should contain one (A, a, 2)");
      return res.redirect('/register')
    } else if (!iscpasswordValid) {
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
    } catch (error) {
     error.status = 500;
      next(error);
    }
  }



//@desc login a user
//@router Post /login
//@access public
const loginUser = async (req, res , next) => {
  try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email: email, status: true });

      if (!email || !password) {
          req.flash("error", "Enter Email & Password");
          return res.redirect('/login')
      }

      if (!user) {
          req.flash("error", "User with this email not exist");
          return res.redirect('/login')
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          req.flash("error", "Invalid username or Password");
          return res.redirect('/login')
      }

      req.session.isAuth = true;
      req.session.user = user;
      req.session.userId = user._id;  // Corrected from users._id
      res.redirect('/');
  } catch (error) {
      console.error(error);
      error.status = 500;
      next(error);
  }
};



const loginHome= async (req,res,next) => {
   try {
        
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
          req.session.isAuth = true;
        
        await res.render('./user/home',{login:req.session.user,newproducts:newobj})
    } catch (error) {
     error.status = 500;
      next(error);
    }
};


const shopProduct = async (req,res ,next)=>{
  try {
    let limit =8;
   let page = req.query.page-1 || 0;
   let skip = page*limit;

   // Sorting options
   let sortOption = {};
   if (req.query.sort) {
     const sortOrder = req.query.sort === 'des' ? -1 : 1;
     sortOption = { price: sortOrder };
   }

   

   let searchQuery = {};
    if (req.query.search) {
      searchQuery = {
        $or: [
          { name: { $regex: new RegExp(req.query.search, 'i') } },
          { description: { $regex: new RegExp(req.query.search, 'i') } },
        ],
      };
    }
    // Filtering options
   let filterOption = {};
   if (req.query.category) {
     filterOption = { category: req.query.category };
   }
    const product = await productModel
    .find({ status: true, ...filterOption, ...searchQuery })
    .skip(skip)
    .limit(limit)
    .sort(sortOption) // Apply sorting here
   
        let obj=[]
            let maps =product.map((iteam)=>{
                let test={
                  "_id":iteam._id,
                    "name":iteam.name,
                    "price":iteam.price,
                    "images":iteam.images,
                    "offerPrice":iteam.offerPrice
                }
                obj.push(test)
            })
            const data = await productModel.find({status:true, ...filterOption, ...searchQuery })
            const length = data.length
            
          const category = await categoryModel.find()
          let arr=[]
          let map = category.map((item)=>{
            let test = {
              "_id":item._id,
              "name":item.name
            }
            arr.push(test);
          })      
    let i=1
    let pages=[]
    while(i<=(Math.ceil(length/limit))){
      pages.push(i)
      i++
    }
    page>1?prev=page-1:prev=1
    page<Math.ceil(length/limit)?next=page+2:next=Math.ceil(length/limit)
          
    await res.render('./user/shop',{products:obj,name:"Shop",login:req.session.user,pages,category:arr,prev,next})
  } catch (error) {
   error.status = 500;
      next(error);
    console.log(error);
  }
}


const catProduct = async (req,res ,next)=>{
  try {
    let cat = req.params.cat;
  const product = await productModel.find({status:true,category:cat})
        let obj=[]
            let maps =product.map((iteam)=>{
                let test={
                  "_id":iteam._id,
                    "name":iteam.name,
                    "price":iteam.price,
                    "images":iteam.images,
                    
                }
                obj.push(test)
            })
        
    await res.render('./user/shop',{products:obj,name:cat})
  } catch (error) {
    console.log(error);
   error.status = 500;
      next(error);
  }
}


const productPage =async (req,res ,next)=>{
  try {
    const id = req.query.proId || req.session.proId;
    req.session.proId=id;
  const products = await productModel.find({ _id: id})
   //console.log(products);
        let obj=[]
            let maps =products.map((item)=>{
                let test={
                    "_id":item._id,
                    "name":item.name,
                    "price":item.price,
                    "category":item.category,
                    "images":item.images.slice(0, 6),
                    "stock":item.stock,
                    "status":item.status,
                    "description":item.description,
                    "offerPrice":item.offerPrice,
                }
                obj.push(test)
            })
            //console.log(obj);
            const availableCoupons = await coupenModel.find().lean();
            console.log(availableCoupons);
    await res.render('./user/productPage',{products:obj,availableCoupons:availableCoupons,login:req.session.user})
  } catch (error) {
    console.log(error);
   error.status = 500;
      next(error);
  }
}

const logOut = async (req,res,next) => {
  try {
      req.session.isAuth = false;
      res.clearCookie('myCookie');
      req.session.destroy();
      res.redirect("/");
    
  } catch (error) {
    console.log("error");
   error.status = 500;
      next(error);
  }
};
const errorPage = async (req,res ,next) => {
  await res.render('./user/errorPage',{Single:true})
}
const addAddress = async (req,res ,next)=>{
  await res.render('./user/addAddress',{name:"Add Address"})
}

const myAddress =async(req,res ,next)=>{
  const user = req.session.user;
  let login = req.session.isAuth;
  await res.render('./user/myAddress',{user,login})
}

const toAddAddress =async (req,res ,next)=>{
  try {
    const { fname,lname,phone,pincode,locality,address,city,state,landmark,altphone,country} = req.body;
    const fnameValid = nameValid(fname);
        const pinValid = onlyNumbers(pincode);
        const isPhoneValid = phoneValid(phone);
        const isaltPhoneValid = phoneValid(altphone);
        
        const isLocalityValid = nameValid(locality)
        const islandmarkValid = nameValid(country)
        if (!fnameValid) {
          req.flash("error", "Enter a valid First Name");
          return res.redirect('/addAddress')
        } else if (!pinValid) {
          req.flash("error", "Enter a valid Pincode");
          return res.redirect('/addAddress')
        } else if (!isLocalityValid) {
          req.flash("error", "Enter a valid Locality");
          return res.redirect('/addAddress')
        }else if (!isPhoneValid) {
          req.flash("error", "Enter a valid Phone Nummber");
          return res.redirect('/addAddress')
        } else if (!isaltPhoneValid) {
          req.flash("error", "Enter valid alternative Phone Nummber");
          return res.redirect('/addAddress')
        } else if (!islandmarkValid) {
          req.flash("error", "Enter valid Landmark");
          return res.redirect('/addAddress')
        }
    const userId = req.session.userId;
    console.log(userId);
    const user = await userModel.findById(userId);
    console.log(user);
    if (user) {
      user.address.push({
        fname: fname,
        lname: lname,
        address: address,
        locality: locality,
        pincode: pincode,
        city: city,
        state: state,
        country: country,
        phone: phone,
        altphone: altphone,
        landmark: landmark,
      });

      // Save the updated user document
      await user.save();
    }
    req.session.user=user;
    if(req.session.checkout){
      req.session.isAuth=true
      await res.redirect('/checkout')
      req.session.checkout=false;
    }else{
      req.session.isAuth=true
      await res.redirect('/address')

    }
  } catch (error) {
    console.log("Some errors");
    error.status = 500;
      next(error);
  }
}


const editPage = async (req,res,next) => {
  try {
    let index = req.params.index; // Assuming 'index' is the parameter name you want to capture
    const user = req.session.user;
    console.log(user);
    console.log(user.address[index])
    req.session.isAuth=true
     res.render('./user/updateAddress', { login: true, address:user.address[index],index}); // Pass 'index' to the render function if needed
  } catch (error) {
    console.log("Error:", error);
   error.status = 500;
      next(error);
    // Handle errors accordingly
  }
};

const updateAddress = async (req,res,next) => {

  try {
    console.log("==============");
    const index =req.params.index;
    const {
      fname,
      lname,
      phone,
      pincode,
      locality,
      address,
      city,
      state,
      landmark,
      altphone,
      country
    } = req.body;
    
    const userId = req.session.userId;
    console.log(userId);
    const update = await userModel.updateOne(
      { _id: userId },
      {
        $set: {
          [`address.${index}.fname`]: fname,
          [`address.${index}.lname`]: lname,
          [`address.${index}.pincode`]: pincode,
          [`address.${index}.locality`]: locality,
          [`address.${index}.address`]: address,
          [`address.${index}.altphone`]: altphone,
          [`address.${index}.city`]: city,
          [`address.${index}.state`]: state,
          [`address.${index}.country`]: country,
          [`address.${index}.phone`]: phone,
          [`address.${index}.landmark`]: landmark
        }
      }
    );
        
    console.log(update);
    const user = await userModel.findById(userId);
    req.session.user=user;
    req.session.isAuth=true;
    await res.redirect('/address');
  } catch (error) {
    console.error('Error updating address:', error);
   error.status = 500;
      next(error);
  }
};

const editUserDetails =async(req,res ,next)=>{
  try {
    const address=req.session.user;
    req.session.isAuth=true
    res.render('./user/editUserDetails',{address});
    
  } catch (error) {
   error.status = 500;
      next(error);
  }
}

const updateUserAddress = async(req,res ,next)=>{
  try {
    const {fname,lname,email}=req.body;
    const userId = req.session.userId;
    const username = fname + " " + lname;

    await usersModel.updateOne(
      { _id: userId },
      {
        $set: {
          username: username,
          email: email,
        }
      }
    );
    const user = await userModel.findById(userId);
    req.session.user=user;
    await res.redirect('/address');
  } catch (error) {
   error.status = 500;
      next(error);
  }
}

const deleteAddress = async (req,res,next) => {
  try {
    let userId = req.session.userId;
    let index = req.params.index;

    let user = req.session.user;
    user.address.splice(index, 1);
    req.session.user = user;

    let updatedUser = await userModel.findByIdAndUpdate(userId, { address: user.address }, { new: true });

    console.log('User updated successfully:', updatedUser);
    res.redirect('/address');
  } catch (error) {
    console.error('Error occurred while updating user:', error);
    // Handle error
   error.status = 500;
      next(error);
  }
};


const searchProducts = async (req,res,next) => {
  try {
    const searchQuery = req.body.searchProducts;

    // Search for products by name or description
    const productData = await productModel.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${searchQuery}`, "i") } },
        { description: { $regex: new RegExp(`^${searchQuery}`, "i") } },
      ],
    });

    if (productData) {
      return res.redirect(`/${productData._id}`);
    }

    // Search for categories by name
    const categoryData = await cartModel.findOne({
      name: { $regex: new RegExp(`^${searchQuery}`, "i") },
    });

    if (categoryData) {
      return res.redirect(`/shop?category=${categoryData._id}`);
    }

    // If neither product nor category found, redirect to home
    res.redirect("/");
  } catch (error) {
    console.error(error);
   error.status = 500;
      next(error);;
  }
};


const checkoutPage = async (req,res,next) => {
  try {
    const user = req.session.user;
    const userId = user._id;
    console.log(req.body);
    const quantity = req.body.quantity || 1;

    const cartItems = await cartModel.findOne({ userId: userId }).populate({
      path: 'item.productId',
      select: '_id name price offerPrice stock',
  }).lean();

  console.log(cartItems);
  const availableCoupons = await coupenModel.find().lean();
  console.log(availableCoupons);

req.session.checkout=true;
  
    await res.render('./user/checkout',{user:user,cartItems:cartItems,login:req.session.user,availableCoupons:availableCoupons});
  } catch (error) {
    // Handle errors
    console.error(error);
   error.status = 500;
      next(error);
  }
};

const newDeliveryAddrres = async (req,res ,next) =>{
  try {
    const index = req.params.index;
    const user = req.session.user;
    console.log(user);
    console.log(index);
    let deliveryAddress = user.address.splice(index,1)
    user.address.unshift(deliveryAddress[0])
    req.session.user=user;
    res.redirect('/checkout')
  } catch (error) {
   error.status = 500;
      next(error);
  }
}





module.exports = {registerUser,
  loginUser,home,login,
  register,verifyotp,optPage,
  shopProduct,productPage,logOut,
  catProduct,
  loginHome,phonePage,verifyNumber,
  newPassword,setNewPassword,
  resendOtp,addAddress,searchProducts,
  myAddress,toAddAddress,editPage,
  updateAddress,editUserDetails,
  updateUserAddress,deleteAddress,
  checkoutPage,errorPage,newDeliveryAddrres,createOrder}