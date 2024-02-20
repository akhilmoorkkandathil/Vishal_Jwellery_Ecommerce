const express = require('express');
const router = express.Router();
const  userController= require('../controller/userController')
const userSession = require('../middlewares/isAuth');
const session = require('express-session');
const cartController = require('../controller/cartController');
const orderController = require('../controller/orderController');
const coupenCountroller = require('../controller/coupenCountroller');
const walletController = require('../controller/walletController')

// Home
router.get('/',userController.home);

// User Registration
router.get('/register' ,userController.register);
router.post('/register',userController.registerUser);

// User Login
router.get('/login',userController.login);
router.post('/login',userController.loginUser);

// OTP Verification
router.get('/verifyotp',userController.optPage);
router.post('/verifyotp',userController.verifyotp);

// Forgot Password
router.get ('/forgotpassword',userController.phonePage);
router.post('/resetpassword',userController.verifyNumber);
router.get('/forgototpverify',userController.optPage);
router.get('/newpassword',userController.newPassword);
router.post('/setpassword',userController.setNewPassword);
router.get('/resendotp',userController.resendOtp);

// User Address
router.get('/address',userSession.userAuth,userController.myAddress);
router.get('/addAddress',userSession.userAuth,userController.addAddress);
router.post('/addAddress',userSession.userAuth,userController.toAddAddress);
router.get('/editAddress/:index',userSession.userAuth, userController.editPage);
router.put('/editAddress/updateAddress/:index',userSession.userAuth,userController.updateAddress);
router.delete('/deleteAddress/:index',userSession.userAuth,userController.deleteAddress)

// User Details
router.get('/editUserDetails',userSession.userAuth,userController.editUserDetails);
router.put('/updateUserAddress',userSession.userAuth,userController.updateUserAddress);

// Shop and Product Pages
router.get('/shop',userController.shopProduct);
router.get('/productPage/:id',userController.productPage);

// Cart
router.get('/cart',cartController.cartProducts);
router.get('/add-to-cart/:id',userSession.userAuth,cartController.addToCart);
router.get('/rfcart/:index',userSession.userAuth,cartController.removeProduct)
router.put('/update-product',userSession.userAuth,cartController.updateProduct)
router.post('/updateQuantity',userSession.userAuth,cartController.updateQuantity)
router.post('/productQuantity',cartController.productQuantity)

// Checkout
router.get('/checkout',userSession.userAuth,userController.checkoutPage)
router.get('/new-Del-Add/:index',userSession.userAuth,userController.newDeliveryAddrres)

// Orders
router.get('/orders',userSession.userAuth,orderController.orderPage)
router.post('/delAddress',userSession.userAuth,orderController.delAdress)
router.post('/placeorder',orderController.placeOrder)
router.get('/cancelorder/:orderId',userSession.userAuth,orderController.cacelOrder)
router.get('/orderedProducts/:orderId',userSession.userAuth,orderController.viewOrderdProducts)
router.post('/createOrder',userController.createOrder)
router.get('/orderSuccess',userSession.userAuth,orderController.orderSuccess)
router.get('/myOrders/:id',userSession.userAuth,orderController.myOrders)
router.get('/returnOrder/:id',userSession.userAuth,orderController.returnOrder)

//Invoice Download
router.get('/downloadInvoice/:id',orderController.downloadInvoice)

// Wallet
router.get('/wallet',userSession.userAuth,walletController.walletPage)
router.post('/createWallet',userSession.userAuth,walletController.createWallet)
router.put('/walletTopup',userSession.userAuth,walletController.addToWallet)
router.post('/walletTransaction',userSession.userAuth,walletController.walletTransaction)

// Coupons
router.post('/applyCoupon',userSession.userAuth,coupenCountroller.applyCoupon)
router.post('/revokeCoupon',userSession.userAuth,coupenCountroller.revokeCoupon)

// Logout
router.get('/logout',userController.logOut);

// Error Page
router.get('/error',userController.errorPage);


module.exports = router;


