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
            <span>Bonjour, {user.name}</span>
            <Link to="/">Mes Configs</Link>
            <Link to="/configurator">Nouvelle Config</Link>
            <button onClick={logout} style={{ marginLeft: '1rem', padding: '0.3em 0.8em', fontSize: '0.9em' }}>
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