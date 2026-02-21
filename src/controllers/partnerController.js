const Partner = require('../models/Partner');

// @desc    Get all partners
// @route   GET /api/partners
// @access  Public
const getPartners = async (req, res) => {
  const partners = await Partner.find();
  res.json(partners);
};

// @desc    Créer un partenaire
// @route   POST /api/partners
// @access  Private/Admin
const createPartner = async (req, res) => {
  const { name, websiteUrl, affiliationDetails } = req.body;
  const partner = new Partner({ name, websiteUrl, affiliationDetails });
  const createdPartner = await partner.save();
  res.status(201).json(createdPartner);
};

// @desc    Mettre à jour un partenaire
// @route   PUT /api/partners/:id
// @access  Private/Admin
const updatePartner = async (req, res) => {
  const partner = await Partner.findById(req.params.id);

  if (partner) {
    partner.name = req.body.name || partner.name;
    partner.websiteUrl = req.body.websiteUrl || partner.websiteUrl;
    partner.affiliationDetails = req.body.affiliationDetails || partner.affiliationDetails;
    const updatedPartner = await partner.save();
    res.json(updatedPartner);
  } else {
    res.status(404).json({ message: 'Partner not found' });
  }
};

// @desc    Supprimer un partenaire
// @route   DELETE /api/partners/:id
// @access  Private/Admin
const deletePartner = async (req, res) => {
  const partner = await Partner.findById(req.params.id);

  if (partner) {
    await partner.deleteOne();
    res.json({ message: 'Partner removed' });
  } else {
    res.status(404).json({ message: 'Partner not found' });
  }
};

module.exports = { getPartners, createPartner, updatePartner, deletePartner };
