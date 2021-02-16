const express = require("express");
const { getUserOrders } = require("../controllers/user");
const router = express.Router();

router.route("/:id/orders").get(getUserOrders);
module.exports = router;
