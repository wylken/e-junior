import { ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <Toaster position="top-right" />
    </div>
  );
}