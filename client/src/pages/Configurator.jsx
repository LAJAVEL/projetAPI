import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

const Configurator = () => {
  const [categories, setCategories] = useState([]);
  const [components, setComponents] = useState([]);
  const [selections, setSelections] = useState({});
  const [configName, setConfigName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id: configId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setError('');
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
        setError('Erreur de chargement du configurateur.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [configId]);

  const calculateTotal = () => {
    return Object.values(selections).reduce((acc, comp) => {
      const price = comp?.prices?.length ? Number(comp.prices[0].price) : 0;
      return acc + (Number.isNaN(price) ? 0 : price);
    }, 0);
  };

  const handleSave = async () => {
    setError('');
    if (!configName.trim()) {
      setError('Veuillez donner un nom à votre configuration.');
      return;
    }
    
    const formattedComponents = Object.values(selections)
      .filter(Boolean)
      .map((comp) => ({
        component: comp._id,
        priceAtTime: comp?.prices?.length ? comp.prices[0].price : 0,
        quantity: 1
      }));

    if (formattedComponents.length === 0) {
      setError('Veuillez sélectionner au moins un composant.');
      return;
    }

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
      setError('Erreur lors de la sauvegarde.');
    }
  };

  if (loading) return <p>Chargement du configurateur...</p>;

  const selectedCount = Object.values(selections).filter(Boolean).length;

  return (
    <div className="container">
      <h2>{configId ? 'Modifier la configuration' : 'Nouvelle Configuration'}</h2>
      {error && <p className="error">{error}</p>}
      
      <div className="card">
        <h3>Informations</h3>
        <input
          type="text"
          value={configName}
          onChange={(e) => setConfigName(e.target.value)}
          placeholder="Nom de la config (ex: Mon PC Gamer 2026)"
          required
        />
        <div className="muted" style={{ fontSize: '12px' }}>
          Sélections : {selectedCount} · Total estimé : {calculateTotal()} €
        </div>
      </div>

      {categories.map(cat => {
        const catComponents = components.filter(c => c.category && (c.category._id === cat._id || c.category === cat._id));
        const selected = selections[cat._id];
        return (
          <div key={cat._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <h3>{cat.name}</h3>
              {selected ? (
                <span className="muted" style={{ fontSize: '12px' }}>sélectionné</span>
              ) : (
                <span className="muted" style={{ fontSize: '12px' }}>à choisir</span>
              )}
            </div>
            <select 
              value={selected?._id || ""}
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
            {selected && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt={`${selected.brand} ${selected.title}`}
                    className="thumb"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : null}
                <div style={{ display: 'grid', gap: '6px', minWidth: 0 }}>
                  <div style={{ fontWeight: 650 }}>
                    {selected.brand} {selected.model ? `${selected.model} · ` : ''}{selected.title}
                  </div>
                  {selected.description ? (
                    <div className="muted" style={{ fontSize: '12px' }}>{selected.description}</div>
                  ) : (
                    <div className="muted" style={{ fontSize: '12px' }}>Aucune description.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="card">
        <div className="row-actions" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'grid', gap: '4px' }}>
            <div style={{ fontWeight: 650 }}>Total estimé</div>
            <div className="muted" style={{ fontSize: '12px' }}>{calculateTotal()} €</div>
          </div>
          <button onClick={handleSave} className="btn-primary" disabled={!configName.trim() || selectedCount === 0}>
            {configId ? 'Mettre à jour' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Configurator;
