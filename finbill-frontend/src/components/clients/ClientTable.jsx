import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function ClientTable({ clients, onEdit, onDelete }) {
    if (!clients || clients.length === 0) {
        return null;
    }

    return (
        <div className="w-full overflow-x-auto bg-white border border-slate-200/70 rounded-xl shadow-sm">
            <table className="w-full border-collapse text-left text-sm m-0 min-w-[500px] select-none">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider">Client/Company Name</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider">Email Address</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider text-right">Outstanding Balance</th>
                        <th className="px-6 py-4 text-slate-500 font-bold tracking-wider text-center">Actions Matrix</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {clients.map((client) => (
                        <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-slate-900 font-semibold">{client.client_name}</td>
                            <td className="px-6 py-4 text-slate-600">{client.email || 'N/A'}</td>
                            <td className={`px-6 py-4 font-bold text-right ${Number(client.current_balance) > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                ₹{Number(client.current_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-4 justify-center items-center">
                                    <button 
                                        onClick={() => onEdit(client)} 
                                        className="bg-transparent border-none text-indigo-600 hover:text-indigo-800 cursor-pointer p-1 transition-colors"
                                        title="Edit Profile"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(client.id)} 
                                        className="bg-transparent border-none text-red-500 hover:text-red-700 cursor-pointer p-1 transition-colors"
                                        title="Delete Client"
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
