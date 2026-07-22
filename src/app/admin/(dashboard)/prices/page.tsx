'use client';

import { useState, useEffect } from 'react';

interface Brand { id: string; name: string; }
interface Model { id: string; name: string; }

interface VariantPriceItem {
  variantId: string;
  variantName: string;
  description: string | null;
  price: number | null;
  installmentsEnabled: boolean;
  installmentCount: number | null;
  installmentValue: number | null;
}

interface RepairTypeGroup {
  repairTypeId: string;
  repairTypeName: string;
  variants: VariantPriceItem[];
}

interface PriceInputState {
  price: string;
  installmentsEnabled: boolean;
  installmentCount: string;
  installmentValue: string;
}

export default function AdminPricesPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [groups, setGroups] = useState<RepairTypeGroup[]>([]);

  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');

  const [inputs, setInputs] = useState<Record<string, PriceInputState>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchBrands(); }, []);

  useEffect(() => {
    if (selectedBrandId) {
      fetchModels(selectedBrandId);
      setSelectedModelId('');
      setGroups([]);
    } else {
      setModels([]);
      setSelectedModelId('');
      setGroups([]);
    }
  }, [selectedBrandId]);

  useEffect(() => {
    if (selectedModelId) fetchPrices(selectedModelId);
    else setGroups([]);
  }, [selectedModelId]);

  const fetchBrands = async () => {
    const res = await fetch('/api/brands');
    if (res.ok) setBrands(await res.json());
  };

  const fetchModels = async (brandId: string) => {
    const res = await fetch(`/api/models?brandId=${brandId}`);
    if (res.ok) setModels(await res.json());
  };

  const fetchPrices = async (modelId: string) => {
    try {
      const res = await fetch(`/api/repair-variant-prices?modelId=${modelId}`);
      if (!res.ok) return;
      const data: RepairTypeGroup[] = await res.json();
      setGroups(data);

      // Init input state
      const initial: Record<string, PriceInputState> = {};
      data.forEach((g) =>
        g.variants.forEach((v) => {
          initial[v.variantId] = {
            price: v.price !== null ? v.price.toString() : '',
            installmentsEnabled: v.installmentsEnabled,
            installmentCount: v.installmentCount?.toString() ?? '',
            installmentValue: v.installmentValue?.toString() ?? '',
          };
        })
      );
      setInputs(initial);
    } catch {
      setError('Erro ao carregar preços');
    }
  };

  const setInput = (variantId: string, field: keyof PriceInputState, value: string | boolean) => {
    setInputs((prev) => ({ ...prev, [variantId]: { ...prev[variantId], [field]: value } }));
  };

  const handleSave = async (variantId: string) => {
    setError('');
    setSuccess('');
    setSavingId(variantId);
    const inp = inputs[variantId];

    try {
      const res = await fetch('/api/repair-variant-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          modelId: selectedModelId,
          price: inp.price.trim() === '' ? null : inp.price,
          installmentsEnabled: inp.installmentsEnabled,
          installmentCount: inp.installmentsEnabled && inp.installmentCount ? parseInt(inp.installmentCount) : null,
          installmentValue: inp.installmentsEnabled && inp.installmentValue ? parseFloat(inp.installmentValue) : null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Erro ao salvar');
      }
      setSuccess('Preço salvo com sucesso!');
      fetchPrices(selectedModelId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const tierColors: Record<string, string> = {
    basic: '#6b7280', básico: '#6b7280',
    standard: '#3b82f6', padrão: '#3b82f6',
    premium: '#8b5cf6',
    original: '#059669',
    plus: '#f59e0b',
    oem: '#3b82f6',
  };
  const getTierColor = (name: string) => tierColors[name.toLowerCase()] ?? 'var(--color-primary)';

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Preços por Variante de Peça</h1>
        <p style={{ color: 'var(--admin-text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>
          Configure o preço e parcelamento de cada variante para um modelo específico.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Model selector */}
      <div className="admin-card" style={{ marginBottom: '30px' }}>
        <div className="form-grid" style={{ marginBottom: 0 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="brand-select">Marca</label>
            <select id="brand-select" className="input-control" value={selectedBrandId} onChange={(e) => setSelectedBrandId(e.target.value)}>
              <option value="">Selecione uma marca...</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="model-select">Modelo</label>
            <select id="model-select" className="input-control" value={selectedModelId} onChange={(e) => setSelectedModelId(e.target.value)} disabled={!selectedBrandId}>
              <option value="">Selecione um modelo...</option>
              {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {!selectedModelId && (
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ margin: 0, color: 'var(--admin-text-muted)' }}>
            Selecione uma marca e um modelo para configurar os preços por variante.
          </p>
        </div>
      )}

      {selectedModelId && groups.length === 0 && (
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ margin: 0, color: 'var(--admin-text-muted)' }}>
            Nenhuma variante cadastrada. Acesse <strong>Tipos de Peça</strong> no menu lateral para criar tipos e variantes primeiro.
          </p>
        </div>
      )}

      {/* Groups */}
      {groups.map((group) => (
        <div key={group.repairTypeId} className="admin-card" style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }} />
            {group.repairTypeName}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {group.variants.map((variant) => {
              const inp = inputs[variant.variantId] ?? { price: '', installmentsEnabled: false, installmentCount: '', installmentValue: '' };
              const color = getTierColor(variant.variantName);
              return (
                <div
                  key={variant.variantId}
                  style={{
                    background: `${color}08`,
                    border: `1px solid ${color}25`,
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <span
                      style={{
                        background: `${color}20`,
                        border: `1px solid ${color}40`,
                        color,
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        letterSpacing: '0.3px',
                      }}
                    >
                      {variant.variantName}
                    </span>
                    {variant.description && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                        {variant.description}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    {/* Price */}
                    <div className="form-group" style={{ marginBottom: 0, flex: '1 1 140px' }}>
                      <label style={{ fontSize: '0.8rem' }}>Preço (R$)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>R$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="input-control"
                          style={{ padding: '9px 12px' }}
                          placeholder="0,00"
                          value={inp.price}
                          onChange={(e) => setInput(variant.variantId, 'price', e.target.value)}
                          disabled={savingId !== null}
                        />
                      </div>
                    </div>

                    {/* Installments toggle */}
                    <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Parcelamento</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={inp.installmentsEnabled}
                          onChange={(e) => setInput(variant.variantId, 'installmentsEnabled', e.target.checked)}
                          disabled={savingId !== null}
                        />
                        Parcelar
                      </label>
                    </div>

                    {/* Installment fields (only when enabled) */}
                    {inp.installmentsEnabled && (
                      <>
                        <div className="form-group" style={{ marginBottom: 0, flex: '0 1 100px' }}>
                          <label style={{ fontSize: '0.8rem' }}>Nº de parcelas</label>
                          <input
                            type="number"
                            min="2"
                            max="24"
                            className="input-control"
                            style={{ padding: '9px 12px' }}
                            placeholder="Ex: 12"
                            value={inp.installmentCount}
                            onChange={(e) => setInput(variant.variantId, 'installmentCount', e.target.value)}
                            disabled={savingId !== null}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0, flex: '1 1 120px' }}>
                          <label style={{ fontSize: '0.8rem' }}>Valor por parcela (R$)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="input-control"
                            style={{ padding: '9px 12px' }}
                            placeholder="Ex: 15,90"
                            value={inp.installmentValue}
                            onChange={(e) => setInput(variant.variantId, 'installmentValue', e.target.value)}
                            disabled={savingId !== null}
                          />
                        </div>
                      </>
                    )}

                    <button
                      className="btn-primary"
                      style={{ padding: '10px 20px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                      onClick={() => handleSave(variant.variantId)}
                      disabled={savingId !== null}
                    >
                      {savingId === variant.variantId ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>

                  {/* Preview */}
                  {inp.price && (
                    <div style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                      Preview: <strong style={{ color: 'var(--color-primary)' }}>
                        R$ {parseFloat(inp.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                      {inp.installmentsEnabled && inp.installmentCount && inp.installmentValue && (
                        <span> ou <strong style={{ color: color }}>{inp.installmentCount}x de R$ {parseFloat(inp.installmentValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
