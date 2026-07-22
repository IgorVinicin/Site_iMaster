'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      } else {
        alert('Erro ao sair do painel');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao processar logout');
    } finally {
      setLoading(false);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <span>iMaster <span>Admin</span></span>
        <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </div>

      <nav style={{ flex: 1 }}>
        <ul className="nav-links">
          <li className={`nav-item ${pathname === '/admin' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <Link href="/admin">
              <span>Painel</span>
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/admin/brands' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <Link href="/admin/brands">
              <span>Marcas</span>
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/admin/models' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <Link href="/admin/models">
              <span>Modelos</span>
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/admin/repair-types' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <Link href="/admin/repair-types">
              <span>Tipos de Peça</span>
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/admin/prices' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <Link href="/admin/prices">
              <span>Preços de Reparo</span>
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/admin/comparison-faqs' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <Link href="/admin/comparison-faqs">
              <span>FAQ Comparativo</span>
            </Link>
          </li>
          {user?.role === 'ADMIN' && (
            <li className={`nav-item ${pathname === '/admin/users' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <Link href="/admin/users">
                <span>Funcionários</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <button className="logout-btn" onClick={handleLogout} disabled={loading}>
        <span>{loading ? 'Saindo...' : 'Sair do Painel'}</span>
      </button>
    </aside>
  );
}
