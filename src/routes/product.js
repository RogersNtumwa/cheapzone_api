const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const {
  getProduct,
  getProducts,
  addProduct,
  updateproduct,
  deleteproduct,
  getRelatedProducts,
  addproductReview,
} = require("../controllers/product");
const { protect, authourize } = require("../middleware/auth");

router.route("/").get(getProducts).post(protect, authourize, addProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(protect, authourize, updateproduct)
  .delete(protect, authourize, deleteproduct);

router.route("/:id/relatedProducts").get(getRelatedProducts);
router.route("/:id/review").put(protect, addproductReview);
module.exports = router;
