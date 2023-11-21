//const asyncHandler = require('express-async-handler')
//const { log } = require('handlebars/runtime');
const User = require('../model/userSchema')
const bcrypt = require('bcrypt')
//const errorHandler = require('../middlewares/errorhandlerMiddleware')

//@desc signup a user
//@router Post /signup
//@acess public
const signUpUser = async(req,res)=>{
    //console.log(req.body);
    const {name,email,phone,password} = req.body;
    //console.log(password);
    if (!name || !email || !phone ||!password ) {

        return res.status(400).json({message:"All fields are mandatory"});
        //throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        return res.status(400).json({message:"User Already Exists"});
        //res.status(400);
        //throw new Error("User Already Exists");
    }

    // Create hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = await User.create({
        name,
        email,
        phone,
        password:hashedPassword,
    })
    console.log(`User created ${user}`);

    if (user) {
        
        res.status(201).json({message:"User created succesfully",data:{ _id: user.id, email: user.email }});
    } else {
        
        //res.status(400);
        //throw new Error("User data is not valid");
    }
}

module.exports = {signUpUser}