const express = require('express');
const router = express.Router();
const  userController= require('../controller/userController')
const userSession = require('../middlewares/isAuth');
const session = require('express-session');

router.get('/',userController.home)


router.get('/register' ,userController.register)
router.post('/otppage',userController.registerUser);

router.get('/login',userController.login)
router.post('/login',userController.loginUser)


router.get('/verifyotp',userController.verifyPage)
router.post('/verifyotp',userController.verifyotp)

router.get('/shop',userController.shopProduct)
router.get('/cart',userController.cartProducts)
router.get('/:id',userController.productPage)

module.exports = router;
