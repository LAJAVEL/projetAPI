const Configuration = require('../models/Configuration');
const generateConfigPDF = require('../utils/pdfGenerator');

// @desc    Créer une nouvelle configuration
// @route   POST /api/configurations
// @access  Private
const createConfig = async (req, res) => {
  const { name, components } = req.body;

  if (!components || components.length === 0) {
    res.status(400).json({ message: 'No components added' });
    return;
  } else {
    // Calculate total cost
    let totalCost = 0;
    // Assuming frontend sends { componentId, priceAtTime, quantity }
    // Or we should fetch current price? "Calculer le coût total ... en fonction des composants sélectionnés."
    // Usually we take the price at that moment. Let's assume the frontend sends the price or we fetch it from the component (base price? or lowest partner price?).
    // Given the requirement "Lister pour chaque composant les prix proposés par les partenaires", the user probably selects a specific offer (Component + Partner Price).
    // For simplicity, I'll assume the request body contains the price the user saw.
    // Ideally we should validate this price against DB, but for this TP I'll trust the input or fetch the component.
    
    // Let's iterate and sum up.
    for (let item of components) {
      totalCost += item.priceAtTime * (item.quantity || 1);
    }

    const config = new Configuration({
      user: req.user._id,
      name,
      components: components.map(c => ({
        component: c.component,
        priceAtTime: c.priceAtTime,
        quantity: c.quantity || 1
      })),
      totalCost
    });

    const createdConfig = await config.save();
    res.status(201).json(createdConfig);
  }
};

const updateConfig = async (req, res) => {
  const { name, components } = req.body;
  const config = await Configuration.findById(req.params.id);

  if (!config) {
    res.status(404).json({ message: 'Configuration not found' });
    return;
  }

  if (config.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  if (!components || components.length === 0) {
    res.status(400).json({ message: 'No components added' });
    return;
  }

  let totalCost = 0;
  for (const item of components) {
    const priceAtTime = Number(item.priceAtTime) || 0;
    const quantity = Number(item.quantity) || 1;
    totalCost += priceAtTime * quantity;
  }

  config.name = name || config.name;
  config.components = components.map((c) => ({
    component: c.component,
    priceAtTime: Number(c.priceAtTime) || 0,
    quantity: Number(c.quantity) || 1,
  }));
  config.totalCost = totalCost;

  const updatedConfig = await config.save();
  res.json(updatedConfig);
};

// @desc    Récupérer les configurations de l'utilisateur connecté
// @route   GET /api/configurations/my
// @access  Private
const getMyConfigs = async (req, res) => {
  const configs = await Configuration.find({ user: req.user._id });
  res.json(configs);
};

// @desc    Récupérer une configuration par son ID
// @route   GET /api/configurations/:id
// @access  Private
const getConfigById = async (req, res) => {
  const config = await Configuration.findById(req.params.id).populate('components.component');

  if (config) {
    // Check if user is owner or admin
    if (config.user.toString() === req.user._id.toString() || req.user.role === 'admin') {
      res.json(config);
    } else {
      res.status(401).json({ message: 'Not authorized to view this configuration' });
    }
  } else {
    res.status(404).json({ message: 'Configuration not found' });
  }
};

// @desc    Get all configurations (Admin)
// @route   GET /api/configurations
// @access  Private/Admin
const getConfigs = async (req, res) => {
  const configs = await Configuration.find({}).populate('user', 'id name');
  res.json(configs);
};

// @desc    Export configuration to PDF
// @route   GET /api/configurations/:id/pdf
// @access  Private
const exportConfigPDF = async (req, res) => {
  const config = await Configuration.findById(req.params.id)
    .populate('components.component')
    .populate('user', 'name email');

  if (config) {
     if (config.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=config_${config._id}.pdf`);

        try {
          await generateConfigPDF(config, res);
        } catch {
          if (!res.headersSent) {
            res.status(500).json({ message: 'Erreur lors de la génération du PDF' });
          }
        }
     } else {
        res.status(401).json({ message: 'Not authorized' });
     }
  } else {
    res.status(404).json({ message: 'Configuration not found' });
  }
};

// @desc    Supprimer une configuration
// @route   DELETE /api/configurations/:id
// @access  Private
const deleteConfig = async (req, res) => {
  const config = await Configuration.findById(req.params.id);

  if (config) {
    if (config.user.toString() === req.user._id.toString() || req.user.role === 'admin') {
      await config.deleteOne();
      res.json({ message: 'Configuration removed' });
    } else {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(404).json({ message: 'Configuration not found' });
  }
};


module.exports = {
  createConfig,
  updateConfig,
  getMyConfigs,
  getConfigById,
  getConfigs,
  exportConfigPDF,
  deleteConfig
};
