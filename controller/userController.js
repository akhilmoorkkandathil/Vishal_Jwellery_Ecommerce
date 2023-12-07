
const userModel = require('../model/userSchema')
const productModel=require('../model/productSchema')
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
    const products = await productModel.find()
    let obj=[]
        let maps =products.map((iteam)=>{
            let test={
                "_id":iteam._id,
                "name":iteam.name,
                "price":iteam.price,
                "category":iteam.category,
                "stock":iteam.stock,
                "status":iteam.status,
                "description":iteam.description
            }
            obj.push(test)
        })

    await res.render('./user/home')
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
            to: "+91 "+phoneNumber
        });
        console.log("sended"+message.sid); // Log the message SID upon successful sending
    } catch (error) {
        console.error(error); // Handle error if message sending fails
        throw new Error("Failed to send OTP");
    }
};

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
          const filter = { email: email };
          const update = {
            $set: {
              email: email,
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
        const enteredotp = req.body.otp;
        const user = req.session.user;
        const email = req.session.user.email;
        const userdb = await otpModel.findOne({ email: email });
        const otp = userdb.otp;
        const expiry = userdb.expiry;
        console.log(otp);
        console.log(expiry.getTime(),Date.now());
        if (enteredotp == otp ) {
          user.isVerified = true;

          try {
            if (req.session.signup) {

              await userModel.create(user);
              req.session.signup = false;
              res.redirect("/");
            } else if (req.session.forgot) {
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

//@desc login a user
//@router Post /login
//@access public
const loginUser = async (req, res) => {
  console.log("==========================1");
    const { email, password } = req.body;
    if (!email || !password) {
        req.flash("error", "Enter Email & Password");
        return res.redirect('/login')
    }

    try {
        const user = await userModel.findOne({ email:email,status:true });
        if (!user) {
            req.flash("error", "Invalid username or Password");
            return res.redirect('/login')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          req.flash("error", "Invalid username or Password");
          return res.redirect('/login')
        }

        req.session.user = user;
        const products = await productModel.find({status:true})
        let obj=[]
            let maps =products.map((iteam)=>{
                let test={
                    "_id":iteam._id,
                    "name":iteam.name,
                    "price":iteam.price,
                    "category":iteam.category,
                    "stock":iteam.stock,
                    "status":iteam.status,
                    "description":iteam.description
                }
                obj.push(test)
            })
            console.log("==========================2");
        await res.render('./user/home',{products:obj})
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {registerUser,loginUser,home,login,register,verifyotp,verifyPage}