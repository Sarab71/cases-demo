'use client';
interface TotalSalesProps {
  value: number;
}

export default function TotalSales({ value }: TotalSalesProps) {
  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-semibold mb-2">Total Sales</h3>
      <div className="text-2xl font-bold text-blue-600">
        ₹ {value.toLocaleString()}
      </div>
    </div>
  );
}
