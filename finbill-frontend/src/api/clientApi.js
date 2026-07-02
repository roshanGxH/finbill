import api from "./axios";

export const getClients = async () => {
    const { data } = await api.get("/clients");
    return data;
};

export const createClient = async (payload) => {
    const { data } = await api.post("/clients", payload);
    return data;
};

export const updateClient = async ({ id, payload }) => {
    const { data } = await api.put(`/clients/${id}`, payload);
    return data;
};

export const deleteClient = async (id) => {
    const { data } = await api.delete(`/clients/${id}`);
    return data;
};
