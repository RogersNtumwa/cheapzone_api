const Order = require("../models/order");
const appError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");

// @desc     Get user orders
// @route    Get/api/v1/user/orders
// @access   private/admin
exports.getUserOrders = asyncHandler(async (req, res, next) => {
  const userOrders = await Order.find({ user: req.params.id });
  if (userOrders.length === 0) {
    return next(new appError("User has not made any order "));
  }
  res.status(200).json({
    status: "success",
    count: userOrders.length,
    orders: userOrders,
  });
});
