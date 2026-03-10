import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');

        try {
            const resp = await api.post("/auth/refresh/", {
                refresh: refreshToken
            });

            if (resp.status === 200) {
                localStorage.setItem('access_token', resp.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch {
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                await refreshToken();
            } else {
                setIsAuthorized(true);
            }
        } catch {
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem'
            }}>
                Loading...
            </div>
        );
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;