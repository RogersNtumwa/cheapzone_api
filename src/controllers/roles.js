const Role = require("../models/role");
const appError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const { validationResult } = require("express-validator");

// @desc GET all categories
// @route api/v1/categories
// @access private
exports.allRoles = asyncHandler(async (req, res, next) => {
  const roles = await Role.find();
  res.status(200).send({
    status: "Success",
    count: roles.length,
    data: {
      roles,
    },
  });
});

// @desc GET  Role
// @route api/v1/categories/id
// @access private
exports.getrole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  if (!role) return next(new appError("Product not found", 404));
  res.status(200).json({
    status: "success",
    data: role,
  });
});

// @desc POST new product
// @route api/v1/products
// @access private
exports.addRole = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const role = new Role({
    title: req.body.title,
  });

  await role.save();

  res.status(201).json({
    status: "Success",
    data: role,
  });
});


