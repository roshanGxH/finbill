import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, FileText, CreditCard, LogOut, Building2, ClipboardList, X, Menu } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Clients', path: '/dashboard/clients', icon: Users },
        { name: 'Invoices', path: '/dashboard/invoices', icon: FileText },
        { name: 'Payments', path: '/dashboard/payments', icon: CreditCard },
        { name: 'Ticket Desk', path: '/dashboard/tickets', icon: ClipboardList },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Blur Overlay Backdrop (Hidden on Desktop) */}
            {isOpen && (
                <div 
                    onClick={onClose} 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
                />
            )}

            {/* Sidebar drawer body (Fixed height viewport, hidden/shown via translation) */}
            <div className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-slate-950 text-slate-100 flex flex-col h-screen border-r border-slate-900 select-none transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {/* Header / Brand */}
                <div className="h-[65px] px-6 border-b border-slate-900 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
                            <Building2 size={20} className="text-indigo-400" />
                        </div>
                        <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            FinBill Corporate
                        </span>
                    </div>
                    {/* Toggle/Collapse Menu Button */}
                    <button 
                        onClick={onClose} 
                        className="bg-transparent border-none text-slate-400 hover:text-slate-200 cursor-pointer p-1 transition-colors flex items-center justify-center"
                        title="Collapse Menu"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 flex flex-col gap-1.5 p-4 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink 
                                key={item.name} 
                                to={item.path}
                                end={item.path === '/dashboard'}
                                onClick={() => {
                                    // Only auto-close on mobile screens when a link is clicked
                                    if (window.innerWidth < 1024) {
                                        onClose();
                                    }
                                }}
                                className={({ isActive }) => 
                                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                        isActive 
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200 transition-colors'} />
                                        <span>{item.name}</span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                {/* Logout Footer Section */}
                <div className="p-4 border-t border-slate-900 bg-slate-950/50">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-transparent hover:bg-red-500/5 text-red-400 hover:text-red-300 border-none cursor-pointer text-sm font-medium transition-all duration-200"
                    >
                        <LogOut size={18} />
                        <span>Logout Account</span>
                    </button>
                </div>
            </div>
        </>
    );
}
