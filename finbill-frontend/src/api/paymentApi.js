import api from "./axios";

export const getPayments = async () => {
    const { data } = await api.get("/payments");
    return data;
};

export const recordPayment = async (payload) => {
    const { data } = await api.post("/payments", payload);
    return data;
};

export const deletePayment = async (id) => {
    const { data } = await api.delete(`/payments/${id}`);
    return data;
};
