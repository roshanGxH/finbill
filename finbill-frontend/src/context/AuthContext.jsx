import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("token"));

        useEffect(() => {
        async function initialize() {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const currentUser = await authApi.getCurrentUser();
                setUser(currentUser);
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        initialize();
    }, [token]);


        async function login(credentials) {
        const response = await authApi.login(credentials);
        localStorage.setItem("token", response.token);
        setToken(response.token);
        
        // Force fully fetch the absolute latest user layout with fresh eager loaded relationships
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
        
        // Direct local storage snapshot save for security verification check
        localStorage.setItem("user", JSON.stringify(currentUser));
    }


    async function register(payload) {
        return await authApi.register(payload);
    }

    async function logout() {
        await authApi.logout();
        setUser(null);
        setToken(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
