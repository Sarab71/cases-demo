'use client';

import EditBillForm from '@/components/EditBillForm';
import { use } from 'react';

export default function EditBillPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // unwrap the Promise

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Edit Bill</h1>
            <EditBillForm
                billId={id}
                onClose={() => { }}
                onUpdated={() => { }}
            />
        </div>
    );
}
