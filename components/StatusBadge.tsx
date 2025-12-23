
import React from 'react';
import { BookingStatus } from '../types';

interface StatusBadgeProps {
  status: BookingStatus | 'PAID' | 'UNPAID';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'COMPLETED':
      case 'PAID':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PROCESSING':
      case 'COLLECTED':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'PENDING':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'UNPAID':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`text-[11px] font-bold px-2 py-1 rounded-md border ${getStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
