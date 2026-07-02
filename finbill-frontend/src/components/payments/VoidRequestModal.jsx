import React from 'react';
import { useForm } from 'react-hook-form';
import { X, ShieldAlert } from 'lucide-react';

export default function VoidRequestModal({ payment, onSubmit, onClose, submitting }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            payment_id: payment.id,
            reason: ''
        }
    });

    return (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-5 box-border">
            <div className="bg-white p-7 rounded-xl w-full max-w-[460px] shadow-xl border border-slate-200/80 flex flex-col gap-5 box-border select-none">
                
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3 items-start">
                        <div className="bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-center justify-center mt-0.5">
                            <ShieldAlert size={18} className="text-amber-600" />
                        </div>
                        <div>
                            <h3 className="m-0 text-base font-extrabold text-slate-950 tracking-tight">
                                Raise Void Ticket Request
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 m-0">
                                This will flag payment <strong className="text-slate-700">{payment.reference_id}</strong> (₹{Number(payment.amount_paid).toLocaleString()}) for administrative rollback review.
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-transparent border-none text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"><X size={16} /></button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 m-0">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">Justification / Reason for Voiding</label>
                        <textarea
                            {...register('reason', { 
                                required: 'Please specify a detailed reason for voiding this ledger entry.',
                                minLength: { value: 10, message: 'Reason must be at least 10 characters long.' }
                            })}
                            className="w-full min-h-[90px] p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all box-border placeholder-slate-400"
                            placeholder="e.g. Bounced cheque, data entry typo error, or double billing correction..."
                        />
                        {errors.reason && <p className="text-xs text-red-500 mt-1 m-0">{errors.reason.message}</p>}
                    </div>

                    <div className="flex gap-3 justify-end mt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 text-sm font-semibold cursor-pointer transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl text-sm font-semibold cursor-pointer shadow-md shadow-indigo-600/10 transition-colors disabled:opacity-50">
                            {submitting ? 'Submitting Ticket...' : 'Submit Void Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
