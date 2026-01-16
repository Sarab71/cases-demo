'use client';

import axios from '@/lib/axios';
import { format } from 'date-fns';
import { useState } from 'react';

interface BillItem {
  modelNumber: string;
  quantity: number;
  rate: number;
  discount: number;
  totalAmount: number;
}

interface Bill {
  id: string;
  invoiceNumber: number;
  customerName: string;
  date: string;
  dueDate: string;
  items: BillItem[];
  grandTotal: number;
}

export default function DueDateBills() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBills = async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills/by-due-date?date=${selectedDate}`);
      setBills(res.data);
    } catch (err) {
      console.error('Failed to fetch bills:', err);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Get Bills by Due Date</h2>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-3 py-1"
        />
        <button
          onClick={fetchBills}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Get
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : bills.length === 0 ? (
        <p>No bills found for selected date.</p>
      ) : (
        <div className="space-y-4">
          {bills.map((bill) => (
            <div key={bill.id} className="border p-3 rounded shadow-sm bg-gray-50">
              <p><strong>Invoice #:</strong> {bill.invoiceNumber}</p>
              <p><strong>Customer Name:</strong> {bill.customerName}</p>
              <p><strong>Bill Date:</strong> {format(new Date(bill.date), 'dd/MM/yyyy')}</p>
              <p><strong>Due Date:</strong> {format(new Date(bill.dueDate), 'dd/MM/yyyy')}</p>
              <p><strong>Grand Total:</strong> ₹{bill.grandTotal}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
