import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: '#0b1006', /* Deep charcoal green matching Stitch background */
        padding: '80px 5% 40px 5%',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-muted)',
        fontSize: '0.9rem',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '60px',
        }}
      >
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Logo size="small" />
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--color-text-muted)', margin: 0 }}>
            Assistência técnica especializada em smartphones. Reparos expressos com componentes premium, transparência total e até 1 ano de garantia.
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, margin: 0, fontFamily: "'Outfit', sans-serif" }}>Navegação</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link href="#buscador" className="footer-link">
                Buscador de Preços
              </Link>
            </li>
            <li>
              <Link href="#como-funciona" className="footer-link">
                Como Funciona
              </Link>
            </li>
            <li>
              <Link href="#reparos" className="footer-link">
                Tipos de Reparo
              </Link>
            </li>
            <li>
              <Link href="#diferenciais" className="footer-link">
                Diferenciais
              </Link>
            </li>
            <li>
              <Link href="#faq" className="footer-link">
                Dúvidas Frequentes
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, margin: 0, fontFamily: "'Outfit', sans-serif" }}>Contato</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ color: 'var(--color-primary)' }}>
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.907h.004c4.368 0 7.93-3.558 7.93-7.93a7.897 7.897 0 0 0-2.327-5.645zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.69-4.98c-.202-.101-1.202-.594-1.392-.66-.189-.072-.327-.108-.466.101-.139.208-.538.66-.66.8-.12.137-.24.154-.442.053-2.001-1.004-3.593-2.522-4.602-4.269-.153-.263-.015-.407.117-.538.12-.119.26-.302.39-.453.13-.152.173-.258.26-.43.087-.172.043-.323-.021-.453-.065-.13-1.066-2.569-1.464-3.529-.387-.93-.78-1.03-1.066-1.037l-.466-.008c-.16 0-.418.06-.637.297-.22.238-.84.82-.84 2.002 0 1.182.859 2.323.978 2.48.12.158 1.69 2.581 4.093 3.616.571.246 1.018.393 1.364.502.574.181 1.097.156 1.512.094.462-.069 1.402-.572 1.6-.1.198-.473.198-.878.139-.949-.06-.072-.198-.108-.4-.209z"/>
              </svg>
              <a href="https://wa.me/5512991556459" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                (12) 99155-6459
              </a>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.5' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)', marginTop: '3px', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>Avenida dos Evangélicos, Campos dos Alemães<br />São José dos Campos - SP, 12239-120</span>
            </li>
          </ul>
        </div>

        {/* Business Hours */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, margin: 0, fontFamily: "'Outfit', sans-serif" }}>Funcionamento</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <span style={{ display: 'block', color: 'var(--color-text)', fontWeight: 600 }}>Segunda a Sexta</span>
              <span style={{ fontSize: '0.85rem' }}>09:00 às 18:00</span>
            </li>
            <li>
              <span style={{ display: 'block', color: 'var(--color-text)', fontWeight: 600 }}>Sábado</span>
              <span style={{ fontSize: '0.85rem' }}>09:00 às 13:00</span>
            </li>
            <li>
              <span style={{ display: 'block', color: '#ffb4ab', fontSize: '0.85rem', fontWeight: 600 }}>Domingos e Feriados: Fechado</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '30px',
          borderTop: '1px solid rgba(140, 148, 124, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          fontSize: '0.8rem',
        }}
      >
        <div>
          &copy; {currentYear} iMaster. Todos os direitos reservados.
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Termos de Uso</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.1)' }}>|</span>
          <span style={{ color: 'var(--color-text-muted)' }}>Privacidade</span>
        </div>
      </div>
    </footer>
  );
}
