const express = require('express')
const router = express.router();
const cloudinary = require('../utils/cloudinaryConfig');
const upload = require("../config/multerSetup")

router.post('/upload',upload.single('image'),function(req,res){
    cloudinary.uploader.upload(req.file.path,function(err,result){
        if(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:"Error"
            })
        }
        res.status(200).json({
            secces:true,
            message:"Uploaded",
            data:result
        })
    })
})
module.exports = router