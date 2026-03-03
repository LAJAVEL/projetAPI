import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [editingId, setEditingId] = useState(null);
  const editingCategory = useMemo(
    () => categories.find((c) => c._id === editingId),
    [categories, editingId]
  );

  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch {
      setError('Impossible de charger les catégories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!editingCategory) return;
    setEditName(editingCategory.name || '');
    setEditDescription(editingCategory.description || '');
  }, [editingCategory]);

  const createCategory = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/categories', { name, description });
      setCategories([res.data, ...categories]);
      setName('');
      setDescription('');
    } catch {
      setError("Création impossible (droits admin requis).");
    }
  };

  const startEdit = (id) => {
    setEditingId(id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setError('');
    try {
      const res = await api.put(`/categories/${editingId}`, {
        name: editName,
        description: editDescription,
      });
      setCategories(
        categories.map((c) => (c._id === editingId ? res.data : c))
      );
      cancelEdit();
    } catch {
      setError("Modification impossible (droits admin requis).");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    setError('');
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      if (editingId === id) cancelEdit();
    } catch {
      setError("Suppression impossible (droits admin requis).");
    }
  };

  return (
    <div className="container">
      <h2>Backoffice - Catégories</h2>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>Créer une catégorie</h3>
        <form onSubmit={createCategory} style={{ width: '100%' }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom (ex: Processeur)"
            required
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <button type="submit">Créer</button>
        </form>
      </div>

      <div className="card">
        <h3>Liste</h3>
        {loading ? (
          <p>Chargement...</p>
        ) : categories.length === 0 ? (
          <p>Aucune catégorie.</p>
        ) : (
          <div style={{ width: '100%' }}>
            {categories.map((c) => (
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
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ color: '#666' }}>{c.description}</div>
                </div>
                <button type="button" onClick={() => startEdit(c._id)}>
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(c._id)}
                  style={{ backgroundColor: '#d9534f' }}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingCategory && (
        <div className="card">
          <h3>Modifier</h3>
          <div style={{ width: '100%' }}>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nom"
              required
            />
            <input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
            />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={saveEdit}>
                Enregistrer
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                style={{ backgroundColor: '#666' }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
