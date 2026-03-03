import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const bootstrap = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get('/users/profile');
                setUser({ ...res.data, token });
            } catch {
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/users/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser({ ...res.data, token: res.data.token });
        return res.data;
    };

    const register = async (name, email, password) => {
        const res = await api.post('/users/register', { name, email, password });
        localStorage.setItem('token', res.data.token);
        setUser({ ...res.data, token: res.data.token });
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
