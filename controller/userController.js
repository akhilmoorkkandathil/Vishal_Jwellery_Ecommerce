
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

    await res.render('./user/home',{products:obj})
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
            to: "+91 8590948623"
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
    
        const emailExist = await userModel.findOne({ email: email });
        if (emailExist) {
          res.render("./users/register", { emailerror: "E-mail already exits" });
        } else if (!isusernameValid) {
          res.render("./users/register", { nameerror: "Enter a valid Name" });
        } else if (!isEmailValid) {
          res.render("./users/register", { emailerror: "Enter a valid E-mail" });
        } else if (!isPhoneValid) {
          res.render("./users/register", { phoneerror: "Enter a valid Phone Number" });
        } else if (!ispasswordValid) {
          res.render("./users/register", {
            passworderror: "Password should contain one(A,a,2)",
          });
        } else if (!iscpasswordValid) {
          res.render("./users/register", {
            cpassworderror: "Password and Confirm password should be match",
          });
        } else {
          const hashedpassword = await bcrypt.hash(password, 10);
          const user = new userModel({
            username: username,
            email: email,
            phone: phone,
            password: hashedpassword,
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
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("password");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Log in the user (for example, set a session or generate a token)
        // For demonstration, setting a session variable "loggedInUser"
        req.session.user = user;

        let products = [{
            "name":"chair",
            "category":"Dining",
            "description":"Good chair for sittiing in ding hall and sitout",
            "price":"4500",
            "image":"https://themewagon.github.io/furni/images/post-1.jpg"
          },{
            "name":"Sofa",
            "category":"Dining",
            "description":"Good chair for sittiing in ding hall and sitout",
            "price":"4500",
            "image":"https://themewagon.github.io/furni/images/post-2.jpg"
          },{
            "name":"Interior",
            "category":"Bedroom",
            "description":"Good chair for sittiing in ding hall and sitout",
            "price":"4500",
            "image":"https://themewagon.github.io/furni/images/post-3.jpg"
          }]

        res.render('./user/home', { message: 'Login successful', userData: { _id: user.id, email: user.email },products});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {registerUser,loginUser,home,login,register,verifyotp,verifyPage}