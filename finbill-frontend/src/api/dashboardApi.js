import api from "./axios";

export const getDashboardStats = async () => {
    const { data } = await api.get("/dashboard/stats");
    return data;
};

export const getDashboardRevenue = async () => {
    const { data } = await api.get("/dashboard/revenue");
    return data;
};
