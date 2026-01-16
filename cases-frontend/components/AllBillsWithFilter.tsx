'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { format } from 'date-fns';
import Link from 'next/link';

interface Bill {
    id: string;
    customerName: string;
    invoiceNumber: number;
    date: string;
    grandTotal: number;
}

export default function AllBillsWithFilter() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        async function fetchBills() {
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
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills?${params}`
                );
                setBills(response.data);
            } catch (err) {
                console.error('Failed to fetch bills:', err);
            }
        }

        fetchBills();
    }, [startDate, endDate]);

    return (
        <div className="space-y-6">
            {/* Date Filters */}
            <div className="flex items-center gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded px-3 py-1 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded px-3 py-1 text-sm"
                    />
                </div>
            </div>

            {/* Table of Bills */}
            {bills.length === 0 ? (
                <p className="text-center text-gray-500">No bills found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-gray-300">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-4 py-2 border-b">Invoice No</th>
                                <th className="px-4 py-2 border-b">Customer</th>
                                <th className="px-4 py-2 border-b">Date</th>
                                <th className="px-4 py-2 border-b">Grand Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <tr key={bill.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b text-blue-600 underline">
                                        <Link href={`/edit-bill/${bill.id}`}>
                                            {bill.invoiceNumber}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2 border-b">{bill.customerName}</td>
                                    <td className="px-4 py-2 border-b">{format(new Date(bill.date), 'dd/MM/yyyy')}</td>
                                    <td className="px-4 py-2 border-b">₹{bill.grandTotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
