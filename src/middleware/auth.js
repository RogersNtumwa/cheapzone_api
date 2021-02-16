const jwt = require("jsonwebtoken");
const User = require("../models/user");
const role = require("../models/role");
const Role = require("../models/role");
const appError = require("../utils/appError");

// Protect routes
exports.protect = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ errors: [{ msg: "No token, Authourixation denied" }] });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ errors: [{ msg: "token is not valid" }] });
  }
};

exports.authourize = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  const userrole = user.roles.map((role) => role.title.toString());
  if (userrole.length === 0) {
    return next(new appError("User has no role", 401));
  }

  const role = await Role.findOne({ _id: userrole[0] });

  if (role.title !== "Admin") {
    return next(new appError("You are not authorized for this action", 401));
  }
  next();
};
