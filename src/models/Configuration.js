const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // User given name for config
  components: [{
    component: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
    priceAtTime: { type: Number }, // To freeze the price
    quantity: { type: Number, default: 1 }
  }],
  totalCost: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Configuration', configurationSchema);
