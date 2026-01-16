'use client';

import CustomerSideBar from '@/components/CustomerSideBar';
import CustomerStatement from '@/components/CustomerStatement';
import EditCustomerForm from '@/components/EditCustomerForm';
import { useState } from 'react';

export default function CustomersPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [refreshCustomerList, setRefreshCustomerList] = useState<number>(0);

  const handleSelectCustomer = (customerId: string, customerName: string) => {
    setSelectedCustomerId(customerId);
    setSelectedCustomerName(customerName);
    setShowEditForm(false); // reset form on new selection
  };

  return (
    <div className="flex">
      <CustomerSideBar onSelectCustomer={handleSelectCustomer}
        refreshTrigger={refreshCustomerList} />

      <div className="flex-1 p-4 ml-64">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Customer Details</h1>
          {selectedCustomerId && (
            <button
              onClick={() => setShowEditForm(!showEditForm)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:cursor-pointer"
            >
              {showEditForm ? 'Close Edit' : 'Edit'}
            </button>
          )}
        </div>

        {selectedCustomerId ? (
          <>

            {showEditForm && (
              <EditCustomerForm
                customerId={selectedCustomerId}
                onClose={() => setShowEditForm(false)}
                onUpdated={(updatedName) => {
                  setSelectedCustomerName(updatedName);
                  setRefreshCustomerList(prev => prev + 1);
                  setShowEditForm(false);
                }}
              />
            )}
            
            <CustomerStatement
              customerId={selectedCustomerId}
              customerName={selectedCustomerName}
            />
          </>
        ) : (
          <p>Select a customer from the sidebar to view their statement.</p>
        )}
      </div>
    </div>
  );
}
