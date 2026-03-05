import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <div className="logo">Configurateur PC</div>
      <div className="links">
        {user ? (
          <>
            <span>Bonjour, {user.name || user.email}</span>
            <Link to="/">Mes Configs</Link>
            <Link to="/configurator">Nouvelle Config</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="admin-link">Admin</Link>
            )}
            <button onClick={logout} className="btn-neutral">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
