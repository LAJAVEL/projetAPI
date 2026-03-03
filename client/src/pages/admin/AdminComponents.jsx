import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';

const AdminComponents = () => {
  const [components, setComponents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [title, setTitle] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [partner, setPartner] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');

  const canCreate = useMemo(() => {
    return (
      category &&
      brand.trim() &&
      title.trim() &&
      (partner ? String(price).trim() : true)
    );
  }, [brand, category, partner, price, title]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [compsRes, catsRes, partnersRes] = await Promise.all([
        api.get('/components'),
        api.get('/categories'),
        api.get('/partners'),
      ]);
      setComponents(compsRes.data);
      setCategories(catsRes.data);
      setPartners(partnersRes.data);
    } catch {
      setError('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!partner && partners.length > 0) setPartner(partners[0]._id);
    if (!category && categories.length > 0) setCategory(categories[0]._id);
  }, [partners, categories, partner, category]);

  const createComponent = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        category,
        brand,
        title,
        model,
        description,
        prices: partner
          ? [
              {
                partner,
                price: Number(price || 0),
                url,
              },
            ]
          : [],
      };

      const res = await api.post('/components', payload);
      setComponents([res.data, ...components]);
      setBrand('');
      setTitle('');
      setModel('');
      setDescription('');
      setPrice('');
      setUrl('');
    } catch {
      setError("Création impossible (droits admin requis).");
    }
  };

  const deleteComponent = async (id) => {
    if (!window.confirm('Supprimer ce composant ?')) return;
    setError('');
    try {
      await api.delete(`/components/${id}`);
      setComponents(components.filter((c) => c._id !== id));
    } catch {
      setError("Suppression impossible (droits admin requis).");
    }
  };

  return (
    <div className="container">
      <h2>Backoffice - Composants</h2>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>Créer un composant</h3>
        <form onSubmit={createComponent} style={{ width: '100%' }}>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Marque (ex: Intel)"
            required
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre (ex: Core i7-14700K)"
            required
          />
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Modèle (optionnel)"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnel)"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: 700, display: 'block' }}>Partenaire</label>
              <select value={partner} onChange={(e) => setPartner(e.target.value)} required>
                {partners.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 700, display: 'block' }}>Prix (€)</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="650"
                required
              />
            </div>
          </div>

          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL (optionnel)" />

          <button type="submit" disabled={!canCreate}>
            Créer
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Liste</h3>
        {loading ? (
          <p>Chargement...</p>
        ) : components.length === 0 ? (
          <p>Aucun composant.</p>
        ) : (
          <div style={{ width: '100%' }}>
            {components.map((c) => (
              <div
                key={c._id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '0.75rem',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #eee',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {c.brand} {c.model || ''} {c.title ? `- ${c.title}` : ''}
                  </div>
                  <div style={{ color: '#666' }}>
                    {c.category?.name ? `${c.category.name} • ` : ''}
                    {c.prices?.[0]?.price != null ? `${c.prices[0].price} €` : 'Prix non renseigné'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteComponent(c._id)}
                  style={{ backgroundColor: '#d9534f' }}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComponents;
