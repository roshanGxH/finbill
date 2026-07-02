import api from "./axios";

export const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    // Custom fix: we use 'token' to exactly match ChatGPT's state requirements
    localStorage.setItem("token", data.token);
    return data;
};

export const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
};

export const getCurrentUser = async () => {
    const { data } = await api.get("/auth/me");
    return data;
};

export const logout = async () => {
    try {
        await api.post("/auth/logout");
    } finally {
        localStorage.removeItem("token");
    }
};
