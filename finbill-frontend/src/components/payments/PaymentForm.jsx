import React from 'react';
import { useForm } from 'react-hook-form';
import { useInvoices } from '../../hooks/useInvoices';

export default function PaymentForm({ onSubmit, onClose, submitting }) {
    const { data: invoices } = useInvoices();
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: { invoice_id: '', amount_paid: '', payment_date: new Date().toISOString().split('T')[0], reference_id: '' }
    });

    // Real-time listener to extract targets invoice amounts validation
    const selectedInvoiceId = watch("invoice_id");
    const activeInvoice = invoices?.find(i => i.id === Number(selectedInvoiceId));

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContents: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', width: '100%', maxWidth: '460px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', boxSizing: 'border-box' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Record Financial Settlement</h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#6b7280' }}>Post incoming payments to reduce client outstanding balance and settle unpaid invoice ledgers.</p>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '5px' }}>Select Target Invoice Statement</label>
                        <select {...register('invoice_id', { required: 'Please select a valid statement record' })} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: '#fff' }}>
                            <option value="">-- Choose Unpaid Statements --</option>
                            {invoices?.filter(i => i.status !== 'paid').map(i => (
                                <option key={i.id} value={i.id}>{i.invoice_number} - {i.client?.client_name} (Total: ₹{Number(i.total_amount).toLocaleString()})</option>
                            ))}
                        </select>
                        {errors.invoice_id && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.invoice_id.message}</p>}
                    </div>

                    {/* Live Accounting Summary Box Layout Indicators */}
                    {activeInvoice && (
                        <div style={{ background: '#f8fafc', padding: '12px 15px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Invoice Billed Value:</span><strong style={{ color: '#1e293b' }}>₹{Number(activeInvoice.total_amount).toLocaleString()}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Invoice Current Status:</span><strong style={{ color: '#ef4444', textTransform: 'uppercase' }}>{activeInvoice.status}</strong></div>
                        </div>
                    )}

                    {/* Updated Overpayment Security Check Block */}
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '5px' }}>Realized Amount Paid (₹)</label>
                        <input 
                            type="number" step="0.01"
                            {...register('amount_paid', { 
                                required: 'Payment settlement amount is required', 
                                min: { value: 0.01, message: 'Amount must be greater than zero' },
                                validate: value => {
                                    if (!activeInvoice) return true;
                                    const maxAllowed = Number(activeInvoice.total_amount);
                                    return Number(value) <= maxAllowed || `Payment cannot exceed the outstanding invoice total of ₹${maxAllowed.toLocaleString()}`;
                                }
                            })}
                            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                            placeholder="399"
                        />
                        {errors.amount_paid && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.amount_paid.message}</p>}
                    </div>

                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '5px' }}>Payment Reference / Transaction ID</label>
                        <input 
                            type="text"
                            {...register('reference_id', { required: 'Transaction Reference ID (e.g. PAY123) is required' })}
                            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                            placeholder="PAY-TXN-99882"
                        />
                        {errors.reference_id && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.reference_id.message}</p>}
                    </div>

                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '5px' }}>Settlement Clearance Date</label>
                        <input type="date" {...register('payment_date', { required: true })} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', color: '#4b5563', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={submitting} style={{ padding: '10px 16px', background: '#10b981', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                            {submitting ? 'Posting Double Entries...' : 'Clear Balance Ledger'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
