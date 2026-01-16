'use client';

import { useLoading } from '@/context/LoadingContext';

export default function LoadingBar() {
  const { loading, progress } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex flex-col items-center justify-center text-white">
      <div className="w-64 bg-white/90 rounded-full h-4 overflow-hidden shadow-lg">
        <div
          className="bg-blue-600 h-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-white text-lg font-semibold">{progress}%</p>
    </div>
  );
}
