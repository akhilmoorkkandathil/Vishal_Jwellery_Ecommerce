const bannerModel =  require('../model/bannerModel')
const sharp = require('sharp')

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDINARYSECRET
  });
  

module.exports = {
    addBannerPage: (req,res ,next)=>{
        try {
            res.render('./admin/addBanner',{Admin:true})
        } catch (error) {
            error.status = 500;
      next(error);
        }
    },
    addBanner: async(req, res ,next)=>{
        try {
            const files = req.files;
            console.log(files)
            const uploadedImages = [];
            for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path);
            uploadedImages.push(result.url);
            }

            const newBanner = new bannerModel({
                images: uploadedImages[0],
            });
  
      await newBanner.save();
      res.redirect('/admin/bannerList')

        } catch (error) {
            error.status = 500;
            next(error);
        }
    },
    bannerList: async(req,res)=>{
        try {
         const banners=await bannerModel.find({})
         let obj=[]
         const map = banners.map((x)=>{
           let y={
            _id:x._id,
            images:x.images
           }
           obj.push(y)
         })
        console.log(banners);
         res.render("./admin/bannerList",{banners:obj,Admin:true})
        } catch (error) {
            error.status = 500;
            next(error);
        }
    },
    deleteBanner: async(req,res)=>{
        try {
            const id = req.params.id;
            await bannerModel.deleteOne({ _id: id });
            res.redirect("/admin/bannerList");

        } catch (error) {
            error.status = 500;
            next(error);
        }
    }
}