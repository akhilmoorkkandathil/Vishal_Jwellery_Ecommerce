const mongoose = require('mongoose')
require('dotenv').config();

const connectDb = async ()=>{
    try{
    const mongoUri =`mongodb+srv://akhildasxyz:${process.env.MONGO_PASSWORD}@akhil.bmpur2y.mongodb.net/EcommerceDb?retryWrites=true&w=majority&appName=akhil`;
        await mongoose.connect(mongoUri)
        console.log("Database connected");

    } catch(err){
        console.log(err);
        process.exit(1)
    }
};

module.exports = connectDb;