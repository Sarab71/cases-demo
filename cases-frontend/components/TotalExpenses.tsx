'use client';

interface TotalExpensesProps {
    value: number;
}

export default function TotalExpenses({value}: TotalExpensesProps) {

    return (
        <div className="p-4 bg-white rounded shadow mb-4">
            <h3 className="font-semibold mb-2">Expenses</h3>
            <div className="text-2xl font-bold text-orange-600">
                ₹ {value.toLocaleString()}
            </div>
        </div>
    );
}
