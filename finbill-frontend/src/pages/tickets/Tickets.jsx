import React from 'react';
import { useVoidRequests, useApproveVoidRequest, useRejectVoidRequest } from '../../hooks/useVoidRequests';
import { Check, X, ShieldAlert, FileText, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Tickets() {
    const { data: tickets, isLoading } = useVoidRequests();
    const approveVoidMutation = useApproveVoidRequest();
    const rejectVoidMutation = useRejectVoidRequest();

    const handleApprove = async (id) => {
        if (window.confirm('Action Notice: Approving this request will void the payment, adjust client ledger balances, and recalculate invoice states. Proceed?')) {
            try {
                await approveVoidMutation.mutateAsync(id);
                toast.success('Void request approved. Transaction ledger rolled back.');
            } catch (err) {
                toast.error(err.response?.data?.message || 'Approval action failed.');
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Action Notice: Rejecting this request will restore the payment status to Active. Proceed?')) {
            try {
                await rejectVoidMutation.mutateAsync(id);
                toast.success('Void request rejected. Payment status restored.');
            } catch (err) {
                toast.error(err.response?.data?.message || 'Rejection action failed.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <h3 className="text-lg text-indigo-600 font-semibold animate-pulse">Loading Ticket Desk logs...</h3>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 select-none">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 m-0">Ledger Modification Ticket Desk</h1>
                <p className="text-sm text-slate-500 mt-1 m-0">Review operator request tickets, inspect justification reasons, and authorize ledger rollback settlements.</p>
            </div>

            {/* List */}
            {tickets && tickets.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {tickets.map((ticket) => {
                        const pay = ticket.payment;
                        
                        return (
                            <div 
                                key={ticket.id} 
                                className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-all duration-200"
                            >
                                <div className="flex flex-col gap-3 flex-1 min-w-0">
                                    {/* Badge Header Row */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400 font-medium">Ticket #{ticket.id}</span>
                                        <span className="text-xs text-slate-300">•</span>
                                        <span className="text-xs text-slate-500 font-bold uppercase">Filed by {ticket.user?.name}</span>
                                        <span className="text-xs text-slate-300">•</span>
                                        {ticket.status === 'pending' && (
                                            <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-100/50">
                                                Pending Review
                                            </span>
                                        )}
                                        {ticket.status === 'approved' && (
                                            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-100/50">
                                                Approved
                                            </span>
                                        )}
                                        {ticket.status === 'rejected' && (
                                            <span className="bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-red-100/50">
                                                Rejected
                                            </span>
                                        )}
                                    </div>

                                    {/* Main info row */}
                                    <div>
                                        <h3 className="m-0 text-sm font-bold text-slate-900 flex flex-wrap items-center gap-1.5 leading-tight">
                                            Request to void payment <span className="text-indigo-600 font-semibold">{pay?.reference_id}</span> 
                                            for client <span className="text-slate-800">{pay?.invoice?.client?.client_name || 'Client'}</span>
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1 mb-3">
                                            Clearance: {pay?.payment_date} | Amount: <strong className="text-slate-800">₹{Number(pay?.amount_paid).toLocaleString()}</strong>
                                        </p>
                                    </div>

                                    {/* Justification Box */}
                                    <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl flex gap-3 items-start">
                                        <FileText size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                        <div className="text-xs text-slate-600 leading-relaxed break-words min-w-0">
                                            <strong className="text-slate-700 block mb-0.5">Operator Justification:</strong>
                                            "{ticket.reason}"
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Block */}
                                {ticket.status === 'pending' ? (
                                    <div className="flex gap-2 shrink-0 w-full md:w-auto justify-end">
                                        <button 
                                            onClick={() => handleReject(ticket.id)}
                                            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-red-50 border border-slate-200 text-red-600 hover:text-red-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                                        >
                                            <X size={14} /> Reject Request
                                        </button>
                                        <button 
                                            onClick={() => handleApprove(ticket.id)}
                                            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 border-none text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-emerald-600/10 transition-colors"
                                        >
                                            <Check size={14} /> Approve Rollback
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-400 font-medium italic shrink-0 w-full md:w-auto text-right">
                                        Resolved {new Date(ticket.updated_at).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-16 px-6 border-2 border-dashed border-slate-200 rounded-xl text-center bg-white">
                    <ClipboardList size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="m-0 text-base font-bold text-slate-800">Zero Void Tickets Filed</h3>
                    <p className="m-0 text-sm text-slate-500 mt-1">When an operator requests a payment void, the correction ticket will register here for review.</p>
                </div>
            )}
        </div>
    );
}
