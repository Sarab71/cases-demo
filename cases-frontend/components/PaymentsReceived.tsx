'use client';
interface PaymentsReceivedProps {
  value: number;
}

export default function PaymentsReceived({ value }: PaymentsReceivedProps) {
  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-semibold mb-2">Payments Received</h3>
      <div className="text-2xl font-bold text-green-600">
        ₹ {value.toLocaleString()}
      </div>
    </div>
  );
}
