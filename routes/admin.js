const express = require('express');
const adminController = require('../controller/adminController');
const productController = require('../controller/productController')
const Session= require("../middlewares/isAadAuth")
const router = express.Router();

const multer=require('multer')
const upload=multer({dest:'uploads/'})


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

//coupen routers
router.get('/coupens',Session.adisAuth,adminController.coupen);
router.get('/addcoupen',Session.adisAuth,adminController.addCoupen);


//category routers
router.get('/categories',Session.adisAuth,productController.categories);
router.get('/addcategory',Session.adisAuth,productController.addCategory)
router.get('/category',Session.adisAuth,adminController.catList)
router.post('/addcategory',Session.adisAuth,adminController.addCategory)
router.get('/changestatus/:id',Session.adisAuth,adminController.unlistCategory)
router.get('/deletecategory/:id',Session.adisAuth,adminController.deletingCategory)

//user routers
router.get('/customers',Session.adisAuth,adminController.userList);
router.get('/deleteuser/:id',adminController.deleteUser)

//order routers
router.get('/orders',Session.adisAuth,adminController.orders);




module.exports = router;

