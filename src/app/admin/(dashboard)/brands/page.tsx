'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Brand {
  id: string;
  name: string;
  logoUrl: string | null;
  showInMenu: boolean;
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [showInMenu, setShowInMenu] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar marcas');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao fazer upload da imagem');
      }

      setLogoUrl(data.url);
      setSuccess('Logo carregada com sucesso!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      // Reset input value to allow uploading same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name.trim()) {
      setError('Nome é obrigatório');
      setLoading(false);
      return;
    }

    try {
      const url = editingId ? `/api/brands/${editingId}` : '/api/brands';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, logoUrl: logoUrl || null, showInMenu }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar marca');
      }

      setSuccess(editingId ? 'Marca atualizada com sucesso!' : 'Marca criada com sucesso!');
      setName('');
      setLogoUrl('');
      setShowInMenu(true);
      setEditingId(null);
      fetchBrands();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setName(brand.name);
    setLogoUrl(brand.logoUrl || '');
    setShowInMenu(brand.showInMenu);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setLogoUrl('');
    setShowInMenu(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta marca? Todos os modelos e preços associados serão excluídos.')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao excluir marca');
      }

      setSuccess('Marca excluída com sucesso!');
      fetchBrands();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleShowInMenu = async (brand: Brand) => {
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/brands/${brand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: brand.name, 
          logoUrl: brand.logoUrl, 
          showInMenu: !brand.showInMenu 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao atualizar exibição no menu');
      }

      // Update state locally
      setBrands((prev) =>
        prev.map((b) => (b.id === brand.id ? { ...b, showInMenu: !b.showInMenu } : b))
      );

      // Sync form if we are currently editing this brand
      if (editingId === brand.id) {
        setShowInMenu(!brand.showInMenu);
      }
      
      setSuccess(`Status no menu da marca "${brand.name}" atualizado com sucesso!`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Gerenciar Marcas</h1>
      </div>

      <div className="admin-grid-layout">
        {/* Form panel */}
        <div className="admin-card">
          <h2>{editingId ? 'Editar Marca' : 'Nova Marca'}</h2>
          
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="brand-name">Nome da Marca</label>
              <input
                id="brand-name"
                type="text"
                className="input-control"
                placeholder="Ex: Samsung, Apple"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
              <input
                id="brand-show-in-menu"
                type="checkbox"
                checked={showInMenu}
                onChange={(e) => setShowInMenu(e.target.checked)}
                disabled={loading}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
              />
              <label htmlFor="brand-show-in-menu" style={{ cursor: 'pointer', userSelect: 'none', marginBottom: 0, color: '#ffffff' }}>
                Exibir marca no menu do cabeçalho
              </label>
            </div>

            <div className="form-group file-upload-container">
              <label>Logo da Marca</label>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileUpload}
                disabled={loading || uploading}
              />

              {/* Upload preview or trigger button */}
              {logoUrl ? (
                <div className="image-preview-container">
                  <img
                    src={logoUrl}
                    alt="Logo carregada"
                    className="image-preview"
                  />
                  <div className="preview-details">
                    <span className="preview-name">{logoUrl.split('/').pop()}</span>
                    <button
                      type="button"
                      className="btn-remove-file"
                      style={{ width: 'fit-content' }}
                      onClick={handleRemoveLogo}
                      disabled={loading || uploading}
                    >
                      Remover Logo
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="file-upload-box"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="upload-text">
                    {uploading ? 'Carregando arquivo...' : <>Clique para <span>enviar imagem da logo</span></>}
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading || uploading}>
                {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Cadastrar'}
              </button>
              {editingId && (
                <button type="button" className="input-control" style={{ width: 'auto' }} onClick={handleCancelEdit}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List panel */}
        <div>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Logo</th>
                  <th>Nome</th>
                  <th style={{ width: '160px' }}>Exibido no Menu</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {brands.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      Nenhuma marca cadastrada.
                    </td>
                  </tr>
                ) : (
                  brands.map((brand) => (
                    <tr key={brand.id}>
                      <td>
                        {brand.logoUrl ? (
                          <div className="table-img-wrapper">
                            <img
                              src={brand.logoUrl}
                              alt={`Logo ${brand.name}`}
                              className="table-thumbnail"
                            />
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>{brand.name}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleShowInMenu(brand)}
                          title="Clique para alternar exibição no menu"
                          style={{
                            cursor: 'pointer',
                            background: brand.showInMenu ? 'rgba(163, 230, 53, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: brand.showInMenu ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                            border: `1px solid ${brand.showInMenu ? 'rgba(163, 230, 53, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: brand.showInMenu ? 'var(--color-primary)' : 'var(--color-text-muted)'
                          }}></span>
                          {brand.showInMenu ? 'Exibido' : 'Não exibido'}
                        </button>
                      </td>
                      <td>
                        <button className="btn-action btn-edit" onClick={() => handleEdit(brand)}>
                          Editar
                        </button>
                        <button className="btn-action btn-delete" onClick={() => handleDelete(brand.id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
