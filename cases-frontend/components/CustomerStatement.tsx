'use client';

import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';


interface Transaction {
    id: string;
    date: string;
    type?: 'debit' | 'credit'; // type optional, as it may not be present
    amount?: number;
    description?: string;
    relatedBillId?: string;
    invoiceNumber?: number;
    particulars?: string;
    debit?: number;
    credit?: number;
    balance: number;
}

interface Props {
    customerId: string;
    customerName: string;
}

export default function CustomerStatement({ customerId, customerName }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const router = useRouter();

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0); // Start of day  hard reset
                params.append('startDate', start.toISOString().split('T')[0]);
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // End of day
                params.append('endDate', end.toISOString().split('T')[0]);
            }

            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/${customerId}/statement?${params}`;
            const res = await axios.get(url);
            setTransactions(res.data);
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        } finally {
            setLoading(false);
        }
    }, [customerId, startDate, endDate]);


    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleInvoiceClick = (billId?: string | null) => {
        if (billId) {
            router.push(`/edit-bill/${billId}`);
        }
    };

    const handlePaymentClick = (paymentId?: string | null) => {
        if (paymentId) {
            router.push(`/edit-payment/${paymentId}`);
        }
    };


    const downloadStatementPdf = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_PDF_API_URL}/generate-statement`,
                {
                    customerName,
                    transactions,
                },
                {
                    responseType: 'blob',
                }
            );

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `Statement_${customerName.replace(/\s+/g, '_')}.pdf`;
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download statement PDF:', error);
            alert('Failed to download statement PDF');
        }
    };


    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Statement of {customerName}</h2>

            <div className="flex flex-wrap gap-4 items-center mb-4">
                <div>
                    <label className="block text-sm font-medium">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </div>
            </div>



            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Particulars</th>
                                <th className="border p-2 text-right">Debit (₹)</th>
                                <th className="border p-2 text-right">Credit (₹)</th>
                                <th className="border p-2 text-right">Balance (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn, index) => {
                                const date = new Date(txn.date).toLocaleDateString('en-GB'); // gives dd-MM-yyyy
                                const debit = txn.debit ? Number(txn.debit).toFixed(2) : '';
                                const credit = txn.credit ? Number(txn.credit).toFixed(2) : '';
                                const balance = Number(txn.balance).toFixed(2);

                                // Payment row logic: credit present and no relatedBillId
                                const isPayment = !!txn.credit && !txn.relatedBillId;

                                return (
                                    <tr key={txn.id || index}>
                                        <td className="border p-2">{date}</td>
                                        <td
                                            className={`border p-2 ${txn.relatedBillId
                                                ? 'text-blue-600 cursor-pointer hover:underline'
                                                : isPayment
                                                    ? 'text-green-600 cursor-pointer hover:underline'
                                                    : ''
                                                }`}
                                            onClick={() => {
                                                if (txn.relatedBillId) {
                                                    handleInvoiceClick(txn.relatedBillId);
                                                } else if (isPayment && txn.id) {
                                                    handlePaymentClick(txn.id);
                                                }
                                            }}
                                        >
                                            {txn.invoiceNumber
                                                ? `Invoice #${txn.invoiceNumber}`
                                                : isPayment
                                                    ? 'Payment Received'
                                                    : txn.particulars}
                                        </td>
                                        <td className="border p-2 text-right">{debit}</td>
                                        <td className="border p-2 text-right">{credit}</td>
                                        <td className="border p-2 text-right">{balance}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <button
                        onClick={downloadStatementPdf}
                        className="mt-4 mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                    >
                        Download Statement PDF
                    </button>
                </>
            )}
        </div>
    );
}