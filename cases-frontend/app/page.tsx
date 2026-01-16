"use client";

import PaymentsReceived from '@/components/PaymentsReceived';
import TodayDueSidebar from '@/components/TodayDueSideBar';
import TotalExpenses from '@/components/TotalExpenses';
import TotalOutstanding from '@/components/TotalOutstanding';
import TotalSales from '@/components/TotalSales';
import axios from '@/lib/axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalSales, setTotalSales] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

const handleBackupDownload = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKUP_API_URL}/api/backup`,
      {
        responseType: 'blob', // important for binary file like ZIP
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mongodb-backup.zip');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Backup download failed:', error);
    alert('Failed to download backup.');
  }
};

  useEffect(() => {
    async function fetchTotals() {
      const params = new URLSearchParams();

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        params.append('startDate', start.toISOString().split('T')[0]);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        params.append('endDate', end.toISOString().split('T')[0]);

      }

      try {
        const [salesRes, paymentsRes, expensesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sales/total?${params}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/total?${params}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/expenses/total?${params}`),//rollback
        ]);

        setTotalSales(salesRes.data.totalSales || 0);
        setTotalPayments(paymentsRes.data.totalPayment || 0);
        setTotalExpenses(expensesRes.data.totalExpenses || 0);
      } catch (err) {
        console.error('Failed to fetch totals:', err);
      }
    }

    fetchTotals();
  }, [startDate, endDate]);

  const totalOutstanding = totalSales - totalPayments;

  return (
    <div className="flex">
      {/* Sidebar */}
      <TodayDueSidebar />

      {/* Main Content */}
      <main className="ml-64 p-4 w-full">
        <h1 className="text-center text-2xl font-bold mb-2">Welcome to the Billing System</h1>
        <p className="text-center mb-8">Manage your bills and payments efficiently.</p>

        <div className="flex justify-center gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border rounded p-1"
              max={endDate || undefined}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border rounded p-1"
              min={startDate || undefined}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <TotalOutstanding value={totalOutstanding} />
          <Link href="/payments">
            <PaymentsReceived value={totalPayments} />
          </Link>
          <TotalSales value={totalSales} />
          <TotalExpenses value={totalExpenses} />
        </div>
        <div className="flex justify-center my-4">
          <button
            onClick={handleBackupDownload}
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition duration-300 cursor-pointer"
          >
            Download Backup
          </button>
        </div>

      </main>
    </div>
  );
}