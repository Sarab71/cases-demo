'use client';

import axios from '@/lib/axios';
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Payment {
    id: string;
    amount: number;
    date: string;
    description?: string;
    customer: {
        name: string;
    };
}

const AllPaymentsWithFilter = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        async function fetchPayments() {
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
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/all?${params}`
                );
                const sorted = response.data.payments.sort(
                    (a: Payment, b: Payment) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );

                setPayments(sorted);
            } catch (err) {
                console.error('Failed to fetch payments:', err);
            }
        }

        fetchPayments();
    }, [startDate, endDate]);


    return (
        <div>
            <h2 className="text-xl font-bold mb-4">All Payments</h2>

            {/* Date Filters */}
            <div className="flex gap-4 mb-4">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            {/* Table */}
            <table className="min-w-full table-auto border mt-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Customer Name</th>
                        <th className="border px-4 py-2 text-left">Amount</th>
                        <th className="border px-4 py-2 text-left">Date</th>
                        <th className="border px-4 py-2 text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.id}>
                            <td className="border px-4 py-2">{payment.customer?.name || 'N/A'}</td>
                            <td className="border px-4 py-2 text-blue-500 hover:underline cursor-pointer">
                                <Link href={`/edit-payment/${payment.id}`}>
                                    ₹{payment.amount}
                                </Link>
                            </td>

                            <td className="border px-4 py-2">{format(new Date(payment.date), 'dd/MM/yyyy')}</td>
                            <td className="border px-4 py-2">{payment.description || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default AllPaymentsWithFilter;
