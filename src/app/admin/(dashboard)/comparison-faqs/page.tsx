'use client';

import { useState, useEffect } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  active: boolean;
}

export default function AdminComparisonFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newSortOrder, setNewSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Edit state
  const [editData, setEditData] = useState<Partial<FAQ>>({});

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/comparison-faqs');
      const data = await res.json();
      setFaqs(data);
    } catch {
      setError('Erro ao carregar FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/comparison-faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQuestion.trim(), answer: newAnswer.trim(), sortOrder: newSortOrder }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Erro ao criar FAQ');
      }
      setNewQuestion('');
      setNewAnswer('');
      setNewSortOrder(0);
      setSuccess('FAQ criada!');
      fetchFaqs();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setEditData({ question: faq.question, answer: faq.answer, sortOrder: faq.sortOrder, active: faq.active });
  };

  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/comparison-faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Erro ao salvar');
      setEditingId(null);
      setSuccess('FAQ atualizada!');
      fetchFaqs();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta FAQ?')) return;
    setDeleting(id);
    setError('');
    try {
      const res = await fetch(`/api/comparison-faqs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir');
      setSuccess('FAQ excluída.');
      fetchFaqs();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const defaultFaqs = [
    { question: 'Qual a diferença entre tela Basic e Premium?', answer: 'A tela Basic é compatível e funcional para uso diário. A tela Premium tem qualidade superior, com cores mais vivas, toque mais preciso e maior durabilidade — ideal para quem exige o melhor.' },
    { question: 'Vale a pena pagar mais pela tela Original?', answer: 'A tela Original é retirada de dispositivos novos de fábrica, com calibração perfeita e máxima fidelidade de cores. É a melhor opção para quem precisa de desempenho idêntico ao original, especialmente para uso profissional.' },
    { question: 'Qual bateria devo escolher: Basic ou Premium?', answer: 'A bateria Basic atende ao uso comum com boa durabilidade. A bateria Premium possui maior densidade energética, menor degradação ao longo do tempo e pode durar até 20% mais por ciclo de carga.' },
    { question: 'A garantia é a mesma para todas as variantes?', answer: 'Sim! Todas as variantes de peças têm garantia de até 1 ano contra defeitos de fabricação e instalação. A diferença está na qualidade da peça, não na nossa garantia de serviço.' },
  ];

  const handleSeedDefaults = async () => {
    if (!confirm('Isso vai adicionar 4 FAQs de exemplo. Continuar?')) return;
    setSaving(true);
    for (const faq of defaultFaqs) {
      await fetch('/api/comparison-faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq),
      });
    }
    setSaving(false);
    setSuccess('FAQs de exemplo adicionadas!');
    fetchFaqs();
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">FAQ Comparativo de Peças</h1>
        <p style={{ color: 'var(--admin-text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>
          Gerencie as perguntas exibidas no site sobre diferenças entre tipos e variantes de peças.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Create new FAQ */}
      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Nova Pergunta</h3>
          {faqs.length === 0 && (
            <button
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 16px' }}
              onClick={handleSeedDefaults}
              disabled={saving}
            >
              ✨ Adicionar perguntas de exemplo
            </button>
          )}
        </div>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Pergunta *</label>
            <input
              type="text"
              className="input-control"
              placeholder="Ex: Qual a diferença entre tela Basic e Premium?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Resposta *</label>
            <textarea
              className="input-control"
              rows={3}
              placeholder="Explique de forma clara e objetiva..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: '0 0 120px' }}>
              <label>Ordem</label>
              <input
                type="number"
                className="input-control"
                value={newSortOrder}
                onChange={(e) => setNewSortOrder(parseInt(e.target.value) || 0)}
                min={0}
                style={{ padding: '9px 12px' }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: '16px' }}
              disabled={saving || !newQuestion.trim() || !newAnswer.trim()}
            >
              {saving ? 'Salvando...' : '+ Adicionar FAQ'}
            </button>
          </div>
        </form>
      </div>

      {/* FAQ list */}
      {loading ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
          Carregando...
        </div>
      ) : faqs.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
          Nenhuma FAQ cadastrada ainda.
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Ord.</th>
                <th>Pergunta</th>
                <th style={{ width: '80px' }}>Status</th>
                <th style={{ width: '130px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) =>
                editingId === faq.id ? (
                  <tr key={faq.id}>
                    <td>
                      <input
                        type="number"
                        className="input-control"
                        style={{ width: '60px', padding: '6px 8px', fontSize: '0.85rem' }}
                        value={editData.sortOrder ?? 0}
                        onChange={(e) => setEditData((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-control"
                        style={{ marginBottom: '8px', fontSize: '0.9rem' }}
                        value={editData.question ?? ''}
                        onChange={(e) => setEditData((p) => ({ ...p, question: e.target.value }))}
                      />
                      <textarea
                        className="input-control"
                        rows={2}
                        style={{ resize: 'vertical', fontSize: '0.85rem' }}
                        value={editData.answer ?? ''}
                        onChange={(e) => setEditData((p) => ({ ...p, answer: e.target.value }))}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={editData.active ?? true}
                          onChange={(e) => setEditData((p) => ({ ...p, active: e.target.checked }))}
                        />
                        Ativa
                      </label>
                    </td>
                    <td />
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                        <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleSaveEdit(faq.id)} disabled={saving}>
                          Salvar
                        </button>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setEditingId(null)}>
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={faq.id}>
                    <td style={{ fontWeight: 600, color: 'var(--admin-text-muted)' }}>{faq.sortOrder}</td>
                    <td>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{faq.question}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', lineHeight: 1.5 }}>
                        {faq.answer.length > 120 ? faq.answer.slice(0, 120) + '...' : faq.answer}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '20px',
                          background: faq.active ? 'rgba(5, 150, 105, 0.1)' : 'rgba(156, 163, 175, 0.15)',
                          color: faq.active ? '#059669' : '#9ca3af',
                          fontWeight: 600,
                        }}
                      >
                        {faq.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => handleEdit(faq)}
                        >
                          Editar
                        </button>
                        <button
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            opacity: deleting === faq.id ? 0.5 : 1,
                          }}
                          onClick={() => handleDelete(faq.id)}
                          disabled={deleting === faq.id}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
