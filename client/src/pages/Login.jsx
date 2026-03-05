import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Échec de la connexion. Vérifiez vos identifiants.');
    }
  };

  return (
    <div className="form-container">
      <h2>Connexion</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>

      <div className="card" style={{ marginTop: '16px', background: 'var(--surface-2)' }}>
        <div style={{ display: 'grid', gap: '6px' }}>
          <div style={{ fontWeight: 650 }}>Accès Admin :</div>
          <div className="muted" style={{ fontSize: '12px' }}>
            Email : <code>admin@admin.fr</code> · Mot de passe : <code>admin123</code>
          </div>
          <div className="muted" style={{ fontSize: '12px' }}>
            Pour vous connecter en tant qu'utilisateur, passez par l'inscription.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
