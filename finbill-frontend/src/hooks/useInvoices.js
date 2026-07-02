import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as invoiceApi from "../api/invoiceApi";

export function useInvoices() {
    return useQuery({
        queryKey: ["invoices"],
        queryFn: invoiceApi.getInvoices,
    });
}

export function useCreateInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: invoiceApi.createInvoice,
        onSuccess: () => {
            // Global Invalidation Wave to keep billing layout fully synchronized
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}

export function useDeleteInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: invoiceApi.deleteInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}
