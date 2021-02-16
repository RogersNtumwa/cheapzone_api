const express = require("express");
const router = express.Router();
const { protect, authourize } = require("../middleware/auth");
const {
  getOrder,
  getOrders,
  makeanOrder,
  deleteOrder,
} = require("../controllers/order");

router
  .route("/")
  .get(protect, authourize, getOrders)
  .post(protect, makeanOrder);
router.route("/:id").get(getOrder).delete(deleteOrder);

module.exports = router;
