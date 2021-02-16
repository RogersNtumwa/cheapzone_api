const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { allRoles, addRole, getrole } = require("../controllers/roles");
const { protect, authourize } = require("../middleware/auth");
router
  .route("/")
  .get(allRoles)
  .post(check("title", "Title is required").not().isEmpty(), addRole);

router.route("/:id").get(protect, authourize, getrole);

module.exports = router;
