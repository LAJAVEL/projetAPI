import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

const Configurator = () => {
  const [categories, setCategories] = useState([]);
  const [components, setComponents] = useState([]);
  const [selections, setSelections] = useState({});
  const [configName, setConfigName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id: configId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, compsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/components')
        ]);
        setCategories(catsRes.data);
        setComponents(compsRes.data);

        if (configId) {
          const configRes = await api.get(`/configurations/${configId}`);
          const config = configRes.data;
          setConfigName(config.name || '');

          // Nettoyage de la structure pour l'édition
          const comps = config.components || [];
          const nextSelections = {};
          
          comps.forEach(item => {
             const comp = item.component;
             if(comp && comp.category) {
                const catId = typeof comp.category === 'object' ? comp.category._id : comp.category;
                nextSelections[catId] = comp;
             }
          });
          setSelections(nextSelections);
        } else {
          setSelections({});
          setConfigName('');
        }
      } catch (err) {
        // Erreur silencieuse ou toast
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configId]);

  const calculateTotal = () => {
    return Object.values(selections).reduce((acc, comp) => {
      const price = comp?.prices?.length ? Number(comp.prices[0].price) : 0;
      return acc + (Number.isNaN(price) ? 0 : price);
    }, 0);
  };

  const handleSave = async () => {
    if (!configName) return alert('Veuillez donner un nom à votre configuration');
    
    const formattedComponents = Object.values(selections)
      .filter(Boolean)
      .map((comp) => ({
        component: comp._id,
        priceAtTime: comp?.prices?.length ? comp.prices[0].price : 0,
        quantity: 1
      }));

    try {
      if (configId) {
        await api.put(`/configurations/${configId}`, {
          name: configName,
          components: formattedComponents,
        });
      } else {
        await api.post('/configurations', {
          name: configName,
          components: formattedComponents,
        });
      }
      navigate('/');
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  if (loading) return <p>Chargement du configurateur...</p>;

  return (
    <div className="container">
      <h2>{configId ? 'Modifier la configuration' : 'Nouvelle Configuration'}</h2>
      
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
                  {comp.brand} {comp.model} - {comp.prices?.[0]?.price != null ? `${comp.prices[0].price} €` : 'Prix non renseigné'}
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

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Total Estimé : {calculateTotal()} €</h3>
          <button onClick={handleSave} disabled={Object.keys(selections).length === 0}>
            {configId ? 'Mettre à jour' : 'Sauvegarder la configuration'}
          </button>
        </div>
    </div>
  );
};

export default Configurator;
