import React from 'react';
import { Trash2, ShieldCheck, Clock, CheckCircle2, RotateCcw } from 'lucide-react';

export default function PaymentTable({ payments, onDelete }) {
    return (
        <div className="w-full overflow-x-auto bg-white border border-slate-200/70 rounded-xl shadow-sm">
            <table className="w-full border-collapse text-left text-sm m-0 min-w-[600px] select-none">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider">Reference TXN ID</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider">Linked Invoice Code</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider">Clearance Date</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider text-center">Audit Status</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider text-right">Amount Paid</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider text-center">Actions Node</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {payments.map((pay) => {
                        const status = pay.status || 'active'; // Default to active for backward compatibility
                        
                        return (
                            <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-slate-900 font-bold">{pay.reference_id}</td>
                                <td className="px-6 py-4 text-indigo-600 font-medium">
                                    {pay.invoice?.invoice_number || `INV-${pay.invoice_id}`}
                                </td>
                                <td className="px-6 py-4 text-slate-500">{pay.payment_date}</td>
                                <td className="px-6 py-4 text-center">
                                    {status === 'active' && (
                                        <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100/50">
                                            <ShieldCheck size={12} /> BALANCED
                                        </div>
                                    )}
                                    {status === 'void_pending' && (
                                        <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-100/50">
                                            <Clock size={12} /> VOID PENDING
                                        </div>
                                    )}
                                    {status === 'voided' && (
                                        <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200/50 line-through">
                                            <CheckCircle2 size={12} /> VOIDED
                                        </div>
                                    )}
                                </td>
                                <td className={`px-6 py-4 font-bold text-right ${status === 'voided' ? 'text-slate-400 line-through' : 'text-emerald-600'}`}>
                                    ₹{Number(pay.amount_paid).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {status === 'active' ? (
                                        <button 
                                            onClick={() => onDelete(pay)} 
                                            className="bg-transparent border-none text-red-500 hover:text-red-700 cursor-pointer p-1 transition-colors"
                                            title="Request Void Ticket"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    ) : (
                                        <button 
                                            disabled 
                                            className="bg-transparent border-none text-slate-300 p-1 cursor-not-allowed"
                                            title={status === 'void_pending' ? 'Void ticket pending review' : 'Payment voided'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
