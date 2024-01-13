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
router.post('/updateAddress/:index',userSession.userAuth,userController.updateAddress);
router.get('/editUserDetails',userSession.userAuth,userController.editUserDetails);
router.post('/updateUserAddress',userSession.userAuth,userController.updateUserAddress);
router.get('/deleteAddress/:index',userSession.userAuth,userController.deleteAddress)

router.get('/shop',userController.shopProduct);

router.get('/cart',userSession.userAuth,cartController.cartProducts);
router.get('/add-to-cart/:id',userSession.userAuth,cartController.addToCart);
router.get('/rfcart/:index',cartController.removeProduct)

router.get('/checkout',userController.checkoutPage)


router.get('/orders',orderController.orderPage)
router.get('/delAddress',orderController.delAdress)
router.post('/placeorder',orderController.placeOrder)
router.get('/cancelorder/:orderId',orderController.cacelOrder)



router.post('/search',userController.searchProducts);

router.get('/category/:name',catController.catPage)

router.get('/logout',userController.logOut);

router.get('/:id',userController.productPage);

module.exports = router;

