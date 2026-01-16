'use client';

import axios from '@/lib/axios';
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface Customer {
  id: string;
  name: string;
}

export default function AddPaymentForm() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const searchRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get<Customer[]>('/customers'); // baseURL already set
        setCustomers(res.data);
      } catch (err) {
        toast.error('Failed to load customers.');
      }
    };

    fetchCustomers();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredCustomers([]);
      return;
    }

    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prev) =>
        prev < filteredCustomers.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredCustomers.length) {
        handleSelectCustomer(filteredCustomers[selectedIndex]);
      }
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchTerm(customer.name);
    setFilteredCustomers([]);
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer) {
      toast.error('Please select a customer.');
      return;
    }

    try {
      await axios.post('/payments', {
        customerId: selectedCustomer.id,
        amount: Number(amount),
        description,
        date,
      });

      toast.success('Payment added successfully!');
      setSelectedCustomer(null);
      setSearchTerm('');
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to add payment.';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4 relative">
      <h2 className="text-xl font-bold mb-2">Add Payment</h2>

      <div className="relative">
        <label className="block font-medium">Search Customer</label>
        <input
          ref={searchRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="Start typing customer name"
          className="w-full border rounded p-2"
        />

        {filteredCustomers.length > 0 && (
          <ul className="absolute z-10 w-full border border-gray-300 rounded mt-1 bg-white max-h-40 overflow-y-auto shadow">
            {filteredCustomers.map((customer, index) => (
              <li
                key={customer.id}
                className={`p-2 cursor-pointer ${index === selectedIndex ? 'bg-blue-100' : ''}`}
                onClick={() => handleSelectCustomer(customer)}
              >
                {customer.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="block font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Cash payment"
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 cursor-pointer"
      >
        Add Payment
      </button>
    </form>
  );
}
