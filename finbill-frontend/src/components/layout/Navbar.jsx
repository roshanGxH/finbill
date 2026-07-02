import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, ShieldCheck, Menu } from 'lucide-react';

export default function Navbar({ onMenuClick, isSidebarOpen }) {
    const { user } = useAuth();

    return (
        <div className="h-[65px] bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
            {/* Left Header - Hamburger Toggle & Workspace Badge Context */}
            <div className="flex items-center gap-3">
                {!isSidebarOpen && (
                    <button 
                        onClick={onMenuClick}
                        className="flex items-center justify-center p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-lg border-none bg-transparent cursor-pointer transition-colors"
                        title="Toggle Menu"
                    >
                        <Menu size={20} />
                    </button>
                )}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:inline">Workspace:</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold border border-indigo-100/50 truncate max-w-[120px] sm:max-w-none">
                        {user?.company?.name || 'Default Tenant'}
                    </span>
                </div>
            </div>

            {/* Right Header - User Profile badge */}
            <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <ShieldCheck size={12} className="text-emerald-500" /> <span className="hidden xs:inline">Authorized Operator</span>
                    </span>
                    <span className="font-bold text-slate-800 leading-tight text-xs sm:text-sm">{user?.name}</span>
                </div>
                <div className="bg-slate-100 p-2 rounded-full border border-slate-200 flex items-center justify-center shadow-inner hover:bg-slate-200 transition-colors">
                    <User size={14} className="text-slate-600 sm:w-4 sm:h-4" />
                </div>
            </div>
        </div>
    );
}
