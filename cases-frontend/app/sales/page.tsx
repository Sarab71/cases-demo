import DueDateBills from '@/components/DueDateBills';
import AllBillsWithFilter from '@/components/AllBillsWithFilter';

export default function DueDatePage() {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex flex-col gap-6">
        <DueDateBills />
        <AllBillsWithFilter />
      </div>
    </div>
  );
}
