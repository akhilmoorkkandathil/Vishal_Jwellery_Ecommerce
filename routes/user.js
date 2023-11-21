const express = require('express');
const router = express.Router();
const {signUpUser} = require('../controller/userController')

/* GET home page. */
router.get('/', function(req, res, next) {
  let products = [{
    "name":"chair",
    "category":"Dining",
    "description":"Good chair for sittiing in ding hall and sitout",
    "price":"4500",
    "image":"https://themewagon.github.io/furni/images/post-1.jpg"
  },{
    "name":"Sofa",
    "category":"Dining",
    "description":"Good chair for sittiing in ding hall and sitout",
    "price":"4500",
    "image":"https://themewagon.github.io/furni/images/post-2.jpg"
  },{
    "name":"Interior",
    "category":"Bedroom",
    "description":"Good chair for sittiing in ding hall and sitout",
    "price":"4500",
    "image":"https://themewagon.github.io/furni/images/post-3.jpg"
  }]
  res.render('./user/index', {admin:false})
  //res.render('user/index', { products,admin:false });
});
router.get('/cart',(req,res,next)=>{
  let products = [{
    "name":"chair",
    "category":"Dining",
    "description":"Good chair for sittiing in ding hall and sitout",
    "price":"4500",
    "image":"https://themewagon.github.io/furni/images/post-1.jpg"
  },{
    "name":"Sofa",
    "category":"Dining",
    "description":"Good chair for sittiing in ding hall and sitout",
    "price":"4500",
    "image":"https://themewagon.github.io/furni/images/post-2.jpg"
  },{
    "name":"Interior",
    "category":"Bedroom",
    "description":"Good chair for sittiing in ding hall and sitout",
    "price":"4500",
    "image":"https://themewagon.github.io/furni/images/post-3.jpg"
  }]
  res.render('./user/cart', { layout: "layout",products })
  //res.render('user/cart')
})

router.get('/checkout',(req,res,next)=>{
  res.render('./user/checkout', { layout: "layout"})
  //res.render('user/checkout')
})

router.get('/shop',(req,res,next)=>{
  res.render('./user/shop', { layout: "layout" })
  //res.render('user/shop')
})
router.get('/login',(req,res,next)=>{
  res.render('./user/login',{notSingle:true})
})
router.post('/signup',signUpUser)

module.exports = router;


