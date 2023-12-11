const express = require('express');
const adminController = require('../controller/adminController');
const productController = require('../controller/productController')
const Session= require("../middlewares/isAadAuth")
const router = express.Router();
const upload = require('../config/multerSetup')
const multer=require('multer')




router.get('/',adminController.adminLogin);
router.post('/login',adminController.loginAdmin);
router.get('/logout',adminController.logOut)


router.get('/dashboard',Session.adisAuth,adminController.dashboard);

//product routers
router.get('/products',productController.productList);
router.get('/addproduct',productController.addProduct);
router.post('/addproduct',upload.array('images'),productController.productAdded)
router.get('/unlistproduct/:id',productController.unlistProduct)
router.get('/deleteproduct/:id',productController.deleteProduct)
router.get('/editproduct/:id',productController.editProduct)
router.get('/updateproduct/:id',productController.updateProduct)


//coupen routers
router.get('/coupens',Session.adisAuth,adminController.coupen);
router.get('/addcoupen',Session.adisAuth,adminController.addCoupen);


//category routers
router.get('/categories',Session.adisAuth,productController.categories);
router.get('/addcategory',Session.adisAuth,productController.addCategory)
router.get('/categorylist',Session.adisAuth,productController.catList)
router.post('/addcategory',Session.adisAuth,productController.addedCategory)
router.get('/catstatus/:id',Session.adisAuth,productController.unlistCategory)
router.get('/deletecategory/:id',Session.adisAuth,productController.deletingCategory)

//user routers
router.get('/customers',Session.adisAuth,adminController.userList);
router.get('/deleteuser/:id',adminController.deleteUser)
router.get('/blockuser/:id',adminController.blockUser)

//order routers
router.get('/orders',Session.adisAuth,adminController.orders);




module.exports = router;

