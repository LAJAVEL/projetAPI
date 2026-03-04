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
  const [image, setImage] = useState('');

  const [editingId, setEditingId] = useState(null);
  const editingComponent = useMemo(
    () => components.find((c) => c._id === editingId),
    [components, editingId]
  );

  const resetForm = () => {
    setCategory('');
    setBrand('');
    setTitle('');
    setModel('');
    setDescription('');
    setPartner('');
    setPrice('');
    setImage('');
  };

  useEffect(() => {
    if (editingComponent) {
      setCategory(editingComponent.category._id || editingComponent.category);
      setBrand(editingComponent.brand);
      setTitle(editingComponent.title);
      setModel(editingComponent.model);
      setDescription(editingComponent.description);
      const firstPrice = editingComponent.prices?.[0];
      setPartner(firstPrice?.partner?._id || firstPrice?.partner || '');
      setPrice(firstPrice?.price != null ? String(firstPrice.price) : '');
      setImage(editingComponent.image);
    } else {
      resetForm();
    }
  }, [editingComponent]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [compRes, catRes, partRes] = await Promise.all([
        api.get('/components'),
        api.get('/categories'),
        api.get('/partners'),
      ]);
      setComponents(compRes.data);
      setCategories(catRes.data);
      setPartners(partRes.data);
    } catch (err) {
      setError('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!price) {
        alert('Veuillez renseigner un prix');
        return;
      }

      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice)) {
        alert('Prix invalide');
        return;
      }

      const prices = [{ partner: partner || undefined, price: numericPrice }];

      const componentData = {
        category,
        brand,
        title,
        model,
        description,
        image,
        prices,
      };

      if (editingId) {
        await api.put(`/components/${editingId}`, componentData);
      } else {
        await api.post('/components', componentData);
      }
      setEditingId(null);
      resetForm();
      fetchData();
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const startEdit = (id) => {
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
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
        <h3>{editingId ? 'Modifier un composant' : 'Créer un composant'}</h3>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            required
            style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
          >
            <option value="">Sélectionner une catégorie</option>
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
            style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre (ex: Core i7-14700K)"
            required
            style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
          />
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Modèle (optionnel)"
            style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnel)"
            style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Partenaire</label>
              <select 
                value={partner} 
                onChange={(e) => setPartner(e.target.value)}
                style={{ width: '100%', padding: '0.5rem' }}
              >
                <option value="">Aucun</option>
                {partners.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Prix (€)</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="650"
                style={{ width: '100%', padding: '0.5rem' }}
                required
              />
            </div>
          </div>

          <input 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
            placeholder="URL Image (optionnel)" 
            style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
          />

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button type="submit" style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
              {editingId ? 'Mettre à jour' : 'Créer'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{ backgroundColor: '#666', padding: '0.75rem 1.5rem', cursor: 'pointer' }}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
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
                  gridTemplateColumns: '1fr auto auto',
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
                <button type="button" onClick={() => startEdit(c._id)}>
                  Modifier
                </button>
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
