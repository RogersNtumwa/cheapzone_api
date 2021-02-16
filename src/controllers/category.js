const Category = require("../models/category");
const appError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");

// @desc GET all categories
// @route api/v1/categories
// @access private
exports.Categories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).send({
    status: "Success",
    count: categories.length,
    data: {
      categories,
    },
  });
});

// @desc GET  category
// @route api/v1/categories/id
// @access private
exports.category = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new appError("Product not found", 404));
  res.status(200).json({
    status: "success",
    data: category,
  });
});

// @desc POST new product
// @route api/v1/products
// @access private
exports.addCategory = asyncHandler(async (req, res, next) => {
  const category = new Category({
    name: req.body.name,
  });

  await category.save();

  res.status(201).json({
    status: "Success",
    data: category,
  });
});
