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
    setError('');
    try {
      const nextCategory = String(category || '').trim();
      const nextBrand = String(brand || '').trim();
      const nextTitle = String(title || '').trim();
      const nextPrice = Number(price);

      if (!nextCategory) return setError('Veuillez sélectionner une catégorie.');
      if (!nextBrand) return setError('Veuillez renseigner une marque.');
      if (!nextTitle) return setError('Veuillez renseigner un titre.');
      if (!price || Number.isNaN(nextPrice) || nextPrice <= 0) return setError('Veuillez renseigner un prix valide.');

      const prices = [{ partner: partner || undefined, price: nextPrice }];

      const componentData = {
        category: nextCategory,
        brand: nextBrand,
        title: nextTitle,
        model,
        description,
        image: String(image || '').trim(),
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
      setError("Erreur lors de l'enregistrement.");
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontWeight: 650, display: 'block', marginBottom: '6px' }}>Partenaire</label>
              <select 
                value={partner} 
                onChange={(e) => setPartner(e.target.value)}
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
              <label style={{ fontWeight: 650, display: 'block', marginBottom: '6px' }}>Prix (€)</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="650"
                required
                type="number"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>

          <input 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
            placeholder="URL Image (optionnel)" 
          />

          {image ? (
            <div style={{ marginTop: '6px', marginBottom: '14px' }}>
              <img
                src={image}
                alt="aperçu"
                className="thumb"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          ) : null}

          <div className="row-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Mettre à jour' : 'Créer'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-neutral"
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
                className="list-row"
              >
                {c.image ? (
                  <img
                    src={c.image}
                    alt={`${c.brand} ${c.title}`}
                    className="thumb"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="thumb" />
                )}
                <div>
                  <div style={{ fontWeight: 650 }}>
                    {c.brand} {c.model || ''} {c.title ? `- ${c.title}` : ''}
                  </div>
                  <div className="muted" style={{ fontSize: '12px' }}>
                    {c.category?.name ? `${c.category.name} • ` : ''}
                    {c.prices?.[0]?.price != null ? `${c.prices[0].price} €` : 'Prix non renseigné'}
                  </div>
                </div>
                <button type="button" onClick={() => startEdit(c._id)} className="btn-neutral">
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => deleteComponent(c._id)}
                  className="btn-danger"
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
