const express = require('express');
const router = express.Router();
const  userController= require('../controller/userController')
const userSession = require('../middlewares/isAuth');
const session = require('express-session');
const cartController = require('../controller/cartController');
const catController = require('../controller/catagoryController')
const orderController = require('../controller/orderController')


router.get('/',userController.home);

router.get('/register' ,userController.register);
router.post('/register',userController.registerUser);

router.get('/login',userController.login);
router.post('/login',userController.loginUser);
router.get('/verifyotp',userController.optPage);
router.post('/verifyotp',userController.verifyotp);

router.get ('/forgotpassword',userController.phonePage);
router.post('/resetpassword',userController.verifyNumber);
router.get('/forgototpverify',userController.optPage);
router.get('/newpassword',userController.newPassword);
router.post('/setpassword',userController.setNewPassword);


router.get('/resendotp',userController.resendOtp);


router.get('/address',userSession.userAuth,userController.myAddress);
router.get('/addAddress',userSession.userAuth,userController.addAddress);
router.post('/addAddress',userSession.userAuth,userController.toAddAddress);
router.get('/editAddress/:index',userSession.userAuth, userController.editPage);
router.post('/editAddress/updateAddress/:index',userSession.userAuth,userController.updateAddress);
router.get('/editUserDetails',userSession.userAuth,userController.editUserDetails);
router.post('/updateUserAddress',userSession.userAuth,userController.updateUserAddress);
router.get('/deleteAddress/:index',userSession.userAuth,userController.deleteAddress)

router.get('/shop',userController.shopProduct);

router.get('/cart',userSession.userAuth,cartController.cartProducts);
router.get('/add-to-cart/:id',userSession.userAuth,cartController.addToCart);
router.get('/rfcart/:index',cartController.removeProduct)
router.post('/update-product',cartController.updateProduct)
router.post('/updateQuantity',cartController.updateQuantity)

router.get('/checkout',userSession.userAuth,userController.checkoutPage)
router.get('/new-Del-Add/:index',userSession.userAuth,userController.newDeliveryAddrres)

router.get('/orders',userSession.userAuth,orderController.orderPage)
router.get('/delAddress',userSession.userAuth,orderController.delAdress)
router.post('/placeorder',orderController.placeOrder)
router.get('/cancelorder/:orderId',userSession.userAuth,orderController.cacelOrder)
router.get('/orderedProducts/:orderId',userSession.userAuth,orderController.viewOrderdProducts)
router.post('/createOrder',userController.createOrder)
router.get('/verify_payment',userSession.userAuth,orderController.verifyPayment)
router.get('/orderSuccess',userSession.userAuth,orderController.orderSuccess)
router.get('/myOrders/:id',userSession.userAuth,orderController.myOrders)

router.get('/category/:name',userSession.userAuth,catController.catPage)

router.get('/logout',userController.logOut);
router.get('/error',userController.errorPage);
router.get('/:id',userController.productPage);

module.exports = router;

