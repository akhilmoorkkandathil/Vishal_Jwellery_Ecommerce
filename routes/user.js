const express = require('express');
const router = express.Router();
const  userController= require('../controller/userController')
const userSession = require('../middlewares/isAuth');
const session = require('express-session');

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
router.get('/home',userSession.loged,userController.loginHome)

router.get('/verifyotp',userController.verifyPage)
router.post('/verifyotp',userController.verifyotp)

router.get('/shop',userController.shopProduct)
router.get('/cart',userController.cartProducts)

router.get('/dining',userController.diningProduct)
router.get('/bedroom',userController.bedroomProduct)
router.get('/studyroom',userController.studyroomProduct)

router.get('/Living',userController.livingProduct)
router.get('/Dining',userController.diningProduct)
router.get('/Bedroom',userController.bedroomProduct)
router.get('/Study%20Room',userController.studyroomProduct)



router.get('/logout',userController.logOut)

router.get('/:id',userController.productPage)

module.exports = router;
