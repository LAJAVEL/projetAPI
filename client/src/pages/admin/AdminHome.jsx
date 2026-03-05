import { Link } from 'react-router-dom';

const AdminHome = () => {
  return (
    <div className="container">
      <h2>Backoffice</h2>
      <div className="grid">
        <div className="card">
          <h3>Catégories</h3>
          <p className="muted" style={{ marginBottom: '14px', fontSize: '12px' }}>
            Créer, modifier et supprimer les catégories (CPU, GPU, etc.).
          </p>
          <Link to="/admin/categories" className="link-primary">
            Gérer les catégories
          </Link>
        </div>
        <div className="card">
          <h3>Partenaires</h3>
          <p className="muted" style={{ marginBottom: '14px', fontSize: '12px' }}>
            Créer, modifier et supprimer les partenaires (sites marchands).
          </p>
          <Link to="/admin/partners" className="link-primary">
            Gérer les partenaires
          </Link>
        </div>
        <div className="card">
          <h3>Composants</h3>
          <p className="muted" style={{ marginBottom: '14px', fontSize: '12px' }}>
            Créer, modifier et supprimer les composants et leurs prix.
          </p>
          <Link to="/admin/components" className="link-primary">
            Gérer les composants
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
