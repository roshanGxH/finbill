import React from 'react';

export default function StatusBadge({ status }) {
    const config = {
        unpaid: { text: 'Unpaid Ledger', bg: '#fef3c7', color: '#d97706' },
        paid: { text: 'Settled', bg: '#d1fae5', color: '#059669' },
        partially_paid: { text: 'Partially Paid', bg: '#dbeafe', color: '#2563eb' },
        overdue: { text: 'Overdue Passed', bg: '#fee2e2', color: '#ef4444' }
    };

    const current = config[status] || { text: status, bg: '#f3f4f6', color: '#4b5563' };

    return (
        <span style={{
            background: current.bg, color: current.color, padding: '4px 10px',
            borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'
        }}>
            {current.text}
        </span>
    );
}
