import React from 'react';

export default function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200/70 flex items-center justify-between flex-1 min-w-[220px] shadow-sm hover-lift cursor-default select-none">
            <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</span>
            </div>
            <div 
                className="p-3.5 rounded-xl flex items-center justify-center border transition-transform duration-300"
                style={{ 
                    backgroundColor: `${color}0c`, 
                    borderColor: `${color}1e` 
                }}
            >
                <Icon size={22} style={{ color: color }} />
            </div>
        </div>
    );
}
