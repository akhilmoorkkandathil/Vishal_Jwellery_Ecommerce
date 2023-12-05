const fs=require('fs')
const path=require('path')
const productModel = require('../model/productSchema')
const { log } = require('console')
//const categoryModel = require('../model/category_model')


const addProduct = async(req,res)=>{
   
    await res.render('./admin/addProduct',{Admin:true})
}


const productAdded = async (req, res) => {
    try {
        console.log(req.file);
        const { product, category,price,stock, description} = req.body
        const newproduct = new productModel({
            name: product,
            category: category,
            price: price,
            stock:stock,
            //image: req.files.map(file => file.path),
            description: description
        })
        //console.log(newproduct);
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
        //console.log(products);
        let obj=[]
        let maps =products.map((iteam)=>{
            let test={
                "_id":iteam._id,
                "name":iteam.name,
                "price":iteam.price,
                "category":iteam.category,
                "stock":iteam.stock,
                "status":iteam.status,
                "description":iteam.description
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
        console.log("okay");
      const id = req.params.id;
      const product = await productModel.deleteOne({ _id: id });
      res.redirect("/admin/products");
      console.log("okay deleted");
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