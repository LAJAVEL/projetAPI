const Component = require('../models/Component');

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : value);

const validateComponentPayload = ({ category, brand, title, prices }) => {
  const nextCategory = normalizeString(category);
  const nextBrand = normalizeString(brand);
  const nextTitle = normalizeString(title);

  if (!nextCategory) return 'Catégorie obligatoire.';
  if (!nextBrand) return 'Marque obligatoire.';
  if (!nextTitle) return 'Titre obligatoire.';

  if (!Array.isArray(prices) || prices.length === 0) return 'Prix obligatoire.';
  const numericPrice = Number(prices[0]?.price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) return 'Prix invalide.';

  return null;
};

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

  const validationError = validateComponentPayload({ category, brand, title, prices });
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const component = new Component({
    category: normalizeString(category),
    brand: normalizeString(brand),
    title: normalizeString(title),
    model: normalizeString(model),
    description: normalizeString(description),
    specifications,
    image: normalizeString(image),
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
    const nextCategory = normalizeString(category);
    const nextBrand = normalizeString(brand);
    const nextTitle = normalizeString(title);
    const nextModel = normalizeString(model);
    const nextDescription = normalizeString(description);
    const nextImage = normalizeString(image);

    if (category != null && !nextCategory) return res.status(400).json({ message: 'Catégorie obligatoire.' });
    if (brand != null && !nextBrand) return res.status(400).json({ message: 'Marque obligatoire.' });
    if (title != null && !nextTitle) return res.status(400).json({ message: 'Titre obligatoire.' });
    if (prices != null) {
      const numericPrice = Number(prices?.[0]?.price);
      if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({ message: 'Prix invalide.' });
      }
    }

    if (category != null) component.category = nextCategory;
    if (brand != null) component.brand = nextBrand;
    if (title != null) component.title = nextTitle;
    if (model != null) component.model = nextModel;
    if (description != null) component.description = nextDescription;
    if (specifications != null) component.specifications = specifications;
    if (image != null) component.image = nextImage;
    if (prices != null) component.prices = prices;

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
