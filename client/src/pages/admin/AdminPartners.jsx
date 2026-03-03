import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';

const AdminPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const [editingId, setEditingId] = useState(null);
  const editingPartner = useMemo(
    () => partners.find((p) => p._id === editingId),
    [partners, editingId]
  );
  const [editName, setEditName] = useState('');
  const [editWebsiteUrl, setEditWebsiteUrl] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/partners');
      setPartners(res.data);
    } catch {
      setError('Impossible de charger les partenaires.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!editingPartner) return;
    setEditName(editingPartner.name || '');
    setEditWebsiteUrl(editingPartner.websiteUrl || '');
  }, [editingPartner]);

  const createPartner = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/partners', { name, websiteUrl });
      setPartners([res.data, ...partners]);
      setName('');
      setWebsiteUrl('');
    } catch {
      setError("Création impossible (droits admin requis).");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditWebsiteUrl('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setError('');
    try {
      const res = await api.put(`/partners/${editingId}`, {
        name: editName,
        websiteUrl: editWebsiteUrl,
      });
      setPartners(partners.map((p) => (p._id === editingId ? res.data : p)));
      cancelEdit();
    } catch {
      setError("Modification impossible (droits admin requis).");
    }
  };

  const deletePartner = async (id) => {
    if (!window.confirm('Supprimer ce partenaire ?')) return;
    setError('');
    try {
      await api.delete(`/partners/${id}`);
      setPartners(partners.filter((p) => p._id !== id));
      if (editingId === id) cancelEdit();
    } catch {
      setError("Suppression impossible (droits admin requis).");
    }
  };

  return (
    <div className="container">
      <h2>Backoffice - Partenaires</h2>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>Créer un partenaire</h3>
        <form onSubmit={createPartner} style={{ width: '100%' }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom (ex: Amazon)"
            required
          />
          <input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="URL (ex: https://amazon.fr)"
            required
          />
          <button type="submit">Créer</button>
        </form>
      </div>

      <div className="card">
        <h3>Liste</h3>
        {loading ? (
          <p>Chargement...</p>
        ) : partners.length === 0 ? (
          <p>Aucun partenaire.</p>
        ) : (
          <div style={{ width: '100%' }}>
            {partners.map((p) => (
              <div
                key={p._id}
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
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ color: '#666' }}>{p.websiteUrl}</div>
                </div>
                <button type="button" onClick={() => setEditingId(p._id)}>
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => deletePartner(p._id)}
                  style={{ backgroundColor: '#d9534f' }}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingPartner && (
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
              value={editWebsiteUrl}
              onChange={(e) => setEditWebsiteUrl(e.target.value)}
              placeholder="URL"
              required
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

export default AdminPartners;
