import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Configurator = () => {
  const [categories, setCategories] = useState([]);
  const [components, setComponents] = useState([]);
  const [selections, setSelections] = useState({}); // { categoryId: component }
  const [configName, setConfigName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, compsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/components')
        ]);
        setCategories(catsRes.data);
        setComponents(compsRes.data);
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateTotal = () => {
    return Object.values(selections).reduce((acc, comp) => {
      // Prend le premier prix dispo (simplification)
      const price = comp.prices && comp.prices.length > 0 ? comp.prices[0].price : 0;
      return acc + price;
    }, 0);
  };

  const handleSave = async () => {
    if (!configName) return alert('Veuillez donner un nom à votre configuration');
    
    const formattedComponents = Object.values(selections).map(comp => ({
      component: comp._id,
      priceAtTime: comp.prices && comp.prices.length > 0 ? comp.prices[0].price : 0,
      quantity: 1
    }));

    try {
      await api.post('/configurations', {
        name: configName,
        components: formattedComponents,
        totalCost: calculateTotal()
      });
      navigate('/');
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
      console.error(err);
    }
  };

  if (loading) return <p>Chargement du configurateur...</p>;

  return (
    <div className="container">
      <h2>Nouvelle Configuration</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Nom de la config : </label>
        <input 
          type="text" 
          value={configName} 
          onChange={(e) => setConfigName(e.target.value)} 
          placeholder="Mon PC Gamer 2026"
        />
      </div>

      {categories.map(cat => {
        const catComponents = components.filter(c => c.category && (c.category._id === cat._id || c.category === cat._id));
        return (
          <div key={cat._id} className="card">
            <h3>{cat.name}</h3>
            <select 
              value={selections[cat._id]?._id || ""}
              onChange={(e) => {
                const comp = components.find(c => c._id === e.target.value);
                setSelections(prev => ({
                  ...prev,
                  [cat._id]: comp
                }));
              }}
            >
              <option value="" disabled>Choisir un composant...</option>
              {catComponents.map(comp => (
                <option key={comp._id} value={comp._id}>
                  {comp.brand} {comp.model} - {comp.prices?.[0]?.price} €
                </option>
              ))}
            </select>
            {selections[cat._id] && (
              <p style={{ fontSize: '0.9em', color: '#666' }}>
                {selections[cat._id].description}
              </p>
            )}
          </div>
        );
      })}

      <div className="card" style={{ position: 'sticky', bottom: '20px', backgroundColor: '#f9f9f9', borderTop: '2px solid #333' }}>
        <h3>Total Estimé : {calculateTotal()} €</h3>
        <button onClick={handleSave} disabled={Object.keys(selections).length === 0}>
          Sauvegarder la configuration
        </button>
      </div>
    </div>
  );
};

export default Configurator;