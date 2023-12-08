const express = require('express');
const adminController = require('../controller/adminController');
const productController = require('../controller/productController')
const Session= require("../middlewares/isAadAuth")
const router = express.Router();

const multer=require('multer')
const upload=multer({dest:'public/adminAssets/uploads/'})


router.get('/',adminController.adminLogin);
router.post('/login',adminController.loginAdmin);
router.get('/logout',adminController.logOut)


router.get('/dashboard',Session.adisAuth,adminController.dashboard);

//product routers
router.get('/products',Session.adisAuth,productController.productList);
router.get('/addproduct',Session.adisAuth,productController.addProduct);
router.post('/addproduct',Session.adisAuth,upload.array('images'),productController.productAdded)
router.get('/unlistproduct/:id',Session.adisAuth,productController.unlistProduct)
router.get('/deleteproduct/:id',Session.adisAuth,productController.deleteProduct)
router.get('/editproduct/:id',Session.adisAuth,productController.editProduct)

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

