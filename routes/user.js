const express = require('express');
const router = express.Router();
const  userController= require('../controller/userController')
const userSession = require('../middlewares/isAuth');
const session = require('express-session');

router.get('/',userController.home)


router.get('/register',userController.register)
router.post('/otppage',userController.registerUser);

router.get('/login',userController.login)
router.post('/login',userController.loginUser)


router.get('/verifyotp',userController.verifyPage)
router.post('/verifyotp',userController.verifyotp)

router.get('/shop',userSession.logedToHome ,userController.shopProduct)
router.get('/cart',userSession.logedToHome ,userController.cartProducts)

router.get('/productpage',userSession.logedToHome ,userController.productPage)


module.exports = router;
