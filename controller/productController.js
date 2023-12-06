const fs=require('fs')
const path=require('path')
const productModel = require('../model/productSchema')
const categoryModel=require('../model/categorySchema')
const { log } = require('console')
//const categoryModel = require('../model/category_model')


const addProduct = async(req,res)=>{
  try {
    // Assuming productModel.find() returns an array of objects
    const categories = await categoryModel.find({})
     console.log(categories);
    let obj=[]
    let maps =categories.map((item)=>{
        let test={
            "_id":item._id,
            "name":item.name,
        }
        obj.push(test)
    })
    await res.render('./admin/addProduct',{obj,Admin:true})
} catch (err) {
    console.log(err);
    res.send("Error Occurred");
}
    
}


const productAdded = async (req, res) => {
    try {
        console.log(req.files);
        console.log("===========================1");
        const { product, category,price,stock, description} = req.body
        const newproduct = new productModel({
            name: product,
            category: category,
            price: price,
            stock:stock,
            images: req.files.map(file => file.path),
            description: description
        })
        console.log("===========================2");
        console.log(newproduct);
        await newproduct.save()
        res.redirect('/admin/products')
        //console.log('okay aanu');
    }
    catch (err) {
        console.log(err);
        res.send("Error Occured")
    }
}

const productList = async (req, res) => {
    try {
        // Assuming productModel.find() returns an array of objects
        const products = await productModel.find()
         console.log(products);
        let obj=[]
        let maps =products.map((item)=>{
            let test={
                "_id":item._id,
                "name":item.name,
                "price":item.price,
                "category":item.category,
                "stock":item.stock,
                "status":item.status,
                "description":item.description
            }
            obj.push(test)
        })
        await res.render("./admin/productList", { obj, Admin: true });
    } catch (err) {
        console.log(err);
        res.send("Error Occurred");
    }
};

// product unlisting 
const unlistProduct = async (req, res) => {
    try {
      const id = req.params.id;
      const product = await productModel.findById(id);
  
      if (!product) {
        return res.status(404).send("Product not found");
      }
  
      console.log(product);
  
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
      res.send(error);
    }
  };

// product update page 
const updateProduct = async (req, res) => {
    try {
      const id = req.params.id;
      const product = await productModel.findById(id);
      console.log(product);
      res.render("./admin/updateproduct", { product: product });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  
  

const categories = async (req,res)=>{
    await res.render('./admin/categoryList',{Admin:true})
}
const addCategory = async (req,res)=>{
    await res.render('./admin/addCategory',{Admin:true})
}

module.exports ={addProduct,productList,categories,addCategory,productAdded,unlistProduct,deleteProduct}