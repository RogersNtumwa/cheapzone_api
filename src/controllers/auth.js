const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Role = require("../models/role");
const appError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// @desc     Register new user
// @route    Get/api/users/register
// @access   public
exports.Register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ errors: [{ msg: "User already exists" }] });
  }
  user = await User.create({
    name,
    email,
    password,
  });

  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRETE,
    {
      expiresIn: process.env.JWT_EXPIRE,
    },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
};
// @desc     login user
// @route    Get/api/users
// @access   public
exports.logIn = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res
      .status(400)
      .json({ errors: [{ msg: "Invalid user credentials" }] });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res
      .status(400)
      .json({ errors: [{ msg: "Invalid user credentials" }] });

  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRETE,
    {
      expiresIn: process.env.JWT_EXPIRE,
    },
    (err, token) => {
      if (err) return err;
      res.json({ token });
    }
  );
});

// @desc     Get Current logged in user
// @route    Get/api/auth/me
// @access   private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json(user);
});

// @desc arole to user
// route patch /api/v1/user/role/:id
// acess private
exports.assignRole = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title } = req.body;
  const user = await User.findById(req.params.id);
  const roletoasign = await Role.findOne({ title });
  if (!roletoasign) {
    return next(new appError("There is no such role", 404));
  } else {
    user.roles.unshift({ title: roletoasign });
    await user.save();

    res.status(201).json({
      status: "Seccuss",
      data: user.roles,
    });
  }
});

// @desc     Get Current logged in user and should be admin
// @route    Get/api/auth/me
// @access   private/admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "Success",
    data: users,
  });
});
