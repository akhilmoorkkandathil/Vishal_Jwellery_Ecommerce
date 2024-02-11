const mongoose = require('mongoose')




const bannerSchema = new mongoose.Schema({


    images:{
        type: String,
        required: true
    }
})

const bannerModel=new mongoose.model("banners",bannerSchema)

module.exports=bannerModel