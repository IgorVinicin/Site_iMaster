'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from './Logo';

interface Brand {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
  brandId: string;
  brand: Brand;
}

export default function Header() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedBrandId, setExpandedBrandId] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch brands and models on mount
    fetch('/api/brands?showInMenu=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch((err) => console.error('Error fetching brands for header:', err));

    fetch('/api/models')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setModels(data);
      })
      .catch((err) => console.error('Error fetching models for header:', err));

    // Handle clicks outside the search box to close results
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredSearchResults = React.useMemo(() => {
    if (searchQuery.trim() === '') return [];
    const query = searchQuery.toLowerCase();
    return models.filter((m) =>
      m.name.toLowerCase().includes(query) ||
      m.brand.name.toLowerCase().includes(query)
    ).slice(0, 8);
  }, [searchQuery, models]);

  const handleSelectModel = (modelId: string) => {
    setSearchQuery('');
    setShowSearchResults(false);
    window.location.href = `/?modelId=${modelId}#buscador`;
  };

  return (
    <header className={`site-header ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="header-container">
        <Link href="/" className="header-logo-link">
          <Logo size="small" />
        </Link>
        
        {/* Brands Navigation Menu (Desktop) */}
        <nav className="header-nav-desktop">
          <ul className="nav-menu">
            {brands.map((brand) => {
              const brandModels = models.filter((m) => m.brandId === brand.id);
              return (
                <li key={brand.id} className="nav-menu-item">
                  <button className="nav-menu-btn">
                    {brand.name}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className="nav-dropdown">
                    {brandModels.length === 0 ? (
                      <div style={{ padding: '10px 16px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Sem modelos
                      </div>
                    ) : (
                      brandModels.map((model) => (
                        <button
                          key={model.id}
                          className="dropdown-link"
                          onClick={() => handleSelectModel(model.id)}
                        >
                          {model.name}
                        </button>
                      ))
                    )}
                  </div>
                </li>
              );
            })}
            <li className="nav-menu-item" style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '20px', marginLeft: '4px' }}>
              <Link href="/#buscador" className="nav-menu-btn" style={{ textTransform: 'none', color: 'var(--color-primary)' }}>
                Outras marcas
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right side: Search bar & CTA button (Desktop) */}
        <div className="header-actions-desktop">
          {/* Lupa / Campo de Pesquisa Autocomplete */}
          <div className="header-search-container" ref={searchRef}>
            <svg
              className="header-search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="header-search-input"
              placeholder="Pesquisar modelo... Ex: iPhone 13"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
            />
            
            {showSearchResults && filteredSearchResults.length > 0 && (
              <div className="header-search-results">
                {filteredSearchResults.map((model) => (
                  <button
                    key={model.id}
                    className="search-result-item"
                    onMouseDown={() => handleSelectModel(model.id)}
                  >
                    <span className="search-result-name">{model.name}</span>
                    <span className="search-result-brand">{model.brand.name}</span>
                  </button>
                ))}
              </div>
            )}

            {showSearchResults && searchQuery.trim() !== '' && filteredSearchResults.length === 0 && (
              <div className="header-search-results" style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Nenhum modelo encontrado
              </div>
            )}
          </div>

          <a 
            href="https://wa.me/5512991556459" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary header-cta-btn"
          >
            Falar no WhatsApp
          </a>
        </div>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? (
            /* Close Icon */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            /* Hamburger Icon */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div className="mobile-drawer">
        {/* Search inside drawer */}
        <div className="mobile-search-wrapper" ref={searchRef}>
          <div className="header-search-container" style={{ width: '100%' }}>
            <svg
              className="header-search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="header-search-input"
              style={{ width: '100%' }}
              placeholder="Pesquisar modelo..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
            />
            
            {showSearchResults && filteredSearchResults.length > 0 && (
              <div className="header-search-results" style={{ width: '100%' }}>
                {filteredSearchResults.map((model) => (
                  <button
                    key={model.id}
                    className="search-result-item"
                    onMouseDown={() => {
                      handleSelectModel(model.id);
                      setIsMobileOpen(false);
                    }}
                  >
                    <span className="search-result-name">{model.name}</span>
                    <span className="search-result-brand">{model.brand.name}</span>
                  </button>
                ))}
              </div>
            )}

            {showSearchResults && searchQuery.trim() !== '' && filteredSearchResults.length === 0 && (
              <div className="header-search-results" style={{ width: '100%', padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Nenhum modelo encontrado
              </div>
            )}
          </div>
        </div>

        {/* Brands Navigation Accordion */}
        <div className="mobile-nav-brands">
          <p className="mobile-section-title">Marcas</p>
          <ul className="mobile-brands-list">
            {brands.map((brand) => {
              const brandModels = models.filter((m) => m.brandId === brand.id);
              const isExpanded = expandedBrandId === brand.id;
              return (
                <li key={brand.id} className="mobile-brand-item">
                  <button 
                    className={`mobile-brand-btn ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => setExpandedBrandId(isExpanded ? null : brand.id)}
                  >
                    <span>{brand.name}</span>
                    <svg className="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className={`mobile-brand-dropdown ${isExpanded ? 'open' : ''}`}>
                    {brandModels.length === 0 ? (
                      <div className="mobile-dropdown-empty">Sem modelos</div>
                    ) : (
                      brandModels.map((model) => (
                        <button
                          key={model.id}
                          className="mobile-dropdown-link"
                          onClick={() => {
                            handleSelectModel(model.id);
                            setIsMobileOpen(false);
                          }}
                        >
                          {model.name}
                        </button>
                      ))
                    )}
                  </div>
                </li>
              );
            })}
            <li className="mobile-brand-item">
              <Link 
                href="/#buscador" 
                className="mobile-brand-btn"
                style={{ color: 'var(--color-primary)' }}
                onClick={() => setIsMobileOpen(false)}
              >
                <span>Outras Marcas</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            </li>
          </ul>
        </div>

        {/* Call to Action WhatsApp */}
        <div className="mobile-cta-wrapper">
          <a 
            href="https://wa.me/5512991556459" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ width: '100%', display: 'block', textAlign: 'center', padding: '12px' }}
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
