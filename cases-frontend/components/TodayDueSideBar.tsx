'use client';

import axios from '@/lib/axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface Bill {
  id: string;
  customerName: string;
  invoiceNumber: number;
  grandTotal: number;
  dueDate: string;
  date: string;
}

export default function TodayDueSideBar() {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    const fetchDueBills = async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills/by-due-date?date=${today}`
        );
        setBills(res.data);
      } catch (err) {
        console.error("Failed to fetch today's due bills", err);
      }
    };

    fetchDueBills();
  }, []);

  return (
    <aside className="w-64 fixed top-0 left-0 h-screen bg-blue-700 p-4 overflow-y-auto shadow-lg z-50">
      <h2 className="text-xl font-bold text-white mb-4">Today's Due</h2>
      {bills.length === 0 ? (
        <p className="text-white">No due bills today.</p>
      ) : (
        <ul className="space-y-2">
          {bills.map((bill) => (
            <li key={bill.id}>
              <div className="p-2 bg-blue-500 rounded text-white hover:bg-blue-400 transition">
                <p className="font-semibold">{bill.customerName}</p>
                <p>Bill Date: {format(new Date(bill.date), 'dd/MM/yyyy')}</p>
                <p>Invoice #: {bill.invoiceNumber}</p>
                <p>₹ {bill.grandTotal}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
