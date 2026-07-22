import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from './Sidebar';
import '../admin.css';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
