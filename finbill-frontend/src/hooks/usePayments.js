import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as paymentApi from "../api/paymentApi";

export function usePayments() {
    return useQuery({
        queryKey: ["payments"],
        queryFn: paymentApi.getPayments,
    });
}

export function useRecordPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: paymentApi.recordPayment,
        onSuccess: () => {
            // Global Invalidation Wave to keep dashboard charts and client rows fully synchronized
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}

export function useDeletePayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: paymentApi.deletePayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}
