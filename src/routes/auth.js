const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  Register,
  logIn,
  getMe,
  assignRole,
  getUsers,
} = require("../controllers/auth");
const { protect, authourize } = require("../middleware/auth");

router
  .route("/")
  .post(
    [
      check("email", "Avallid email is required").isEmail().not().isEmpty(),
      check("password", "Password is required").not().isEmpty(),
    ],
    logIn
  );

router
  .route("/register")
  .post(
    [
      check("name", "Name is required").not().isEmpty(),
      check("email", "Avallid email is required").isEmail().not().isEmpty(),
      check("password", "Password is required").not().isEmpty(),
    ],
    Register
  );
router.route("/me").get(protect, getMe);
router.route("/roles/:id").patch(assignRole);
router.route("/list").get(protect, authourize, getUsers);

module.exports = router;
