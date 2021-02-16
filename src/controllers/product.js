const { validationResult } = require("express-validator");
const cloudinary = require("../utils/cloudinary");
const Products = require("../models/product");
const Category = require("../models/category");
const appError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const apiFeatures = require("../utils/apiFeatures");

// @desc GET all products
// @route api/v1/products
// @access public

exports.getProducts = asyncHandler(async (req, res) => {
  const resPerpage = 8;
  const productCount = await Products.countDocuments();
  const features = new apiFeatures(Products.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .pagnation(resPerpage);

  const products = await features.query;

  res.status(200).send({
    status: "Success",
    count: productCount,
    resPerpage,
    data: {
      products,
    },
  });
});

// @desc GET  product
// @route api/v1/products/id
// @access public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findById(req.params.id);
  if (!product) return next(new appError("Product not found", 404));
  res.status(200).send(product);
});

// @desc GET related products
// @route api/v1/products/id/relatedProducts
// @access public
exports.getRelatedProducts = asyncHandler(async (req, res, next) => {
  const product = await Products.findById(req.params.id);
  let limit = req.query.limit ? parseInt(req.query.limit) : 4;

  const products = await Products.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(limit)
    .populate("category", "_id name");

  if (products.length === 0)
    return next(
      new appError("There are no related products for the current product", 400)
    );

  res.status(200).send({
    status: "Success",
    count: products.length,
    data: {
      products,
    },
  });
});

// @desc POST new product
// @route api/v1/products
// @access private
exports.addProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // check if product already exists
  let myproduct = await Products.findOne({ title: req.body.title });
  if (myproduct) {
    return next(new appError("Product already exists", 400));
  }

  // chech if categoru exists
  let mycategory = await Category.findOne({ _id: req.body.category });
  if (!mycategory) {
    return next(new appError("Category does not exists", 404));
  }

  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imageLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i]);
    imageLinks.push({
      public_id: result.public_id,
      uri: result.secure_url,
    });
  }

  req.body.images = imageLinks;

  let product = new Products({
    title: req.body.title,
    category: req.body.category,
    brand: req.body.brand,
    description: req.body.description,
    quantity: req.body.quantity,
    price: req.body.price,
    images: req.body.images,
  });

  await product.save();
  res.status(201).json({
    status: "Success",
    data: {
      product,
    },
  });
});

// @desc   update Product
// @route  patch /api/vi/products/:prod_id
// @access   private to only admin
exports.updateproduct = asyncHandler(async (req, res, next) => {
  let product = await Products.findById(req.params.id);
  if (!product) {
    return next(new appError("Product not found", 404));
  } else {
    product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.json({
      status: "Success",
      data: {
        product,
      },
    });
  }
});

// @desc   delete product
// @route  delete /api/vi/products/:id
// @access   private to only admin
exports.deleteproduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findByIdAndRemove(req.params.id);

  if (!product)
    return next(
      new appError("The product with the given ID was not found.", 404)
    );

  res.status(204).json({
    data: {
      status: "success",
    },
  });
});

// @desc   add product review
// @route  put /api/vi/products/:id/review
// @access   private to only admin
exports.addproductReview = asyncHandler(async (req, res, next) => {
  let product = await Products.findById(req.params.id);
  if (!product) {
    return next(new appError("Product not found", 404));
  } else {
    const { rating, comment, user } = req.body;
    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment,
    };

    // check if user already gave a review to this prodi=uct
    const isReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    );

    if (isReviewed) {
      return next(new appError("User already gave a review on this product"));
    }

    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "Success",
      data: {
        product,
      },
    });
  }
});
