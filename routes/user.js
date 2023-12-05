const express = require('express');
const router = express.Router();
const  userController= require('../controller/userController')

router.get('/',userController.home)


router.get('/register',userController.register)
router.post('/otppage',userController.registerUser);

router.get('/login',userController.login)
router.post('/login',userController.loginUser)


router.get('/verifyotp',userController.verifyPage)
router.post('/verifyotp',userController.verifyotp)




module.exports = router;
