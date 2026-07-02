import api from "./axios";

export const getInvoices = async () => {
    const { data } = await api.get("/invoices");
    return data;
};

export const createInvoice = async (payload) => {
    const { data } = await api.post("/invoices", payload);
    return data;
};

export const deleteInvoice = async (id) => {
    const { data } = await api.delete(`/invoices/${id}`);
    return data;
};

export const downloadInvoicePdf = async (id) => {
    const response = await api.get(`/invoices/${id}/pdf`, {
        responseType: 'blob' // Essential binary format for catching real files streams
    });
    return response.data;
};
