'use client';

import { useState, useEffect } from 'react';

interface RepairVariant {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
}

interface RepairType {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  variants: RepairVariant[];
}

export default function AdminRepairTypesPage() {
  const [types, setTypes] = useState<RepairType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New Type form
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [savingType, setSavingType] = useState(false);

  // New Variant form per type
  const [variantInputs, setVariantInputs] = useState<{ [typeId: string]: { name: string; description: string } }>({});
  const [savingVariant, setSavingVariant] = useState<string | null>(null);
  const [deletingVariant, setDeletingVariant] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Fetch all repair types
      const typesRes = await fetch('/api/repair-types');
      const typesData: Omit<RepairType, 'variants'>[] = await typesRes.json();

      // Fetch all variants
      const variantsRes = await fetch('/api/repair-variants');
      const variantsData: (RepairVariant & { repairType: { id: string; name: string } })[] = await variantsRes.json();

      // Group variants by repairTypeId
      const typesWithVariants: RepairType[] = typesData.map((t) => ({
        ...t,
        variants: variantsData.filter((v) => v.repairType.id === t.id),
      }));

      setTypes(typesWithVariants);
    } catch {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    setSavingType(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/repair-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTypeName.trim(), description: newTypeDesc.trim() || null }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Erro ao criar tipo');
      }
      setNewTypeName('');
      setNewTypeDesc('');
      setSuccess('Tipo criado com sucesso!');
      fetchAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingType(false);
    }
  };

  const handleCreateVariant = async (typeId: string) => {
    const input = variantInputs[typeId];
    if (!input?.name?.trim()) return;
    setSavingVariant(typeId);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/repair-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repairTypeId: typeId,
          name: input.name.trim(),
          description: input.description?.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Erro ao criar variante');
      }
      setVariantInputs((prev) => ({ ...prev, [typeId]: { name: '', description: '' } }));
      setSuccess('Variante adicionada!');
      fetchAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingVariant(null);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('Excluir esta variante? Os preços vinculados serão removidos.')) return;
    setDeletingVariant(variantId);
    setError('');
    try {
      const res = await fetch(`/api/repair-variants/${variantId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir');
      setSuccess('Variante excluída.');
      fetchAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingVariant(null);
    }
  };

  const tierColors: Record<string, string> = {
    basic: '#6b7280',
    básico: '#6b7280',
    standard: '#3b82f6',
    padrão: '#3b82f6',
    premium: '#8b5cf6',
    original: '#059669',
    plus: '#f59e0b',
    oem: '#3b82f6',
  };

  const getTierColor = (name: string) =>
    tierColors[name.toLowerCase()] ?? 'var(--color-primary)';

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Tipos de Conserto &amp; Variantes de Peça</h1>
        <p style={{ color: 'var(--admin-text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>
          Crie tipos de conserto e adicione variantes (ex: Tela Basic, Tela Premium, Tela Original)
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Create new type */}
      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 700 }}>
          Novo Tipo de Conserto
        </h3>
        <form onSubmit={handleCreateType}>
          <div className="form-grid">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Nome do tipo *</label>
              <input
                type="text"
                className="input-control"
                placeholder="Ex: Troca de Tela, Troca de Bateria..."
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Descrição (opcional)</label>
              <input
                type="text"
                className="input-control"
                placeholder="Ex: Substituição do display..."
                value={newTypeDesc}
                onChange={(e) => setNewTypeDesc(e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button type="submit" className="btn-primary" disabled={savingType || !newTypeName.trim()}>
              {savingType ? 'Criando...' : '+ Adicionar Tipo'}
            </button>
          </div>
        </form>
      </div>

      {/* Types list with variants */}
      {loading ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
          Carregando...
        </div>
      ) : types.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
          Nenhum tipo cadastrado ainda.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {types.map((type) => (
            <div key={type.id} className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    flexShrink: 0,
                  }}
                />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{type.name}</h3>
                {type.description && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                    — {type.description}
                  </span>
                )}
              </div>

              {/* Existing variants */}
              {type.variants.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                  {type.variants.map((variant) => (
                    <div
                      key={variant.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: `${getTierColor(variant.name)}15`,
                        border: `1px solid ${getTierColor(variant.name)}40`,
                        borderRadius: '8px',
                        padding: '8px 14px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: getTierColor(variant.name),
                      }}
                    >
                      {variant.name}
                      {variant.description && (
                        <span style={{ fontWeight: 400, opacity: 0.75, fontSize: '0.8rem' }}>
                          — {variant.description}
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteVariant(variant.id)}
                        disabled={deletingVariant === variant.id}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ef4444',
                          padding: '0 2px',
                          fontSize: '1rem',
                          lineHeight: 1,
                          opacity: deletingVariant === variant.id ? 0.5 : 1,
                        }}
                        title="Excluir variante"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add variant form */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: '1 1 160px' }}>
                  <label style={{ fontSize: '0.8rem' }}>Nome da variante</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Ex: Basic, Premium, Original..."
                    style={{ padding: '9px 12px', fontSize: '0.9rem' }}
                    value={variantInputs[type.id]?.name ?? ''}
                    onChange={(e) =>
                      setVariantInputs((prev) => ({
                        ...prev,
                        [type.id]: { ...prev[type.id], name: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: '2 1 220px' }}>
                  <label style={{ fontSize: '0.8rem' }}>Descrição (opcional)</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Ex: Tela original de fábrica com calibração..."
                    style={{ padding: '9px 12px', fontSize: '0.9rem' }}
                    value={variantInputs[type.id]?.description ?? ''}
                    onChange={(e) =>
                      setVariantInputs((prev) => ({
                        ...prev,
                        [type.id]: { ...prev[type.id], description: e.target.value },
                      }))
                    }
                  />
                </div>
                <button
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                  onClick={() => handleCreateVariant(type.id)}
                  disabled={savingVariant === type.id || !variantInputs[type.id]?.name?.trim()}
                >
                  {savingVariant === type.id ? 'Adicionando...' : '+ Variante'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
