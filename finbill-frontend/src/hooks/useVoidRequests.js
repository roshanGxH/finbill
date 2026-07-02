import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as voidRequestApi from "../api/voidRequestApi";

export function useVoidRequests() {
    return useQuery({
        queryKey: ["void-requests"],
        queryFn: voidRequestApi.getVoidRequests,
    });
}

export function useCreateVoidRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: voidRequestApi.createVoidRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["void-requests"] });
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}

export function useApproveVoidRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: voidRequestApi.approveVoidRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["void-requests"] });
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}

export function useRejectVoidRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: voidRequestApi.rejectVoidRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["void-requests"] });
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}
