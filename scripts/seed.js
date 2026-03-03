const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Component = require('../src/models/Component');
const Partner = require('../src/models/Partner');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/configurator_db');
    console.log('MongoDB Connected');

    await User.deleteOne({ email: 'admin@admin.fr' });
    await User.create({
      name: 'Admin',
      email: 'admin@admin.fr',
      password: 'admin123',
      role: 'admin',
    });

    // Nettoyage
    await Category.deleteMany({});
    await Component.deleteMany({});
    await Partner.deleteMany({});

    // Création des catégories
    const cpuCat = await Category.create({ name: 'Processeur', description: 'Le cerveau du PC' });
    const gpuCat = await Category.create({ name: 'Carte Graphique', description: 'Pour le jeu et la 3D' });
    const ramCat = await Category.create({ name: 'Mémoire RAM', description: 'Mémoire vive' });
    const mbCat = await Category.create({ name: 'Carte Mère', description: 'Support principal' });

    // Création d'un partenaire
    const amazon = await Partner.create({ name: 'Amazon', websiteUrl: 'https://amazon.fr' });

    // Création des composants
    await Component.create([
      {
        category: cpuCat._id,
        brand: 'Intel',
        title: 'Core i9-13900K',
        model: 'i9-13900K',
        description: '24 cœurs, jusqu\'à 5.8 GHz',
        prices: [{ partner: amazon._id, price: 650, url: 'https://amazon.fr/i9' }]
      },
      {
        category: cpuCat._id,
        brand: 'AMD',
        title: 'Ryzen 9 7950X',
        model: '7950X',
        description: '16 cœurs, Zen 4',
        prices: [{ partner: amazon._id, price: 580, url: 'https://amazon.fr/ryzen9' }]
      },
      {
        category: gpuCat._id,
        brand: 'NVIDIA',
        title: 'GeForce RTX 4090',
        model: 'RTX 4090',
        description: '24 Go GDDR6X, La puissance ultime',
        prices: [{ partner: amazon._id, price: 1800, url: 'https://amazon.fr/4090' }]
      },
      {
        category: gpuCat._id,
        brand: 'NVIDIA',
        title: 'GeForce RTX 4070',
        model: 'RTX 4070',
        description: '12 Go GDDR6X, Excellent rapport qualité/prix',
        prices: [{ partner: amazon._id, price: 650, url: 'https://amazon.fr/4070' }]
      },
      {
        category: ramCat._id,
        brand: 'Corsair',
        title: 'Vengeance 32Go DDR5',
        model: 'DDR5 6000MHz',
        description: 'Kit 2x16Go',
        prices: [{ partner: amazon._id, price: 120, url: 'https://amazon.fr/ram' }]
      },
       {
        category: mbCat._id,
        brand: 'ASUS',
        title: 'ROG STRIX Z790-E',
        model: 'Z790-E',
        description: 'Carte mère gaming haut de gamme',
        prices: [{ partner: amazon._id, price: 450, url: 'https://amazon.fr/mb' }]
      }
    ]);

    console.log('Données de test injectées avec succès !');
    process.exit();
  } catch (error) {
    console.error('Erreur seed:', error);
    process.exit(1);
  }
};

seedData();
