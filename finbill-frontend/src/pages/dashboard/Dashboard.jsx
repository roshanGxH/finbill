import React from 'react';
import { useDashboardStats, useDashboardRevenue } from '../../hooks/useDashboard';
import StatCard from '../../components/layout/StatCard';
import { Users, FileText, CheckCircle, AlertTriangle, Wallet } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

export default function Dashboard() {
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: revenue, isLoading: revenueLoading } = useDashboardRevenue();

    if (statsLoading || revenueLoading) {
        return (
            <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '18px', color: '#3b82f6', fontWeight: '600' }}>Compiling Accounting Intelligence Matrix...</h3>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Financial Intelligence Control Center</h1>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Real-time business performance analytics ledger status.</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <StatCard title="Total Active Clients" value={stats?.total_clients || 0} icon={Users} color="#3b82f6" />
                <StatCard title="Total Invoices Billed" value={stats?.total_invoices || 0} icon={FileText} color="#6366f1" />
                <StatCard title="Settled Invoices" value={stats?.paid_invoices || 0} icon={CheckCircle} color="#10b981" />
                <StatCard title="Overdue Invoices" value={stats?.overdue_invoices || 0} icon={AlertTriangle} color="#f59e0b" />
                <StatCard title="Outstanding Balance" value={`₹${Number(stats?.outstanding_balance || 0).toLocaleString()}`} icon={Wallet} color="#ef4444" />
            </div>

            <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #e5e7eb', marginTop: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>Monthly Realized Revenue Trends</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={revenue || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                            <Tooltip cursor={{ fill: '#f9fafb' }} />
                            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={45} name="Revenue (₹)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
