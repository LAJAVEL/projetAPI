const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  affiliationDetails: {
    commissionRate: { type: Number },
    conditions: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
