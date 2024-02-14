const mongoose=require('mongoose')


const catschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:true

    },
    discount:{
        type:Number
    }
    
})

const categoryModel=new mongoose.model("categories",catschema)

module.exports=categoryModel