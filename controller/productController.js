const fs=require('fs')
const path=require('path')
const productModel = require('../model/productSchema')
const categoryModel=require('../model/categorySchema')

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET
});


const addProduct = async(req,res ,next)=>{
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
} catch (error) {
    console.log(error);
    error.status = 500;
      next(error);
}
    
}


const productAdded = async (req,res,next) => {
  try {
    const files = req.files;
    const uploadedImages = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path+"a");
      uploadedImages.push(result.url); // Store the secure URL of the uploaded image
    }
    const { product, category, price, stock, description, offerPrice ,discount} = req.body;
    const categoryDoc = await categoryModel.findById(category);
    console.log(categoryDoc);

    let finalOfferPrice=0;
    if(offerPrice){
       finalOfferPrice = offerPrice; // Initialize finalOfferPrice with the provided offerPrice
    }else if (categoryDoc && categoryDoc.discount) {
      finalOfferPrice = price - (price * categoryDoc.discount / 100);
    }
    
    const newProduct = new productModel({
      name: product,
      category: category,
      price: price,
      stock: stock,
      description: description,
      images:uploadedImages,
      offerPrice:finalOfferPrice,
      discount:discount
    });

    await newProduct.save();
    req.session.uploadedImages = uploadedImages;
    req.session.isadAuth = true;
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
    error.status = 500;
      next(error);
  }  
};


const productList = async (req,res,next) => {
    try {
      let page=req.query.page-1 || 0
      let limit=7;
      let skip=page*limit;
      console.log("============================");
      const product = await productModel.find()
      console.log(product);
      const products = await productModel.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryDetails"
            }
        },
        {
            $unwind: "$categoryDetails"
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
                "categoryName": "$categoryDetails.name",
                "offerPrice":1
            }
        },
        {
            $sort: { "_id": -1 } // Sort by _id field in descending order
        },
        {
            $skip: skip // Your skip value here
        },
        {
            $limit: limit // Your limit value here
        }
    ]);
    
       
       console.log(products);
       const data = await productModel.find()
       const length = data.length;
      
    let i=1
    let pages=[]
    while(i<=(Math.ceil(length/limit))){
      pages.push(i)
      i++
    }
    page>1?prev=page-1:prev=1
    page<Math.ceil(length/limit)?next=page+2:next=Math.ceil(length/limit)
        await res.render("./admin/productList", { obj:products, Admin: true,pages:pages,prev,next });
    } catch (error) {
        console.log(error);
        error.status = 500;
      next(error);
    }
};

const unlistProduct = async (req,res,next) => {
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
      error.status = 500;
      next(error);
    }
  };
  
  // product deleting
  const deleteProduct = async (req,res,next) => {
    try {
      const id = req.params.id;
      await productModel.deleteOne({ _id: id });
      res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
      error.status = 500;
      next(error);
    }
  };

  const editProduct = async (req,res,next) => {
    try {
      const id = req.query.id || req.session.proId;
      req.session.proId=id
      const product = await productModel.findById(id);
      console.log(product+"=============");
      const pr=[product]
      req.session.prodId = id
      req.session.uploadedImages=product.images;
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
                "description":item.description,
                "offerPrice":item.offerPrice,
                "discount":item.discount
            }
            arr.push(test)
        })
        console.log(arr);
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
      
     
      res.render("./admin/updateProduct", { product:arr[0],category:obj,uploadedImages, Admin: true,pages:[1,2,3,4,5] });
    } catch (error) {
      console.log(error);
      error.status = 500;
      next(error);
    }
  };


  const deleteProductImage = async (req,res,next) => {
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
      error.status = 500;
      next(error);
    }
  };


const updatePdt = (proId,productDetails,uploadedImages)=>{
  console.log(productDetails);
  return new Promise((resolve,reject)=>{
    productModel.updateOne({_id:proId},{
      $set: {
        name:productDetails.name,
        price:productDetails.price,
        stock:productDetails.stock,
        images:uploadedImages,
        category:productDetails.category,
        description:productDetails.description,
        discount:productDetails.discount,
        offerPrice:productDetails.offerPrice

      }
    }).then((response)=>{
      resolve()
    })
  })
}


  // updating the  product
const updateProduct = async (req,res,next) => {
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
      console.log(product);
      req.session.uploadedImages = uploadedImages;
      req.session.isadAuth = true;
      res.redirect("/admin/products");
    })
    
  } catch (error) {
    console.log(error);
    error.status = 500;
      next(error);
  }
};


const addCategory = async (req,res ,next)=>{
    await res.render('./admin/addCategory',{Admin:true})
}

// admin new category adding 
const addedCategory = async (req,res,next) => {
  try {
    const {catName,catDescription,catDiscount}=req.body;
      let upperCatName=catName.toUpperCase()

      const categoryExist = await categoryModel.findOne({ name:upperCatName });
      if(categoryExist){
        req.flash("error", "This category already exist");
        req.session.isadAuth = true;
        return res.redirect('/admin/addcategory')
      }else{
        await categoryModel.insertMany({ 
          name: upperCatName, 
          description: catDescription,
          discount:catDiscount,
          status:true 
        });
        res.redirect("/admin/categorylist");
      }
   
  } catch (error) {
    console.log(error);
    error.status = 500;
      next(error);
  }
};

const catList = async (req,res ,next)=>{
  try {

      const categories = await categoryModel.find()
      let obj=[]
      let maps =categories.map((item)=>{
          let test={
              "_id":item._id,
              "name":item.name,
              "description":item.description,
              "status":item.status,
              "discount":item.discount,
          }
          obj.push(test)
      })
      console.log(obj);
      
      await res.render('./admin/categoryList',{obj,Admin:true})
  } catch (error) {
      console.log(error);
      error.status = 500;
      next(error);
  }
  
}



// product unlisting 
const unlistCategory = async (req,res,next) => {
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
    error.status = 500;
      next(error);
  }
};

// category deleting
const deletingCategory = async (req,res,next) => {
  try {
      console.log("okay");
    const id = req.params.id;
    req.session.isadAuth = true;
    await categoryModel.deleteOne({ _id: id });
    res.redirect("/admin/categorylist");
    console.log("okay deleted");
  } catch (error) {
    console.log(error);
    error.status = 500;
      next(error);
  }
};


// admin category update page
const updatecat = async (req,res,next) => {
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
              "status":item.status,
              "discount":item.discount
          }
          obj.push(test)
      })
      console.log(obj);
      res.render("./admin/editCategory", { Admin: true,category:obj[0] });
    
  } catch (error) {
    console.log(error);
    error.status = 500;
      next(error);
  }
};



// admin category updating
const updateCategory = async (req,res,next) => {
  try {
    const id = req.params.id;
    const {catName,catDescription,catDiscount}=req.body;
    let upperCatName=catName.toUpperCase()

    
      const newCategory= await categoryModel.updateOne(
        { _id: id },
        { name: upperCatName,
           description: catDescription,
           discount:catDiscount,
           }
      );
      console.log(catDiscount+"===============");
      if (catDiscount) {
        const discount = parseFloat(catDiscount);
        await productModel.updateMany(
          { category: id},
          [
            {
              $set: {
                offerPrice: {
                  $subtract: [
                    "$price",
                    { $multiply: ["$price", { $divide: [discount, 100] }] }
                  ]
                }
              }
            }
          ]
        );
      }else{
        await productModel.updateMany(
          { category: id, offerPrice: { $exists: true } },
          { $unset: { offerPrice: "" } }
        );
      }
      req.session.isadAuth = true;
      res.redirect("/admin/categorylist");
    
  } catch (error) {
    console.log(error);
    error.status = 500;
      next(error);
  }
};


module.exports ={addProduct,productList,addCategory,productAdded,unlistProduct,deleteProduct,editProduct,addedCategory,catList,unlistCategory,deletingCategory,updatecat,updateCategory,updateProduct,deleteProductImage}