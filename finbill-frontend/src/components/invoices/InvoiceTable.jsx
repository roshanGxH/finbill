import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Download, Trash2 } from 'lucide-react';
import * as invoiceApi from '../../api/invoiceApi';
import toast from 'react-hot-toast';

export default function InvoiceTable({ invoices, onDelete }) {
    const [downloadingId, setDownloadingId] = useState(null);

    const handlePdfDownload = async (id, number) => {
        setDownloadingId(id);
        try {
            const blobData = await invoiceApi.downloadInvoicePdf(id);
            const downloadUrl = window.URL.createObjectURL(new Blob([blobData]));
            const linkNode = document.createElement('a');
            linkNode.href = downloadUrl;
            linkNode.setAttribute('download', `invoice-${number}.pdf`);
            document.body.appendChild(linkNode);
            linkNode.click();
            linkNode.parentNode.removeChild(linkNode);
            toast.success('Invoice document sheet streamed successfully!');
        } catch (err) {
            toast.error('Unable to fetch secure binary file stream.');
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="w-full overflow-x-auto bg-white border border-slate-200/70 rounded-xl shadow-sm">
            <table className="w-full border-collapse text-left text-sm m-0 min-w-[600px] select-none">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider">Invoice Ref No</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider">Customer Client</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider">Due Date Limit</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider text-center">Accounting Status</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider text-right">Grand Total</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider text-center">Actions Node</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-slate-900 font-bold">{inv.invoice_number}</td>
                            <td className="px-6 py-4 text-slate-600 font-medium">{inv.client?.client_name || 'Purged Client Profile'}</td>
                            <td className="px-6 py-4 text-slate-500">{inv.due_date}</td>
                            <td className="px-6 py-4 text-center">
                                <StatusBadge status={inv.status} />
                            </td>
                            <td className="px-6 py-4 font-bold text-right text-slate-800">
                                ₹{Number(inv.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-4 justify-center items-center">
                                    <button 
                                        onClick={() => handlePdfDownload(inv.id, inv.invoice_number)} 
                                        disabled={downloadingId === inv.id}
                                        className="bg-transparent border-none text-indigo-600 hover:text-indigo-800 cursor-pointer p-1 transition-colors disabled:opacity-50"
                                        title="Download PDF"
                                    >
                                        <Download 
                                            size={16} 
                                            className={downloadingId === inv.id ? 'animate-spin' : ''} 
                                        />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(inv.id)} 
                                        className="bg-transparent border-none text-red-500 hover:text-red-700 cursor-pointer p-1 transition-colors"
                                        title="Purge Record"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
