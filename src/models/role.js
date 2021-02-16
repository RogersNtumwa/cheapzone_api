const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const Role = mongoose.model("Role", rolesSchema);
module.exports = Role;
