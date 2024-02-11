const bannerModel =  require('../model/bannerModel')

module.exports = {
    addBannerPage: (req,res)=>{
        try {
            res.render('./user/addBanner')
        } catch (error) {
            res.redirect('/admin/error')
        }
    },
    addBanner: async(req,res)=>{
        const files = req.files;
    const uploadedImages = [];
    for (const file of files) {
      const resizedImageBuffer = await sharp(file.path)
          .resize({ width: 300, height: 300 }) // Set your desired dimensions
          .toFile(file.path+"a")
      const result = await cloudinary.uploader.upload(file.path+"a");
      uploadedImages.push(result.url); // Store the secure URL of the uploaded image
    }
    }
}