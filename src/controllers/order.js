const Order = require("../models/order");
const asyncHandler = require("../utils/asyncHandler");
const appError = require("../utils/appError");

//route  GET api/orders
// access private
exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate("user", "_id name");
  if (orders.length < 1)
    return res
      .status(200)
      .json({ msg: "There are no avaible ordes at the moment" });
  res.status(200).json(orders);
});

// route GET api/orders/orderID
//accsess private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new appError("Order not found", 404));
  }
  res.status(200).json(order);
});

// route POST api/orders
// access private

exports.makeanOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItem,
    shippingAddress,
    paymentMethod,
    itemPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  const order = new Order({
    orderItem,
    shippingAddress,
    paymentMethod,
    shippingPrice,
    itemPrice,
    taxPrice,
    totalPrice,
    user: req.user.id,
  });
  await order.save();

  res.status(201).json({ Status: "Success", order });
});

// @desc   delete order
// @route  delete /api/vi/orders/:id
// @access   private to only admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndRemove(req.params.id);

  if (!order)
    return next(
      new appError("The Order with the given ID was not found.", 404)
    );

  res.status(204).json({
    data: {
      status: "success",
    },
  });
});
