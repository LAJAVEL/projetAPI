import { Link } from 'react-router-dom';

const AdminHome = () => {
  return (
    <div className="container">
      <h2>Backoffice</h2>
      <div className="grid" style={{ gap: '2rem' }}>
        <div className="card">
          <h3>Catégories</h3>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Créer, modifier et supprimer les catégories (CPU, GPU, etc.).
          </p>
          <Link to="/admin/categories" style={{ color: '#646cff', textDecoration: 'underline' }}>
            Gérer les catégories
          </Link>
        </div>
        <div className="card">
          <h3>Partenaires</h3>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Créer, modifier et supprimer les partenaires (sites marchands).
          </p>
          <Link to="/admin/partners" style={{ color: '#646cff', textDecoration: 'underline' }}>
            Gérer les partenaires
          </Link>
        </div>
        <div className="card">
          <h3>Composants</h3>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Créer, modifier et supprimer les composants et leurs prix.
          </p>
          <Link to="/admin/components" style={{ color: '#646cff', textDecoration: 'underline' }}>
            Gérer les composants
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
