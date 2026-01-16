'use client';
interface TotalOutstandingProps {
  value: number;
}

export default function TotalOutstanding({ value }: TotalOutstandingProps) {
  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-semibold mb-2">Total Outstanding</h3>
      <div className="text-2xl font-bold text-red-600">
        ₹ {value.toLocaleString()}
      </div>
    </div>
  );
}
