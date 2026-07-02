import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useClients } from '../../hooks/useClients';
import { useCreateInvoice } from '../../hooks/useInvoices';
import { Plus, Trash, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateInvoice({ onClose }) {
    const { data: clients } = useClients();
    const createInvoiceMutation = useCreateInvoice();

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            client_id: '',
            due_date: '',
            items: [{ description: '', quantity: '', unit_price: '' }]
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const watchedItems = watch("items");
    const grandTotal = watchedItems?.reduce((acc, current) => {
        const qty = Math.max(0, Number(current?.quantity) || 0);
        const price = Math.max(0, Number(current?.unit_price) || 0);
        return acc + (qty * price);
    }, 0) || 0;

    const onFormSubmit = (formData) => {
        createInvoiceMutation.mutate(formData, {
            onSuccess: () => {
                toast.success('Atomic billing ledger invoice synchronized successfully!');
                onClose();
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || 'Server pipeline constraint error.');
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-5 box-border">
            <div className="bg-white p-[30px] rounded-xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto flex flex-col gap-6 shadow-xl box-border">
                
                <div className="flex items-center gap-4">
                    <button type="button" onClick={onClose} className="bg-white border border-gray-200 p-2 rounded-full cursor-pointer flex items-center hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={16} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 m-0">Automated Billing Invoice Constructor</h1>
                        <p className="text-xs text-gray-500 mt-0.5 m-0">Generate live multi-item account statements directly map with customers balances.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5 m-0">
                    <div className="flex flex-wrap gap-5 bg-white p-6 rounded-lg border border-gray-200">
                        <div className="flex-1 min-w-[250px]">
                            <label className="text-xs font-medium text-gray-700 block mb-1">Link Customer Corporate Profile</label>
                            <select {...register('client_id', { required: 'Customer target wrapper link required' })} className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">-- Choose Target Profiles Context --</option>
                                {clients?.map(c => (
                                    <option key={c.id} value={c.id}>{c.client_name} (Bal: ₹{Number(c.current_balance).toLocaleString()})</option>
                                ))}
                            </select>
                            {errors.client_id && <p className="text-red-500 text-xs mt-1 m-0">{errors.client_id.message}</p>}
                        </div>
                        <div className="flex-1 min-w-[250px]">
                            <label className="text-xs font-medium text-gray-700 block mb-1">Statement Due Date Limit</label>
                            <input type="date" {...register('due_date', { required: 'Due parameters date required' })} className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            {errors.due_date && <p className="text-red-500 text-xs mt-1 m-0">{errors.due_date.message}</p>}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col gap-4 w-full box-border">
                        <h3 className="m-0 text-sm font-bold text-gray-900">Invoice Ledger Item List</h3>
                        
                        <div className="flex flex-col gap-3 w-full">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex flex-row items-center gap-4 w-full">
                                    
                                    <div className="flex-auto min-w-[150px]">
                                        <input 
                                            type="text" 
                                            {...register(`items.${index}.description`, { required: 'Description required' })} 
                                            placeholder="Service description" 
                                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm box-border focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        />
                                    </div>

                                    <div className="w-[80px] flex-none">
                                        <input
                                            type="number"
                                            min="1"
                                            {...register(`items.${index}.quantity`, { required: true, min: 1 })}
                                            placeholder="Qty"
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === '.' || e.key === 'e' || e.key === 'E') e.preventDefault();
                                            }}
                                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm box-border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="w-[130px] flex-none">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...register(`items.${index}.unit_price`, { required: true, min: 0 })}
                                            placeholder="Unit Price (₹)"
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E') e.preventDefault();
                                            }}
                                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm box-border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="w-[100px] flex-none text-sm font-bold text-gray-600 text-right">
                                        ₹{((Math.max(0, Number(watchedItems?.[index]?.quantity) || 0)) * (Math.max(0, Number(watchedItems?.[index]?.unit_price) || 0))).toLocaleString()}
                                    </div>

                                    <div className="w-[30px] flex-none flex justify-center">
                                        {fields.length > 1 && (
                                            <button type="button" onClick={() => remove(index)} className="bg-transparent border-none text-red-500 py-2.5 cursor-pointer hover:text-red-700 transition-colors"><Trash size={16} /></button>
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>

                        <button type="button" onClick={() => append({ description: '', quantity: '', unit_price: '' })} className="flex items-center gap-1.5 w-fit bg-transparent border border-dashed border-blue-500 text-blue-500 px-3.5 py-2 rounded-md text-xs font-semibold cursor-pointer mt-1 hover:bg-blue-50 transition-colors">
                            <Plus size={14} /> Add Line Item
                        </button>
                    </div>

                    <div className="flex justify-between items-center bg-slate-800 text-white px-7 py-5 rounded-lg">
                        <div className="text-sm text-slate-300">Cumulative Statement Total Amount:</div>
                        <div className="text-2xl font-bold">₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>

                    <div className="flex gap-4 justify-end mt-1.5">
                        <button type="button" onClick={onClose} className="px-6 py-3 bg-white border border-gray-300 rounded-md text-gray-600 text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors">Discard Constructor</button>
                        <button type="submit" disabled={createInvoiceMutation.isPending} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-md text-sm font-semibold cursor-pointer shadow-md transition-colors disabled:opacity-50">
                            {createInvoiceMutation.isPending ? 'Executing Ledger Pipeline...' : 'Finalize & Post Invoice'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
