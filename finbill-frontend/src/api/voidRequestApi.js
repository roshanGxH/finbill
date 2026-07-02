import api from "./axios";

export const getVoidRequests = async () => {
    const { data } = await api.get("/void-requests");
    return data;
};

export const createVoidRequest = async (payload) => {
    const { data } = await api.post("/void-requests", payload);
    return data;
};

export const approveVoidRequest = async (id) => {
    const { data } = await api.post(`/void-requests/${id}/approve`);
    return data;
};

export const rejectVoidRequest = async (id) => {
    const { data } = await api.post(`/void-requests/${id}/reject`);
    return data;
};
