'use client';

import axios from '@/lib/axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
}

interface EditCustomerFormProps {
  customerId: string;
  onClose: () => void;
  onUpdated: (updatedName: string) => void;
}

export default function EditCustomerForm({ customerId, onClose, onUpdated }: EditCustomerFormProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/${customerId}`);
        const data = res.data;
        setCustomer(data);
        setName(data.name);
        setPhone(data.phone);
        setAddress(data.address);
      } catch (err) {
        console.error('❌ Error fetching customer:', err);
        toast.error('Something went wrong while fetching customer.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/${customerId}`,
        { name, phone, address }
      );

      toast.success('Customer updated successfully!');
      onUpdated(name);
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update customer.';
      toast.error(errorMessage);
    }
  };

  if (loading) return <p>Loading customer details...</p>;
  if (!customer) return <p>Customer not found.</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border rounded space-y-4 max-w-md mx-auto">
      <h3 className="text-lg font-semibold">Edit Customer</h3>

      <div>
        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Address</label>
        <textarea
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded hover:cursor-pointer">Update</button>
        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-3 py-1 rounded hover:cursor-pointer">Cancel</button>
      </div>
    </form>
  );
}
