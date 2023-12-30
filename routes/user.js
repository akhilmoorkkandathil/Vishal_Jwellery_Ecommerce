const express = require('express');
const router = express.Router();
const  userController= require('../controller/userController')
const userSession = require('../middlewares/isAuth');
const session = require('express-session');
const cartController = require('../controller/cartController');

router.get('/',userController.home)

router.get('/register' ,userController.register)
router.post('/register',userController.registerUser);

router.get('/login',userController.login)
router.post('/login',userController.loginUser)
router.get ('/forgot',userController.forgotOtp)
router.post('/resetpassword',userController.verifyNumber)
router.get('/resendotp',userController.resendOtp)
router.get('/forgototpverify',userController.verifyPage)
router.get('/newpassword',userController.newPassword)
router.post('/setpassword',userController.setNewPassword)

router.get('/verifyotp',userController.verifyPage)
router.post('/verifyotp',userController.verifyotp)

router.get('/addaddress',userController.addAddress)


router.get('/shop',userSession.userAuth,userController.shopProduct)

router.get('/cart',userSession.userAuth,cartController.cartProducts)
router.get('/add-to-cart/:id',cartController.addToCart)




router.get('/logout',userController.logOut)

router.get('/:id',userController.productPage)

module.exports = router;
