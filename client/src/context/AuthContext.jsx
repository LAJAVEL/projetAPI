import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Ici on pourrait vérifier le token via une route /me, 
            // pour l'instant on suppose qu'il est valide si présent
            // et on décode basiquement ou on stocke juste l'état connecté
            // Idéalement: api.get('/users/profile')...
            setUser({ token }); 
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/users/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser({ token: res.data.token, ...res.data });
        return res.data;
    };

    const register = async (name, email, password) => {
        const res = await api.post('/users/register', { name, email, password });
        localStorage.setItem('token', res.data.token);
        setUser({ token: res.data.token, ...res.data });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};