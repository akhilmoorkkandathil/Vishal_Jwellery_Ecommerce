const fs=require('fs')
const path=require('path')
const productModel = require('../model/productSchema')
const categoryModel=require('../model/categorySchema')
const sharp = require('sharp')

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET
});


const addProduct = async(req,res)=>{
  try {
    // Assuming productModel.find() returns an array of objects
    const categories = await categoryModel.find({status:true})
     console.log(categories);
    let obj=[]
    let maps =categories.map((item)=>{
        let test={
            "_id":item._id,
            "name":item.name,
        }
        obj.push(test)
    })
    req.session.isadAuth = true;
    await res.render('./admin/addProduct',{obj,Admin:true,category:obj})
} catch (err) {
    console.log(err);
    res.send("Error Occurred");
}
    
}


const productAdded = async (req, res) => {
  try {
    const files = req.files;
    const uploadedImages = [];
    for (const file of files) {
      const resizedImageBuffer = await sharp(file.path)
          .resize({ width: 300, height: 300 }) // Set your desired dimensions
          .toFile(file.path+"a")
      const result = await cloudinary.uploader.upload(file.path+"a");
      uploadedImages.push(result.url); // Store the secure URL of the uploaded image
    }
    const { product, category, price, stock, description } = req.body;
    
    const newProduct = new productModel({
      name: product,
      category: category,
      price: price,
      stock: stock,
      description: description,
      images:uploadedImages
    });

    await newProduct.save();
    req.session.uploadedImages = uploadedImages;
    req.session.isadAuth = true;
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    res.redirect('/admin/error')
  }  
};


const productList = async (req, res) => {
    try {
      const products = await productModel.aggregate([
        {
          $lookup: {
            from: "categories", // The name of the collection to perform the lookup
            localField: "category", // The field from the input documents (products collection)
            foreignField: "_id", // The field from the documents of the "categories" collection
            as: "categoryDetails" // The alias for the output field
          }
        },
        {
          $unwind: "$categoryDetails" // Unwind the array created by $lookup (assuming each product has exactly one category)
        },
        {
          $project: {
            "_id": 1,
            "name": 1,
            "price": 1,
            "images": 1,
            "stock": 1,
            "status": 1,
            "description": 1,
            "categoryName": "$categoryDetails.name", // Include the category name in the output
           
          }
        }
      ])
       
       console.log(products);
        await res.render("./admin/productList", { obj:products, Admin: true });
    } catch (err) {
        console.log(err);
        res.redirect('/admin/error')
    }
};

const unlistProduct = async (req, res) => {
    try {
      const id = req.params.id;
      const product = await productModel.findById(id);
  
      if (!product) {
        return res.status(404).send("Product not found");
      }
    
      product.status = !product.status;
      await product.save();
      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };
  
  // product deleting
  const deleteProduct = async (req, res) => {
    try {
      const id = req.params.id;
      await productModel.deleteOne({ _id: id });
      res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
      res.redirect('/admin/error')
    }
  };

  const editProduct = async (req, res) => {
    try {
      const id = req.query.id || req.session.proId;
      req.session.proId=id
      const product = await productModel.findById(id);
      const pr=[product]
      req.session.prodId = id
      req.session.uploadedImages=product.images;
      console.log(req.session.uploadedImages);
      let arr=[]
        let maps =pr.map((item)=>{
            let test={
                "_id":item._id,
                "name":item.name,
                "price":item.price,
                "category":item.category,
                "images":item.images,
                "stock":item.stock,
                "status":item.status,
                "description":item.description
            }
            arr.push(test)
        })
        const categories = await categoryModel.find({})
    let obj=[]
    let map =categories.map((item)=>{
        let test={
            "_id":item._id,
            "name":item.name,
        }
        obj.push(test)
    })
    const uploadedImages=req.session.uploadedImages
      
     
      res.render("./admin/updateProduct", { product:arr[0],category:obj,uploadedImages, Admin: true });
    } catch (error) {
      console.log(error);
      res.redirect('/admin/error')
    }
  };


  const deleteProductImage = async (req, res) => {
    try {
      
    const index = req.query.index;
    const proId = req.session.prodId;
    const product = await productModel.find(
      { _id: proId })
      product[0].images.splice(index,1)
      await product[0].save();


      req.session.isadAuth = true;
    res.redirect('/admin/editproduct')
      
    } catch (error) {
      console.error(error);
      res.redirect('/admin/error')
    }
  };


const updatePdt = (proId,productDetails,uploadedImages)=>{
  
  return new Promise((resolve,reject)=>{
    productModel.updateOne({_id:proId},{
      $set: {
        name:productDetails.name,
        price:productDetails.price,
        stock:productDetails.stock,
        images:uploadedImages,
        category:productDetails.category,
        description:productDetails.description
      }
    }).then((response)=>{
      resolve()
    })
  })
}


  // updating the  product
const updateProduct = async (req, res) => {
  try {
    const uploadedImages = [];
    if(req.files){
      
    for (const file of req.files) {
      
      const result = await cloudinary.uploader.upload(file.path);
      uploadedImages.push(result.url); // Store the secure URL of the uploaded image
    }
    }
    
    const id = req.params.id;
    const img=req.session.uploadedImages.concat(uploadedImages)
    updatePdt(id,req.body,img).then(()=>{
      const product = productModel.findById(id);
      req.session.uploadedImages = uploadedImages;
      req.session.isadAuth = true;
      res.redirect("/admin/products");
    })
    
  } catch (error) {
    console.log(error);
    res.redirect('/admin/error')
  }
};

const categories = async (req,res)=>{
    await res.render('./admin/categoryList',{Admin:true})
}
const addCategory = async (req,res)=>{
    await res.render('./admin/addCategory',{Admin:true})
}

// admin new category adding 
const addedCategory = async (req, res) => {
  try {
    console.log("=================1");
      const catName = req.body.catname;
      let upperCatName=catName.toUpperCase()
      console.log(upperCatName);
      const catdes = req.body.catdes;

      const categoryExist = await categoryModel.findOne({ name:upperCatName });
      if(categoryExist){
        console.log("=================2");
        req.flash("error", "This category already exist");
        req.session.isadAuth = true;
        return res.redirect('/admin/addcategory')
      }else{
        console.log("=================3");
        await categoryModel.insertMany({ 
          name: upperCatName, 
          description: catdes,
          status:true 
        });
        res.redirect("/admin/categorylist");
      }
   
  } catch (error) {
    console.log(error);
    res.redirect('/admin/error')
  }
};

const catList = async (req,res)=>{
  try {

      const categories = await categoryModel.find()
      let obj=[]
      let maps =categories.map((item)=>{
          let test={
              "_id":item._id,
              "name":item.name,
              "description":item.description,
              "status":item.status
          }
          obj.push(test)
      })
      console.log(obj);
      
      await res.render('./admin/categoryList',{obj,Admin:true})
  } catch (err) {
      console.log(err);
      res.redirect('/admin/error')
  }
  
}



// product unlisting 
const unlistCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const Category = await categoryModel.findById(id);

    if (!Category) {
      return res.status(404).send("Category not found");
    }

    console.log(Category);

    Category.status = !Category.status;
    await Category.save();
    req.session.isadAuth = true;
    res.redirect("/admin/categorylist");
  } catch (error) {
    console.error(error);
    res.redirect('/admin/error')
  }
};

// category deleting
const deletingCategory = async (req, res) => {
  try {
      console.log("okay");
    const id = req.params.id;
    req.session.isadAuth = true;
    await categoryModel.deleteOne({ _id: id });
    res.redirect("/admin/categorylist");
    console.log("okay deleted");
  } catch (error) {
    console.log(error);
    res.redirect('/admin/error')
  }
};


// admin category update page
const updatecat = async (req, res) => {
  try {
      const id = req.params.id;
      const cat = await categoryModel.findOne({ _id: id });
      const category=[cat]
      let obj=[]
      let maps =category.map((item)=>{
          let test={
              "_id":item._id,
              "name":item.name,
              "description":item.description,
              "status":item.status
          }
          obj.push(test)
      })
      console.log(obj);
      res.render("./admin/editCategory", { Admin: true,category:obj[0] });
    
  } catch (error) {
    console.log(error);
    res.redirect('/admin/error')
  }
};



// admin category updating
const updateCategory = async (req, res) => {
  try {
      const id = req.params.id;
      const catName = req.body.catname;
      let catNameUpper =catName.toUpperCase()
      const catdes = req.body.catdes;
      const categoryExist = await categoryModel.findOne({ name:catNameUpper });
      if(categoryExist){
        req.flash("error", "This category already exist");
        return res.redirect('/admin/editcategory/'+id)
      }
      await categoryModel.updateOne(
        { _id: id },
        { name: catNameUpper, description: catdes }
      );
      req.session.isadAuth = true;
      res.redirect("/admin/categorylist");
    
  } catch (error) {
    console.log(error);
    res.redirect('/admin/error')
  }
};


module.exports ={addProduct,productList,categories,addCategory,productAdded,unlistProduct,deleteProduct,editProduct,addedCategory,catList,unlistCategory,deletingCategory,updatecat,updateCategory,updateProduct,deleteProductImage}