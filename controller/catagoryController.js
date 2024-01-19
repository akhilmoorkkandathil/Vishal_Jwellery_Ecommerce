const categoryModel=require('../model/categorySchema');
const productModel = require('../model/productSchema');

module.exports = {
     catPage : async (req,res) => {
        try {
            let category = req.params.name;
            let split = category.split("%20")
            if(split.length>1){
                category=split[0]+" "+split[1]
            }
            console.log(category);
            
            const products = await productModel.find({status:true,category:category}).limit(4)
          let obj=[]
              let smaps =products.map((iteam)=>{
                  let test={
                      "_id":iteam._id,
                      "name":iteam.name,
                      "price":iteam.price,
                      "images":iteam.images,
                      "category":iteam.category,
                      "stock":iteam.stock,
                      "status":iteam.status,
                      "description":iteam.description
                  }
                  obj.push(test)
              })
              req.session.isadAuth = true;
              await res.render('./user/shop',{products:obj,name:"Shop"})
        } catch (error) {
            console.log(error);
            res.redirect('/admin/error')
        }
    }
}
