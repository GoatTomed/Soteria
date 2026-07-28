import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollManager } from '@/components/ScrollManager';

export function Layout() {
  return (
    <div className="marketing-body flex min-h-screen flex-col">
      <ScrollManager />
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
