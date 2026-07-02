import React, { useState } from 'react';
import { useInvoices, useDeleteInvoice } from '../../hooks/useInvoices';
import InvoiceTable from '../../components/invoices/InvoiceTable';
import CreateInvoice from './CreateInvoice';
import { FilePlus, FileText, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Invoices() {
    const { data: invoices, isLoading } = useInvoices();
    const deleteInvoiceMutation = useDeleteInvoice();

    const [searchQuery, setSearchQuery] = useState('');
    const [isConstructorOpen, setIsConstructorOpen] = useState(false);

    const handleDeleteInvoice = async (id) => {
        if (window.confirm('Purge Warning: Are you sure you want to delete this invoice statement? Doing so will trigger background cascade updates on the client total accounting metrics row.')) {
            try {
                await deleteInvoiceMutation.mutateAsync(id);
                toast.success('Invoice and nested details lines dropped safely.');
            } catch (err) {
                toast.error('Cascade security protocol locked deletion vectors.');
            }
        }
    };

    const filteredInvoices = invoices?.filter(inv => 
        inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.client?.client_name && inv.client.client_name.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <h3 className="text-lg text-indigo-600 font-semibold animate-pulse">Loading Invoice Ledger Contexts...</h3>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 select-none">
            {/* Header Layout */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 m-0">Enterprise Invoices Desk</h1>
                    <p className="text-sm text-slate-500 mt-1 m-0">Compile transactional invoices, monitor payments limits statuses, and export PDF certificates.</p>
                </div>
                <button 
                    onClick={() => setIsConstructorOpen(true)} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold border-none cursor-pointer shadow-md shadow-indigo-600/10 transition-colors"
                >
                    <FilePlus size={16} />
                    New Invoice Statement
                </button>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full max-w-[400px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all box-border shadow-sm"
                    placeholder="Search parameters by invoice code or client profile..."
                />
            </div>

            {/* Render Invoices Table or Empty State */}
            {filteredInvoices.length > 0 ? (
                <InvoiceTable invoices={filteredInvoices} onDelete={handleDeleteInvoice} />
            ) : (
                <div className="py-16 px-6 border-2 border-dashed border-slate-200 rounded-xl text-center bg-white">
                    <FileText size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="m-0 text-base font-bold text-slate-800">No Invoice Ledger Statements Available</h3>
                    <p className="m-0 text-sm text-slate-500 mt-1 mb-5">Launch an automated statement to update outstanding balances across multi-tenants.</p>
                    <button 
                        onClick={() => setIsConstructorOpen(true)} 
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold cursor-pointer border-none shadow-md transition-colors"
                    >
                        Deploy First Invoice
                    </button>
                </div>
            )}

            {/* Modal constructor */}
            {isConstructorOpen && (
                <CreateInvoice onClose={() => setIsConstructorOpen(false)} />
            )}
        </div>
    );
}
