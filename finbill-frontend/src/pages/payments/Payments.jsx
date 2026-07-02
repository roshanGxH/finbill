import React, { useState } from 'react';
import { usePayments, useRecordPayment } from '../../hooks/usePayments';
import { useCreateVoidRequest } from '../../hooks/useVoidRequests';
import PaymentTable from '../../components/payments/PaymentTable';
import PaymentForm from '../../components/payments/PaymentForm';
import VoidRequestModal from '../../components/payments/VoidRequestModal';
import { Landmark, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Payments() {
    const { data: payments, isLoading } = usePayments();
    const recordPaymentMutation = useRecordPayment();
    const createVoidRequestMutation = useCreateVoidRequest();

    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const handleRecordPaymentSubmit = async (formData) => {
        try {
            await recordPaymentMutation.mutateAsync(formData);
            toast.success('Double-entry accounting transaction balance posted successfully!');
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Server validation failed.');
        }
    };

    const handleVoidRequestTrigger = (payment) => {
        setSelectedPayment(payment);
    };

    const handleVoidRequestSubmit = async (formData) => {
        try {
            await createVoidRequestMutation.mutateAsync(formData);
            toast.success('Void approval ticket raised successfully.');
            setSelectedPayment(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit void request.');
        }
    };

    const filteredPayments = payments?.filter(pay => 
        pay.reference_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pay.invoice?.invoice_number && pay.invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <h3 className="text-lg text-indigo-600 font-semibold animate-pulse">Loading Payments Ledger Flow...</h3>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 select-none">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 m-0">Payments Bookkeeping Desk</h1>
                    <p className="text-sm text-slate-500 mt-1 m-0">Log corporate settlements, trace reference keys, and review accounting audit validation sheets.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold cursor-pointer border-none shadow-md shadow-emerald-600/10 transition-colors"
                >
                    <Plus size={16} />
                    Record Settlement
                </button>
            </div>

            {/* Real-time search query lookup fields */}
            <div className="relative w-full max-w-[400px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all box-border shadow-sm"
                    placeholder="Filter records by transaction key or invoice reference code..."
                />
            </div>

            {/* Content Display */}
            {filteredPayments.length > 0 ? (
                <PaymentTable payments={filteredPayments} onDelete={handleVoidRequestTrigger} />
            ) : (
                <div className="py-16 px-6 border-2 border-dashed border-slate-200 rounded-xl text-center bg-white">
                    <Landmark size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="m-0 text-base font-bold text-slate-800">Zero Cleared Transactions Logged</h3>
                    <p className="m-0 text-sm text-slate-500 mt-1 mb-5">Record incoming corporate client settlements to trigger dynamic multi-tenant calculations.</p>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold cursor-pointer border-none shadow-md transition-colors"
                    >
                        Record First Payment
                    </button>
                </div>
            )}

            {/* Record Payment Form Modal */}
            {isModalOpen && (
                <PaymentForm 
                    onSubmit={handleRecordPaymentSubmit} 
                    onClose={() => setIsModalOpen(false)} 
                    submitting={recordPaymentMutation.isPending} 
                />
            )}

            {/* Void Request Reason Form Modal */}
            {selectedPayment && (
                <VoidRequestModal
                    payment={selectedPayment}
                    onSubmit={handleVoidRequestSubmit}
                    onClose={() => setSelectedPayment(null)}
                    submitting={createVoidRequestMutation.isPending}
                />
            )}
        </div>
    );
}
