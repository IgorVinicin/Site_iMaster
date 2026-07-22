'use client';

import React, { useState, useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  isComparison?: boolean;
}

const STATIC_FAQS: FAQItem[] = [
  {
    question: 'As peças utilizadas são originais?',
    answer:
      'Trabalhamos com peças de altíssima qualidade (linha premium), que seguem rigorosamente todas as especificações e padrões de desempenho de fábrica, garantindo compatibilidade, brilho, toque e durabilidade perfeitos.',
  },
  {
    question: 'Quanto tempo demora a troca de uma tela?',
    answer:
      'A maioria das trocas de tela é realizada em menos de 1 hora por nossos técnicos especializados. Você pode aguardar em nossa recepção climatizada ou retirar seu aparelho no mesmo dia.',
  },
  {
    question: 'Vocês oferecem garantia nos reparos?',
    answer:
      'Sim! Oferecemos garantia estendida de até 1 ano (12 meses) contra qualquer defeito de fabricação ou funcionamento na peça substituída. Nossa garantia reflete a confiança que temos na qualidade dos nossos componentes e na precisão da nossa mão de obra.',
  },
  {
    question: 'Onde fica a loja de vocês e qual o horário de funcionamento?',
    answer:
      'Nossa loja principal está localizada na Avenida dos Evangélicos, Campos dos Alemães - São José dos Campos - SP, CEP 12239-120. Funcionamos de Segunda a Sexta das 9h às 18h e aos Sábados das 9h às 13h.',
  },
  {
    question: 'Preciso agendar antes de ir ou posso ir direto?',
    answer:
      'Você pode ir direto! No entanto, o agendamento prévio pelo WhatsApp nos permite reservar a peça no estoque e garantir que um técnico especialista esteja disponível para iniciar o reparo imediatamente ao chegar.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [comparisonFaqs, setComparisonFaqs] = useState<FAQItem[]>([]);
  const [activeTab, setActiveTab] = useState<'geral' | 'pecas'>('geral');

  useEffect(() => {
    fetch('/api/comparison-faqs')
      .then((r) => r.json())
      .then((data: { question: string; answer: string }[]) => {
        setComparisonFaqs(data.map((d) => ({ ...d, isComparison: true })));
      })
      .catch(() => {});
  }, []);

  const displayedFaqs = activeTab === 'geral' ? STATIC_FAQS : comparisonFaqs;

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Tab switcher */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          background: '#f3f4f6',
          borderRadius: '12px',
          padding: '4px',
        }}
      >
        {[
          { key: 'geral', label: 'Perguntas Gerais' },
          { key: 'pecas', label: 'Comparativo de Peças' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key as 'geral' | 'pecas');
              setOpenIndex(null);
            }}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.88rem',
              fontFamily: "'Outfit', sans-serif",
              transition: 'all 0.2s ease',
              background: activeTab === key ? 'var(--color-primary)' : 'transparent',
              color: activeTab === key ? '#ffffff' : 'var(--color-text-muted)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* FAQ items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {displayedFaqs.length === 0 && activeTab === 'pecas' && (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              fontSize: '0.9rem',
            }}
          >
            Nenhuma dúvida comparativa cadastrada ainda.
          </div>
        )}

        {displayedFaqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              style={{
                background: '#ffffff',
                border: `1px solid ${isOpen ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isOpen ? '0 8px 20px rgba(10, 61, 44, 0.08)' : 'none',
              }}
            >
              <button
                onClick={() => handleToggle(index)}
                style={{
                  width: '100%',
                  padding: '18px 22px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  color: isOpen ? 'var(--color-primary)' : 'var(--color-text)',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  fontFamily: "'Outfit', sans-serif",
                  gap: '16px',
                  background: 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.isComparison && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        background: 'rgba(10, 61, 44, 0.08)',
                        color: 'var(--color-primary)',
                        borderRadius: '20px',
                        fontWeight: 700,
                        letterSpacing: '0.3px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      PEÇAS
                    </span>
                  )}
                  <span>{item.question}</span>
                </div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isOpen ? 'var(--color-primary)' : 'currentColor'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    flexShrink: 0,
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div
                style={{
                  maxHeight: isOpen ? '400px' : '0',
                  opacity: isOpen ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  style={{
                    padding: '0 22px 18px 22px',
                    color: '#374151',
                    fontSize: '0.92rem',
                    lineHeight: '1.65',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '16px',
                  }}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
