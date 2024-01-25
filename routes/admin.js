const express = require("express");
const adminController = require("../controller/adminController");
const productController = require("../controller/productController");
const Session = require("../middlewares/isAadAuth");
const router = express.Router();
const multer = require("multer");
const orderController = require("../controller/orderController");
const upload = multer({ dest: "uploads/" });

router.get("/", adminController.adminLogin);
router.post("/login", adminController.adminLogined);

router.get("/dashboard", Session.adisAuth, adminController.dashboard);

//product routers
router.get("/products", Session.adisAuth, productController.productList);
router.get("/addproductpage", Session.adisAuth, productController.addProduct);
router.post(
  "/addproduct",
  upload.array("image", 6),
  productController.productAdded
);
router.get(
  "/unlistproduct/:id",
  Session.adisAuth,
  productController.unlistProduct
);
router.get(
  "/deleteproduct/:id",
  Session.adisAuth,
  productController.deleteProduct
);
router.get("/editproduct/:id", Session.adisAuth, productController.editProduct);
router.post(
  "/updateproduct/:id",
  Session.adisAuth,
  upload.array("image", 6),
  productController.updateProduct
);
router.get(
  "/deleteImage",
  Session.adisAuth,
  productController.deleteProductImage
);

//coupen routers
router.get("/coupens", Session.adisAuth, adminController.coupen);
router.get("/addcoupen", Session.adisAuth, adminController.addCoupen);

//category routers
router.get("/categories", Session.adisAuth, productController.categories);
router.get("/addcategory", Session.adisAuth, productController.addCategory);
router.get("/categorylist", Session.adisAuth, productController.catList);
router.post("/addcategory", Session.adisAuth, productController.addedCategory);
router.get(
  "/catstatus/:id",
  Session.adisAuth,
  productController.unlistCategory
);
router.get(
  "/deletecategory/:id",
  Session.adisAuth,
  productController.deletingCategory
);
router.get("/editcategory/:id", Session.adisAuth, productController.updatecat);
router.post(
  "/updatecategory/:id",
  Session.adisAuth,
  productController.updateCategory
);


//user routers
router.get("/customers", Session.adisAuth, adminController.userList);
router.get("/deleteuser/:id", Session.adisAuth, adminController.deleteUser);
router.get("/blockuser/:id", Session.adisAuth, adminController.blockUser);

//order routers
router.get("/orders", Session.adisAuth, adminController.orders);
router.get("/shipped/:id", Session.adisAuth, orderController.orderShipped);
router.get('/myOrders/:id',orderController.myOrders)

//logout
router.get("/logout", Session.adisAuth, adminController.logOut);

router.get("/error", adminController.errorPage);

module.exports = router;
