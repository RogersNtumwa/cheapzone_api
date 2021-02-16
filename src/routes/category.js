const express = require("express");
const router = express.Router();
const { protect, authourize } = require("../middleware/auth");
const {
  category,
  Categories,
  addCategory,
} = require("../controllers/category");
const { route } = require("./product");

router
  .route("/")
  .get(protect, authourize, Categories)
  .post(protect, authourize, addCategory);
router.route("/:id").get(protect, authourize, category);

module.exports = router;
