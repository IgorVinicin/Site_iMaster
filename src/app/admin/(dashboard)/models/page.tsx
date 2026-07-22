'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Brand {
  id: string;
  name: string;
}

interface DeviceModel {
  id: string;
  name: string;
  brandId: string;
  imageUrl: string | null;
  brand: Brand;
}

export default function AdminModels() {
  const [models, setModels] = useState<DeviceModel[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Pagination and search states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalModels, setTotalModels] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page to 1 on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchModels();
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch(`/api/models?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearch)}`);
      if (res.ok) {
        const result = await res.json();
        setModels(result.data || []);
        setTotalPages(result.pages || 1);
        setTotalModels(result.total || 0);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar modelos');
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (err) {
      console.error(err);
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
        throw new Error(data.error || 'Erro ao fazer upload da imagem do modelo');
      }

      setImageUrl(data.url);
      setSuccess('Imagem do modelo carregada com sucesso!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name.trim() || !brandId) {
      setError('Nome e Marca são obrigatórios');
      setLoading(false);
      return;
    }

    try {
      const url = editingId ? `/api/models/${editingId}` : '/api/models';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, brandId, imageUrl: imageUrl || null }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar modelo');
      }

      setSuccess(editingId ? 'Modelo atualizado com sucesso!' : 'Modelo criado com sucesso!');
      setName('');
      setBrandId('');
      setImageUrl('');
      setEditingId(null);
      fetchModels();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (model: DeviceModel) => {
    setEditingId(model.id);
    setName(model.name);
    setBrandId(model.brandId);
    setImageUrl(model.imageUrl || '');
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setBrandId('');
    setImageUrl('');
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este modelo? Todos os preços configurados serão perdidos.')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/models/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao excluir modelo');
      }

      setSuccess('Modelo excluído com sucesso!');
      fetchModels();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Gerenciar Modelos</h1>
      </div>

      <div className="admin-grid-layout">
        {/* Form panel */}
        <div className="admin-card">
          <h2>{editingId ? 'Editar Modelo' : 'Novo Modelo'}</h2>
          
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="brand-select">Marca</label>
              <select
                id="brand-select"
                className="input-control"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Selecione uma marca...</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="model-name">Nome do Modelo</label>
              <input
                id="model-name"
                type="text"
                className="input-control"
                placeholder="Ex: iPhone 13 Pro, Moto G8"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group file-upload-container">
              <label>Imagem do Aparelho (Modelo)</label>
              
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
              {imageUrl ? (
                <div className="image-preview-container">
                  <img
                    src={imageUrl}
                    alt="Imagem do modelo carregada"
                    className="image-preview"
                  />
                  <div className="preview-details">
                    <span className="preview-name">{imageUrl.split('/').pop()}</span>
                    <button
                      type="button"
                      className="btn-remove-file"
                      style={{ width: 'fit-content' }}
                      onClick={handleRemoveImage}
                      disabled={loading || uploading}
                    >
                      Remover Imagem
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
                    {uploading ? 'Carregando arquivo...' : <>Clique para <span>enviar imagem do modelo</span></>}
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
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <input
              type="text"
              className="input-control"
              placeholder="Pesquisar modelo ou marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Imagem</th>
                  <th>Nome do Modelo</th>
                  <th>Marca</th>
                  <th style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {models.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      Nenhum modelo cadastrado.
                    </td>
                  </tr>
                ) : (
                  models.map((model) => (
                    <tr key={model.id}>
                      <td>
                        {model.imageUrl ? (
                          <div className="table-img-wrapper">
                            <img
                              src={model.imageUrl}
                              alt={`Modelo ${model.name}`}
                              className="table-thumbnail"
                            />
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>{model.name}</td>
                      <td>{model.brand.name}</td>
                      <td>
                        <button className="btn-action btn-edit" onClick={() => handleEdit(model)}>
                          Editar
                        </button>
                        <button className="btn-action btn-delete" onClick={() => handleDelete(model.id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem', textTransform: 'none' }}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Anterior
              </button>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem', textTransform: 'none' }}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
