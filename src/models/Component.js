const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: true },
  title: { type: String, required: true },
  model: { type: String },
  description: { type: String },
  specifications: { type: Map, of: String }, // Flexible specs (key-value pairs)
  image: { type: String },
  prices: [{
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
    price: { type: Number, required: true },
    url: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Component', componentSchema);
