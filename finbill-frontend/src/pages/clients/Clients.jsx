import React, { useState } from 'react';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../../hooks/useClients';
import ClientTable from '../../components/clients/ClientTable';
import ClientForm from '../../components/clients/ClientForm';
import { Plus, Search, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Clients() {
    const { data: clients, isLoading } = useClients();
    const createClientMutation = useCreateClient();
    const updateClientMutation = useUpdateClient();
    const deleteClientMutation = useDeleteClient();

    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const handleOpenAddModal = () => {
        setSelectedClient(null);
        setIsFormOpen(true);
    };

    const handleOpenEditModal = (client) => {
        setSelectedClient(client);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (selectedClient) {
                await updateClientMutation.mutateAsync({ id: selectedClient.id, payload: formData });
                toast.success('Corporate client ledger metrics updated successfully.');
            } else {
                await createClientMutation.mutateAsync(formData);
                toast.success('New active corporate client registered inside workspace.');
            }
            setIsFormOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Server structural pipeline constraint block failed.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete confirmation: Are you sure you want to completely purge this client context ledger record? This action cannot be undone.')) {
            try {
                await deleteClientMutation.mutateAsync(id);
                toast.success('Client ledger row purged successfully.');
            } catch (err) {
                toast.error(err.response?.data?.message || 'Cascade protection safety constraint blocked deletion.');
            }
        }
    };

    // Client-side real-time matching query filtering engine
    const filteredClients = clients?.filter(client => 
        client.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <h3 className="text-lg text-indigo-600 font-semibold animate-pulse">Loading Client Directory Sheets...</h3>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 select-none">
            {/* Header Layout */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 m-0">Corporate Clients Registry</h1>
                    <p className="text-sm text-slate-500 mt-1 m-0">Manage customer profiles, billing data, and outstanding credit balances.</p>
                </div>
                <button 
                    onClick={handleOpenAddModal} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold border-none cursor-pointer shadow-md shadow-indigo-600/10 transition-colors"
                >
                    <Plus size={16} />
                    Onboard Client
                </button>
            </div>

            {/* Advanced Filters Node Row */}
            <div className="relative w-full max-w-[400px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all box-border shadow-sm"
                    placeholder="Search clients by entity name or mail routing..."
                />
            </div>

            {/* Render Main Content Sheets Table / Empty State Layout */}
            {filteredClients.length > 0 ? (
                <ClientTable clients={filteredClients} onEdit={handleOpenEditModal} onDelete={handleDelete} />
            ) : (
                <div className="py-16 px-6 border-2 border-dashed border-slate-200 rounded-xl text-center bg-white">
                    <FolderOpen size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="m-0 text-base font-bold text-slate-800">No Corporate Context Matches Found</h3>
                    <p className="m-0 text-sm text-slate-500 mt-1 mb-5">Create your first customer node to safely trigger dynamic invoices pipelines.</p>
                    <button 
                        onClick={handleOpenAddModal} 
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold cursor-pointer border-none shadow-md transition-colors"
                    >
                        Add Client Profiles
                    </button>
                </div>
            )}

            {/* Modal Form */}
            {isFormOpen && (
                <ClientForm 
                    client={selectedClient} 
                    onSubmit={handleFormSubmit} 
                    onClose={() => setIsFormOpen(false)} 
                    submitting={createClientMutation.isPending || updateClientMutation.isPending} 
                />
            )}
        </div>
    );
}
