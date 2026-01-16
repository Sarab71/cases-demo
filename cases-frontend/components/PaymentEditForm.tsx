'use client';

import axios from '@/lib/axios';
import { useEffect, useState, ChangeEvent, KeyboardEvent } from 'react';
import { toast } from 'react-toastify';

interface Payment {
    id: string;
    date: string;
    amount: number;
    description: string;
    customerId: string;
}

interface Customer {
    id: string;
    name: string;
}

interface PaymentEditFormProps {
    paymentId: string;
    onClose: () => void;
    onUpdated: () => void;
}

export default function PaymentEditForm({ paymentId, onClose, onUpdated }: PaymentEditFormProps) {
    const [payment, setPayment] = useState<Payment | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editAmount, setEditAmount] = useState<string>('');
    const [editDate, setEditDate] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>(''); // 👈 New state
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerSearch, setCustomerSearch] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [paymentRes, customerRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/${paymentId}`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers`)
                ]);

                const paymentData = paymentRes.data;
                setPayment(paymentData);
                setEditAmount(paymentData.amount.toString());
                setEditDate(paymentData.date ? paymentData.date.split('T')[0] : '');
                setEditDescription(paymentData.description || '');
                setCustomers(customerRes.data);

                const existingCustomer = customerRes.data.find((c: Customer) => c.id === paymentData.customer.id);

                if (existingCustomer) {
                    setCustomerSearch(existingCustomer.name);
                    setSelectedCustomer(existingCustomer);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load payment or customers.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [paymentId]);

    useEffect(() => {
        if (customerSearch.trim() === '') {
            setFilteredCustomers([]);
            return;
        }

        const filtered = customers.filter((cust) =>
            cust.name.toLowerCase().includes(customerSearch.toLowerCase())
        );
        setFilteredCustomers(filtered);
    }, [customerSearch, customers]);

    const handleCustomerSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomerSearch(e.target.value);
        setSelectedIndex(-1);
    };

    const handleCustomerKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) =>
                prev < filteredCustomers.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredCustomers[selectedIndex]) {
                handleSelectCustomer(filteredCustomers[selectedIndex]);
            } else if (filteredCustomers.length === 1) {
                handleSelectCustomer(filteredCustomers[0]);
            }
        } else if (e.key === 'Escape') {
            setFilteredCustomers([]);
            setSelectedIndex(-1);
        }
    };

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setCustomerSearch(customer.name);
        setFilteredCustomers([]);
    };

    const handleDelete = async () => {
        if (!payment) return;
        const confirmDelete = confirm('Are you sure you want to delete this payment?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/${paymentId}`);
            toast.success('Payment deleted successfully!');
            onUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete payment.');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!payment || !selectedCustomer) {
            toast.error('Please select a customer.');
            return;
        }

        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/${paymentId}`, {
                amount: Number(editAmount),
                date: editDate,
                customerId: selectedCustomer.id,
                description: editDescription,
            });

            toast.success('Payment updated successfully!');
            onUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update payment.');
        }
    };

    if (loading) return <p>Loading payment details...</p>;
    if (!payment) return <p>Payment not found.</p>;

    return (
        <form onSubmit={handleUpdate} className="p-4 bg-gray-50 border mt-4 rounded space-y-4">
            <h3 className="text-lg font-semibold mb-2">Edit Payment</h3>

            <div>
                <label className="block font-medium mb-1">Date</label>
                <input
                    type="date"
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
            </div>

            <div>
                <label className="block font-medium mb-1">Amount</label>
                <input
                    type="number"
                    value={editAmount}
                    onChange={e => setEditAmount(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
            </div>

            <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    className="border p-2 rounded w-full"
                    rows={3}
                    placeholder="Optional description"
                />
            </div>


            <div className="relative">
                <label className="block font-medium mb-1">Customer</label>
                <input
                    type="text"
                    value={customerSearch}
                    onChange={handleCustomerSearch}
                    onKeyDown={handleCustomerKeyDown}
                    placeholder="Search customer"
                    className="border p-2 rounded w-full"
                />
                {filteredCustomers.length > 0 && (
                    <ul className="absolute z-10 bg-white border rounded mt-1 max-h-48 overflow-y-auto shadow-md w-full">
                        {filteredCustomers.map((customer, index) => (
                            <li
                                key={customer.id}
                                onClick={() => handleSelectCustomer(customer)}
                                className={`p-2 cursor-pointer hover:bg-blue-100 ${selectedIndex === index ? 'bg-blue-100' : ''
                                    }`}
                            >
                                {customer.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex gap-2 mt-4">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:cursor-pointer"
                >
                    Update Payment
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:cursor-pointer"
                >
                    Delete Payment
                </button>
            </div>
        </form>
    );
}
