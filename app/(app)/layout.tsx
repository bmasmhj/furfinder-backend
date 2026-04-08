import { Metadata } from 'next';
import Sidebar from '@/components/app/Sidebar';
import TopNav from '@/components/app/TopNav';

export const metadata: Metadata = {
  title: 'Dashboard - Pet Reunite AI',
  description: 'Manage your lost or found pet reports and connect with others.',
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
