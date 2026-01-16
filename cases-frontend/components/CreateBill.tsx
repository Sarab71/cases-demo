'use client';

import axios from '@/lib/axios';
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Item {
  modelNumber: string;
  quantity: string;
  rate: string;
  discount: string;
}

interface Customer {
  id: string;
  name: string;
  address: string;
}

export default function CreateBillForm() {
  const [billDate, setBillDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState<number>(1);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<Item[]>([{ modelNumber: '', quantity: '', rate: '', discount: '' }]);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [totalQty, setTotalQty] = useState<number>(0);

  const fetchNextInvoiceNumber = async () => {
    try {
      const res = await axios.get('/bills/next-invoice-number');
      setInvoiceNumber(res.data);
    } catch (err) {
      console.error('Failed to fetch invoice number', err);
    }
  };

  useEffect(() => {
    fetchNextInvoiceNumber();
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, []);


  const fetchCustomers = async () => {
    try {
      const res = await axios.get<Customer[]>('/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error("❌ Error fetching customers:", error);
    }
  };


  const handleCustomerSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setCustomerSearch(term);
    setSelectedIndex(-1);

    if (!term.trim()) {
      setFilteredCustomers([]);
      return;
    }

    setFilteredCustomers(
      customers.filter((c) => c.name.toLowerCase().includes(term.toLowerCase()))
    );
  };

  const handleCustomerKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCustomers.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectCustomer(filteredCustomers[selectedIndex]);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setFilteredCustomers([]);
  };

  const handleItemChange = (index: number, field: keyof Item, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
    calculateGrandTotal(updatedItems);
  };

  const calculateGrandTotal = (itemsList: Item[]) => {
    let grandTotal = 0;
    let quantityTotal = 0;

    for (const item of itemsList) {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const discount = Number(item.discount) || 0;

      const discountAmount = (rate * discount) / 100;
      const netPrice = rate - discountAmount;
      const itemTotal = netPrice * quantity;

      grandTotal += itemTotal;
      quantityTotal += quantity;
    }

    setGrandTotal(Math.round(grandTotal));
    setTotalQty(quantityTotal);
  };


  const handleAddItem = () => {
    setItems([...items, { modelNumber: '', quantity: '', rate: '', discount: '' }]);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateGrandTotal(updatedItems);
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setCustomerSearch('');
    setItems([{ modelNumber: '', quantity: '', rate: '', discount: '' }]);
    setGrandTotal(0);
  };

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();
    if (!selectedCustomer) {
      toast.error('Please select a customer before creating the bill');
      return;
    }

    // ✅ Calculate totalAmount per item
    const processedItems = items.map((item) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const discount = Number(item.discount) || 0;
      const discountAmount = (rate * discount) / 100;
      const netPrice = rate - discountAmount;
      const totalAmount = netPrice * quantity;

      return {
        ...item,
        totalAmount: Number(totalAmount.toFixed(2)),
      };
    });

    const payload = {
      customerId: selectedCustomer.id,   // 🔴 Required for backend
      invoiceNumber,
      date: billDate,
      items: processedItems,
      grandTotal,
      totalQty,
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Bill created successfully');
      resetForm();
      setBillDate(new Date().toISOString().split('T')[0]);
      await fetchNextInvoiceNumber();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create bill');
    }
  };

  const downloadPdf = async () => {
    if (!selectedCustomer) {
      toast.error('Please select customer first');
      return;
    }

    const processedItems = items.map((item) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const rawDiscount = item.discount;
      const discount = isNaN(Number(rawDiscount)) ? 0 : Number(rawDiscount);
      const discountAmount = (rate * discount) / 100;
      const netPrice = rate - discountAmount;
      const totalAmount = netPrice * quantity;

      return {
        ...item,
        totalAmount: Number(totalAmount.toFixed(2)),
        discount: !discount ? "" : discount,
      };
    });

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_PDF_API_URL}/generate-pdf`,
        {
          invoiceNumber,
          customer: selectedCustomer,
          items: processedItems,
          grandTotal,
          totalQty,
          date: new Date(billDate).toLocaleDateString(),
        },
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${invoiceNumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded space-y-6">
      <h2 className="text-2xl font-bold text-center">Create Bill</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Invoice Number</label>
          <input
            value={invoiceNumber}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Bill Date</label>
          <input
            type="date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div className="relative">
        <label className="block font-medium mb-1">Search Customer</label>
        <input
          type="text"
          value={customerSearch}
          onChange={handleCustomerSearch}
          onKeyDown={handleCustomerKeyDown}
          placeholder="Type customer name"
          className="w-full border p-2 rounded"
        />

        {filteredCustomers.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-48 overflow-y-auto shadow-lg">
            {filteredCustomers.map((customer, idx) => (
              <li
                key={customer.id}
                onClick={() => handleSelectCustomer(customer)}
                className={`p-2 cursor-pointer ${idx === selectedIndex ? 'bg-blue-100' : ''}`}
              >
                {customer.name} - {customer.address}
              </li>
            ))}
          </ul>
        )}
      </div>


      {selectedCustomer && (
        <div className="p-2 bg-gray-100 rounded border">
          <strong>Selected Customer:</strong> {selectedCustomer.name} ({selectedCustomer.address})
        </div>
      )}

      <table className="w-full border-collapse border border-gray-300 mt-4 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Model</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Disc%</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const quantity = Number(item.quantity) || 0;
            const rate = Number(item.rate) || 0;
            const discount = Number(item.discount) || 0;

            const discountAmount = (rate * discount) / 100;
            const netPrice = rate - discountAmount;
            const totalAmount = netPrice * quantity;

            return (
              <tr key={index}>
                <td className="border p-1">
                  <input
                    value={item.modelNumber}
                    onChange={(e) => handleItemChange(index, 'modelNumber', e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border p-1 text-center">{totalAmount.toFixed(2)}</td>
                <td className="border p-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 cursor-pointer"
        >
          + Add Item
        </button>
      </div>

      <div className="mt-4 text-right font-semibold text-lg">
        Grand Total: ₹{Math.round(grandTotal)}
      </div>

      <div className="text-right font-medium">
        Total Quantity: {totalQty}
      </div>


      <div className="flex gap-2 justify-end">
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 cursor-pointer">
          Create Bill
        </button>
        <button type="button" onClick={downloadPdf} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer">
          Export as PDF
        </button>
      </div>
    </form>
  );
}
