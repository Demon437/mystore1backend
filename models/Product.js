const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  pname: { type: String, required: true },
  pprice: { type: Number, required: true },
  pimage: { type: String, required: false },
  pid: { type: String, required: true, unique: true, default: () => `pid_${Date.now()}` },
});

module.exports = mongoose.model('Product', ProductSchema);
