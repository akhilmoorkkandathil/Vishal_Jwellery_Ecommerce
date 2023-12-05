const express = require('express');
const adminController = require('../controller/adminController');
const productController = require('../controller/productController')
const router = express.Router();

/* GET home page. */
router.get('/dashboard', adminController.dashboard);
router.get('/',adminController.adminLogin);
router.post('/login',adminController.loginAdmin);
router.get('/addcoupen',adminController.addCoupen);
router.get('/addproduct',productController.addProduct);
router.get('/categories',productController.categories);
router.get('/addcategory',productController.addCategory)
router.get('/coupens',adminController.coupen);
router.get('/customers',adminController.customers);
router.get('/orders',adminController.orders);
router.get('/products',productController.productList);
router.post('/addproduct',productController.productAdded)
router.get('/unlistproduct/:id',productController.unlistProduct)
router.get('/deleteproduct/:id',productController.deleteProduct)
router.get('/category',adminController.catList)
router.post('/addcategory',adminController.addCategory)
router.get('/changestatus/:id',adminController.unlistCategory)
router.get('/deletecategory/:id',adminController.deletingCategory)

router.get('/logout',)

module.exports = router;

