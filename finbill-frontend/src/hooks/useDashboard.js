import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "../api/dashboardApi";

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: dashboardApi.getDashboardStats,
    });
}

export function useDashboardRevenue() {
    return useQuery({
        queryKey: ["dashboard", "revenue"],
        queryFn: dashboardApi.getDashboardRevenue,
    });
}
