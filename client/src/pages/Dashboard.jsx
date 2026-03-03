import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await api.get('/configurations');
      setConfigs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteConfig = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) return;
    try {
      await api.delete(`/configurations/${id}`);
      setConfigs(configs.filter((c) => c._id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="container">
      <h2>Mes Configurations</h2>
      {configs.length === 0 ? (
        <p>Aucune configuration enregistrée. <Link to="/configurator">Créer ma première config</Link></p>
      ) : (
        <div className="grid">
          {configs.map((config) => (
            <div key={config._id} className="card">
              <h3>{config.name}</h3>
              <p>Prix Total : <strong>{config.totalCost} €</strong></p>
              <p>Composants : {config.components.length}</p>
              <button onClick={() => deleteConfig(config._id)} style={{ backgroundColor: '#d9534f', marginTop: '10px' }}>
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;