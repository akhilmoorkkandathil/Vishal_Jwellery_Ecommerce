var express = require('express');
var router = express.Router();

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
  res.render('./admin/index', { admin:true })
});

module.exports = router;

