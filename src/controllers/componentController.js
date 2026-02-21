const Component = require('../models/Component');

// @desc    Récupérer tous les composants avec filtre optionnel
// @route   GET /api/components
// @access  Public
const getComponents = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const brand = req.query.brand ? { brand: req.query.brand } : {};

  const components = await Component.find({ ...keyword, ...category, ...brand })
    .populate('category', 'name')
    .populate('prices.partner', 'name websiteUrl');
  
  res.json(components);
};

// @desc    Récupérer un composant par son ID
// @route   GET /api/components/:id
// @access  Public
const getComponentById = async (req, res) => {
  const component = await Component.findById(req.params.id)
    .populate('category', 'name')
    .populate('prices.partner', 'name websiteUrl');

  if (component) {
    res.json(component);
  } else {
    res.status(404).json({ message: 'Component not found' });
  }
};

// @desc    Créer un composant
// @route   POST /api/components
// @access  Private/Admin
const createComponent = async (req, res) => {
  const { category, brand, title, model, description, specifications, image, prices } = req.body;

  const component = new Component({
    category,
    brand,
    title,
    model,
    description,
    specifications,
    image,
    prices
  });

  const createdComponent = await component.save();
  res.status(201).json(createdComponent);
};

// @desc    Mettre à jour un composant
// @route   PUT /api/components/:id
// @access  Private/Admin
const updateComponent = async (req, res) => {
  const { category, brand, title, model, description, specifications, image, prices } = req.body;

  const component = await Component.findById(req.params.id);

  if (component) {
    component.category = category || component.category;
    component.brand = brand || component.brand;
    component.title = title || component.title;
    component.model = model || component.model;
    component.description = description || component.description;
    component.specifications = specifications || component.specifications;
    component.image = image || component.image;
    if (prices) component.prices = prices;

    const updatedComponent = await component.save();
    res.json(updatedComponent);
  } else {
    res.status(404).json({ message: 'Component not found' });
  }
};

// @desc    Supprimer un composant
// @route   DELETE /api/components/:id
// @access  Private/Admin
const deleteComponent = async (req, res) => {
  const component = await Component.findById(req.params.id);

  if (component) {
    await component.deleteOne();
    res.json({ message: 'Component removed' });
  } else {
    res.status(404).json({ message: 'Component not found' });
  }
};

module.exports = {
  getComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
};
