'use client';

import PaymentEditForm from '@/components/PaymentEditForm';
import { use } from 'react';

export default function EditPaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // unwrap the params Promise

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Edit Payment</h1>
            <PaymentEditForm
                paymentId={id}
                onClose={() => {
                }}
                onUpdated={() => {
                }}
            />
        </div>
    );
}
