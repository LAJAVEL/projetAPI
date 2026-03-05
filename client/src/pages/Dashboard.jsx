import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await api.get('/configurations/my');
      setConfigs(res.data);
    } catch (err) {
      alert('Erreur lors du chargement des configurations');
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

  const downloadPDF = async (e, id) => {
    if (e && e.preventDefault) e.preventDefault();
    
    try {
      const response = await api.get(`/configurations/${id}/pdf`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      if (!blob || blob.size === 0) return;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `config_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
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
              <div className="row-actions" style={{ marginTop: '10px' }}>
                <button onClick={(e) => downloadPDF(e, config._id)} className="btn-primary">
                  PDF
                </button>
                <button onClick={() => navigate(`/configurator/${config._id}`)} className="btn-neutral">
                  Modifier
                </button>
                <button onClick={() => deleteConfig(config._id)} className="btn-danger">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
