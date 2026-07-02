import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function ClientForm({ client, onSubmit, onClose, submitting }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (client) {
            reset({
                client_name: client.client_name,
                email: client.email || ''
            });
        } else {
            reset({ client_name: '', email: '' });
        }
    }, [client, reset]);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', width: '100%', maxWidth: '450px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
                    {client ? 'Modify Corporate Client Details' : 'Onboard New Corporate Client'}
                </h3>
                
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '5px' }}>Client/Company Name</label>
                        <input 
                            type="text"
                            {...register('client_name', { required: 'Client name is strictly required' })}
                            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                            placeholder="ABC Solutions Inc"
                        />
                        {errors.client_name && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.client_name.message}</p>}
                    </div>

                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '5px' }}>Email Address</label>
                        <input 
                            type="email"
                            {...register('email', { required: 'Communication billing email is required' })}
                            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                            placeholder="billing@abc.com"
                        />
                        {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.email.message}</p>}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', color: '#4b5563', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={submitting} style={{ padding: '10px 16px', background: '#3b82f6', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                            {submitting ? 'Processing Ledger Sync...' : client ? 'Apply Changes' : 'Save & Active'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
