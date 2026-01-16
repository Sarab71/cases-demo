'use client';
import axios from '@/lib/axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function AddCustomerForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/customers', {
        name,
        phone,
        address,
      });

      toast.success('Customer added successfully!');
      setName('');
      setPhone('');
      setAddress('');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Something went wrong.';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-2">Add Customer</h2>

      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block font-medium">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block font-medium">Address</label>
        <textarea
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer"
      >
        Add Customer
      </button>
    </form>
  );
}
