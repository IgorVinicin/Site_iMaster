'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Brand {
  id: string;
  name: string;
  logoUrl: string | null;
}

interface Model {
  id: string;
  name: string;
  brandId: string;
  imageUrl?: string | null;
}

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

interface ModelDetails {
  id: string;
  name: string;
  imageUrl: string | null;
  brand: { id: string; name: string };
}

export default function RepairSearch({ initialBrands }: { initialBrands: Brand[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlModelId = searchParams.get('modelId');

  const [brands] = useState<Brand[]>(initialBrands);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [modelSearch, setModelSearch] = useState('');
  const [priceGroups, setPriceGroups] = useState<RepairTypeGroup[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [urlModelDetails, setUrlModelDetails] = useState<ModelDetails | null>(null);
  const [loadingUrlModel, setLoadingUrlModel] = useState(false);

  // 1. Fetch models on brand change
  useEffect(() => {
    if (selectedBrand) {
      setLoadingModels(true);
      fetch(`/api/models?brandId=${selectedBrand.id}`)
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setModels(data); setSelectedModel(null); if (!urlModelId) setPriceGroups([]); })
        .catch(console.error)
        .finally(() => setLoadingModels(false));
    } else {
      setModels([]); setSelectedModel(null); if (!urlModelId) setPriceGroups([]);
    }
    setModelSearch('');
  }, [selectedBrand, urlModelId]);

  // 2. Fetch variant prices on model selection
  useEffect(() => {
    if (selectedModel) {
      setLoadingPrices(true);
      fetch(`/api/repair-variant-prices?modelId=${selectedModel.id}`)
        .then((r) => r.json())
        .then((data: RepairTypeGroup[]) => {
          if (Array.isArray(data)) {
            // Filter out variants with no price
            setPriceGroups(
              data
                .map((g) => ({ ...g, variants: g.variants.filter((v) => v.price !== null) }))
                .filter((g) => g.variants.length > 0)
            );
          }
        })
        .catch(console.error)
        .finally(() => setLoadingPrices(false));
    } else { if (!urlModelId) setPriceGroups([]); }
  }, [selectedModel, urlModelId]);

  // 3. React to URL changes
  useEffect(() => {
    if (urlModelId) {
      setLoadingUrlModel(true);
      setLoadingPrices(true);
      fetch(`/api/models/${urlModelId}`)
        .then((r) => { if (!r.ok) throw new Error('not found'); return r.json(); })
        .then((data: ModelDetails) => { setUrlModelDetails(data); setSelectedBrand(null); setSelectedModel(null); })
        .catch(() => setUrlModelDetails(null))
        .finally(() => setLoadingUrlModel(false));

      fetch(`/api/repair-variant-prices?modelId=${urlModelId}`)
        .then((r) => r.json())
        .then((data: RepairTypeGroup[]) => {
          if (Array.isArray(data)) {
            setPriceGroups(
              data
                .map((g) => ({ ...g, variants: g.variants.filter((v) => v.price !== null) }))
                .filter((g) => g.variants.length > 0)
            );
            // Smoothly scroll down to the buscador section so the user sees results instantly
            setTimeout(() => {
              document.getElementById('buscador')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingPrices(false));
    } else {
      setUrlModelDetails(null); setPriceGroups([]);
    }
  }, [urlModelId]);

  const filteredModels = models.filter((m) => m.name.toLowerCase().includes(modelSearch.toLowerCase()));
  const activeModelName = urlModelDetails ? urlModelDetails.name : selectedModel?.name;
  const activeBrandName = urlModelDetails ? urlModelDetails.brand.name : selectedBrand?.name;
  const activeModelImageUrl = urlModelDetails ? urlModelDetails.imageUrl : selectedModel?.imageUrl;
  const isModelActive = !!urlModelId || !!selectedModel;

  const handleSelectModelLocal = (model: Model) => router.push(`/?modelId=${model.id}`, { scroll: false });

  const handleClearSelection = () => {
    router.push('/');
    setSelectedBrand(null); setSelectedModel(null); setUrlModelDetails(null); setPriceGroups([]);
  };

  const getWhatsAppLink = (repairTypeName: string, variantName: string, price: number) => {
    const formattedPrice = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const message = `Olá iMaster! Gostaria de solicitar o conserto de *${repairTypeName} (${variantName})* para o meu *${activeBrandName} ${activeModelName}*. Vi no site que o valor é de *${formattedPrice}* e gostaria de agendar.`;
    return `https://wa.me/5512991556459?text=${encodeURIComponent(message)}`;
  };

  const getEstimatedTime = (repairName: string) => {
    const name = repairName.toLowerCase();
    if (name.includes('tela')) return '30 a 60 min';
    if (name.includes('bateria')) return '30 a 40 min';
    if (name.includes('conector')) return '40 a 60 min';
    if (name.includes('placa')) return '1 a 3 dias';
    return '1 a 2 horas';
  };

  const tierColors: Record<string, { bg: string; border: string; text: string }> = {
    basic:    { bg: 'rgba(107,114,128,0.08)',  border: 'rgba(107,114,128,0.2)',  text: '#4b5563' },
    básico:   { bg: 'rgba(107,114,128,0.08)',  border: 'rgba(107,114,128,0.2)',  text: '#4b5563' },
    standard: { bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.2)',   text: '#2563eb' },
    padrão:   { bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.2)',   text: '#2563eb' },
    premium:  { bg: 'rgba(139,92,246,0.08)',   border: 'rgba(139,92,246,0.2)',   text: '#7c3aed' },
    original: { bg: 'rgba(5,150,105,0.08)',    border: 'rgba(5,150,105,0.2)',    text: '#059669' },
    plus:     { bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.2)',   text: '#d97706' },
    oem:      { bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.2)',   text: '#2563eb' },
  };
  const getTierStyle = (name: string) =>
    tierColors[name.toLowerCase()] ?? { bg: 'rgba(10,61,44,0.06)', border: 'rgba(10,61,44,0.15)', text: 'var(--color-primary)' };

  return (
    <section style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 20px' }}>

      {/* CASE A: No model selected */}
      {!isModelActive && (
        <>
          {/* Brand Selection */}
          <div style={{ marginBottom: '50px' }}>
            <h2 className="buscador-title">Selecione a marca do seu aparelho</h2>
            <div className="brands-grid-container">
              {brands.map((brand) => {
                const isSelected = selectedBrand?.id === brand.id;
                return (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand)}
                    className={`brand-card-premium ${isSelected ? 'selected' : ''}`}
                  >
                    {brand.logoUrl ? (
                      <div style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <img src={brand.logoUrl} alt={`Logo ${brand.name}`} style={{ maxHeight: '100%', maxWidth: '80%', objectFit: 'contain' }} />
                      </div>
                    ) : null}
                    <span className="brand-card-name" style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}>
                      {brand.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Selection */}
          {selectedBrand && (
            <div style={{ marginBottom: '40px' }}>
              <h2 className="buscador-title">Qual é o modelo do seu {selectedBrand.name}?</h2>
              {loadingModels ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>Carregando modelos...</div>
              ) : (
                <div>
                  <div className="search-input-wrapper-premium">
                    <svg className="search-input-icon-premium" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      placeholder={`Buscar modelo ${selectedBrand.name}...`}
                      className="search-input-premium"
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                    />
                  </div>
                  <div className="models-grid-box">
                    {filteredModels.length === 0 ? (
                      <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                        Nenhum modelo encontrado.
                      </div>
                    ) : (
                      filteredModels.map((model) => (
                        <button key={model.id} onClick={() => handleSelectModelLocal(model)} className="model-capsule-btn">
                          {model.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* CASE B: Model selected - show prices */}
      {isModelActive && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '24px' }}>
            <button
              onClick={handleClearSelection}
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.85rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Escolher outro modelo
            </button>
          </div>

          {loadingUrlModel || loadingPrices ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
              Carregando orçamento...
            </div>
          ) : (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.8px' }}>
                Orçamento para: <span style={{ color: 'var(--color-primary)' }}>{activeBrandName} {activeModelName}</span>
              </h2>

              <div className="budget-container">
                {/* Left: Model image */}
                <div className="glass-card budget-image-panel">
                  {activeModelImageUrl ? (
                    <img src={activeModelImageUrl} alt={`${activeBrandName} ${activeModelName}`} style={{ maxWidth: '100%', maxHeight: '260px', objectFit: 'contain', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.4))' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '30px 20px' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(10,61,44,0.06)', border: '1px solid rgba(10,61,44,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Imagem ilustrativa</span>
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--color-text)', letterSpacing: '-0.3px' }}>
                      {activeBrandName} {activeModelName}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                      Peças premium · Garantia de até 1 ano
                    </p>
                  </div>
                </div>

                {/* Right: Price groups */}
                <div className="budget-prices-panel">
                  {priceGroups.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
                      <p style={{ margin: '0 0 20px 0', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                        Nenhum preço configurado para este modelo ainda. Entre em contato pelo WhatsApp para um orçamento personalizado!
                      </p>
                      <a href={`https://wa.me/5512991556459?text=${encodeURIComponent(`Olá! Gostaria de fazer uma cotação para o meu ${activeBrandName} ${activeModelName}.`)}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        Fazer Cotação Personalizada
                      </a>
                    </div>
                  ) : (
                    priceGroups.map((group) => (
                      <div key={group.repairTypeId} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {/* Group header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                            ⏱ {getEstimatedTime(group.repairTypeName)}
                          </span>
                          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                        </div>
                        <h3 style={{ margin: '0 0 14px 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                          {group.repairTypeName}
                        </h3>

                        {/* Variants */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {group.variants.map((variant) => {
                            const ts = getTierStyle(variant.variantName);
                            return (
                              <div
                                key={variant.variantId}
                                className="glass-card"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '16px',
                                  flexWrap: 'wrap',
                                  padding: '20px 24px',
                                  borderLeft: `4px solid ${ts.text}`,
                                }}
                              >
                                <div style={{ flex: '1 1 220px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                    <span
                                      style={{
                                        background: ts.bg,
                                        border: `1px solid ${ts.border}`,
                                        color: ts.text,
                                        borderRadius: '6px',
                                        padding: '3px 10px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase',
                                      }}
                                    >
                                      {variant.variantName}
                                    </span>
                                  </div>
                                  {variant.description && (
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                      {variant.description}
                                    </p>
                                  )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                      Valor
                                    </div>
                                    <div style={{ fontSize: '1.7rem', fontWeight: 850, color: 'var(--color-primary)', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.5px', lineHeight: 1 }}>
                                      {variant.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </div>
                                    {variant.installmentsEnabled && variant.installmentCount && variant.installmentValue && (
                                      <div style={{ fontSize: '0.8rem', color: ts.text, marginTop: '4px', fontWeight: 600 }}>
                                        ou {variant.installmentCount}x de{' '}
                                        {variant.installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                      </div>
                                    )}
                                  </div>

                                  <a
                                    href={getWhatsAppLink(group.repairTypeName, variant.variantName, variant.price!)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{ background: '#22c55e', color: '#081c0e', boxShadow: '0 4px 14px rgba(34,197,94,0.25)', fontWeight: 700, whiteSpace: 'nowrap' }}
                                  >
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.907h.004c4.368 0 7.926-3.558 7.93-7.93a7.897 7.897 0 0 0-2.327-5.645zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.69-4.98c-.202-.101-1.202-.594-1.392-.66-.189-.072-.327-.108-.466.101-.139.208-.538.66-.66.8-.12.137-.24.154-.442.053-2.001-1.004-3.593-2.522-4.602-4.269-.153-.263-.015-.407.117-.538.12-.119.26-.302.39-.453.13-.152.173-.258.26-.43.087-.172.043-.323-.021-.453-.065-.13-1.066-2.569-1.464-3.529-.387-.93-.78-1.03-1.066-1.037l-.466-.008c-.16 0-.418.06-.637.297-.22.238-.84.82-.84 2.002 0 1.182.859 2.323.978 2.48.12.158 1.69 2.581 4.093 3.616.571.246 1.018.393 1.364.502.574.181 1.097.156 1.512.094.462-.069 1.402-.572 1.6-.1.198-.473.198-.878.139-.949-.06-.072-.198-.108-.4-.209z" />
                                    </svg>
                                    Agendar
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
