import { Suspense } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RepairSearch from '@/components/RepairSearch';
import FAQAccordion from '@/components/FAQAccordion';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';

export const revalidate = 60; // Cache the home page for 60 seconds (ISG)

export default async function Home() {
  // Fetch brands directly on the server
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="layout-container">
      <Header />
      
      <main className="main-content">
        
        {/* Hero Section */}
        <section style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)', borderBottom: '1px solid var(--color-border)' }}>
          <div className={styles.heroContainer}>
            
            <div className={styles.heroContent}>
              <div className={styles.badgeContainer}>
                <span className={styles.badgeText}>Assistência Técnica Autorizada e Especializada</span>
              </div>
              
              <h1>
                Consulte o valor do reparo do seu celular em segundos.
              </h1>
              
              <p>
                Escolha a marca, encontre seu modelo e veja instantaneamente os valores dos reparos disponíveis. 
                Transparência total para sua manutenção.
              </p>
              
              <div className={styles.heroActions}>
                <a href="#buscador" className="btn-primary">
                  Consultar agora
                </a>
                <a href="#diferenciais" className="btn-secondary">
                  Ver diferenciais
                </a>
              </div>
            </div>

            <div className={styles.heroImageContainer}>
              <div className={styles.heroImageWrapper}>
                <Image 
                  src="/cell.png"
                  alt="Smartphone premium iMaster Smart Repair Hub"
                  width={680}
                  height={480}
                  priority
                  className={styles.heroImage}
                />
              </div>
            </div>

          </div>
        </section>

        {/* Dynamic Selector Area */}
        <section id="buscador" style={{ padding: '4rem 2rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
            <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Carregando buscador iMaster...</div>}>
              <RepairSearch initialBrands={brands} />
            </Suspense>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section id="como-funciona" className={styles.section} style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className={styles.sectionHeader}>
            <span className="badge-premium" style={{ marginBottom: '16px' }}>Simples & Transparente</span>
            <h2>Como funciona o serviço?</h2>
            <p>Seu aparelho reparado com facilidade e segurança em apenas 3 passos rápidos.</p>
          </div>

          <div className={styles.howItWorksGrid}>
            {/* Passo 1 */}
            <div className={`${styles.howItWorksStep} glass-card`}>
              <span className={styles.stepNumber}>Passo 01</span>
              <h3>Consulte no Buscador</h3>
              <p>Escolha a marca e o modelo do seu celular em nosso buscador acima para visualizar os preços dos reparos instantaneamente.</p>
            </div>

            {/* Passo 2 */}
            <div className={`${styles.howItWorksStep} glass-card`}>
              <span className={styles.stepNumber}>Passo 02</span>
              <h3>Agende pelo WhatsApp</h3>
              <p>Clique no botão do conserto desejado para abrir o WhatsApp com todas as informações prontas e agendar o horário com nossos técnicos.</p>
            </div>

            {/* Passo 3 */}
            <div className={`${styles.howItWorksStep} glass-card`}>
              <span className={styles.stepNumber}>Passo 03</span>
              <h3>Reparo na Loja</h3>
              <p>Traga seu aparelho à nossa loja física. O conserto é feito na hora por profissionais qualificados, com peças premium e garantia de 1 ano.</p>
            </div>
          </div>
        </section>

        {/* Tipos de Reparo Section */}
        <section id="reparos" className={styles.section} style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className={styles.sectionHeader}>
            <span className="badge-premium" style={{ marginBottom: '16px' }}>Especialidades</span>
            <h2>O que consertamos?</h2>
            <p>Oferecemos suporte completo para as principais falhas do seu smartphone.</p>
          </div>

          <div className={styles.repairsGrid}>
            {/* Card 1: Tela */}
            <div className={`${styles.repairCard} glass-card`}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
              </div>
              <h3>Troca de Tela / Vidro</h3>
              <p>Substituição de telas quebradas, touch com falhas ou display manchado. Linha premium com cores e toque originais.</p>
            </div>

            {/* Card 2: Bateria */}
            <div className={`${styles.repairCard} glass-card`}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="16" height="12" rx="2" ry="2" />
                  <line x1="22" y1="11" x2="22" y2="13" />
                </svg>
              </div>
              <h3>Troca de Bateria</h3>
              <p>Seu celular descarrega rápido, esquenta ou desligou de vez? Trocamos por baterias homologadas de alta durabilidade.</p>
            </div>

            {/* Card 3: Placa */}
            <div className={`${styles.repairCard} glass-card`}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <line x1="9" y1="1" x2="9" y2="4" />
                  <line x1="15" y1="1" x2="15" y2="4" />
                  <line x1="9" y1="20" x2="9" y2="23" />
                  <line x1="15" y1="20" x2="15" y2="23" />
                  <line x1="20" y1="9" x2="23" y2="9" />
                  <line x1="20" y1="15" x2="23" y2="15" />
                  <line x1="1" y1="9" x2="4" y2="9" />
                  <line x1="1" y1="15" x2="4" y2="15" />
                </svg>
              </div>
              <h3>Reparo de Placa (Microeletrônica)</h3>
              <p>Soluções avançadas para placas mãe com curto-circuito, falhas de carga (U2 Tristar), Wi-Fi, sinal ou Face ID/Touch ID.</p>
            </div>

            {/* Card 4: Conector */}
            <div className={`${styles.repairCard} glass-card`}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 10h-1.25A4.75 4.75 0 0 0 12 14.75v0A4.75 4.75 0 0 0 7.25 10H6a4 4 0 0 0-4 4v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4z" />
                  <path d="M12 2v8" />
                </svg>
              </div>
              <h3>Conector de Carga</h3>
              <p>Substituição do conector Type-C ou Lightning quando o celular não reconhece o cabo, carrega lento ou tem mau contato.</p>
            </div>

            {/* Card 5: Câmeras e Tampas */}
            <div className={`${styles.repairCard} glass-card`}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <h3>Câmeras & Vidro Traseiro</h3>
              <p>Reparo de lentes arranhadas, foco trêmulo e câmeras queimadas. Troca de tampa traseira de vidro com acabamento original.</p>
            </div>

            {/* Card 6: Danos por Água */}
            <div className={`${styles.repairCard} glass-card`}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
                </svg>
              </div>
              <h3>Danos por Líquidos</h3>
              <p>Banho químico por ultrassom e desoxidação profissional para celulares que caíram na piscina, privada ou sofreram umidade.</p>
            </div>
          </div>
        </section>

        {/* Por que escolher a iMaster? */}
        <section id="diferenciais" className={styles.section} style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className={styles.sectionHeader}>
            <span className="badge-premium" style={{ marginBottom: '16px' }}>Excelência & Garantia</span>
            <h2>Por que escolher a iMaster?</h2>
            <p>Excelência técnica e compromisso com a longevidade do seu dispositivo.</p>
          </div>

          <div className={styles.diferenciaisGrid}>
            
            {/* Card 1 */}
            <div className={`${styles.diferencialCard} glass-card`}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <h3>Técnicos Especializados</h3>
              <p>Equipe certificada em reparos complexos de placa e microeletrônica avançada.</p>
            </div>

            {/* Card 2 */}
            <div className={`${styles.diferencialCard} glass-card`}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <line x1="9" y1="1" x2="9" y2="4" />
                  <line x1="15" y1="1" x2="15" y2="4" />
                  <line x1="9" y1="20" x2="9" y2="23" />
                  <line x1="15" y1="20" x2="15" y2="23" />
                  <line x1="20" y1="9" x2="23" y2="9" />
                  <line x1="20" y1="15" x2="23" y2="15" />
                  <line x1="1" y1="9" x2="4" y2="9" />
                  <line x1="1" y1="15" x2="4" y2="15" />
                </svg>
              </div>
              <h3>Peças de Qualidade</h3>
              <p>Utilizamos apenas componentes premium com padrões originais de fábrica.</p>
            </div>

            {/* Card 3 */}
            <div className={`${styles.diferencialCard} glass-card`}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 11 11 13 15 9" />
                </svg>
              </div>
              <h3>Garantia Estendida</h3>
              <p>Oferecemos garantia de até 1 ano em todos os serviços realizados em nossa unidade.</p>
            </div>

            {/* Card 4 */}
            <div className={`${styles.diferencialCard} glass-card`}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3>Atendimento Rápido</h3>
              <p>Muitos reparos, como troca de tela e bateria, são feitos em menos de 1 hora.</p>
            </div>

            {/* Card 5 */}
            <div className={`${styles.diferencialCard} glass-card`}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 6v12" />
                </svg>
              </div>
              <h3>Orçamento Gratuito</h3>
              <p>Avaliação detalhada do seu problema sem compromisso ou taxas de análise.</p>
            </div>

            {/* Card 6 */}
            <div className={`${styles.diferencialCard} glass-card`}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </div>
              <h3>Suporte Pós-Venda</h3>
              <p>Canais de comunicação sempre abertos para tirar qualquer dúvida após o reparo.</p>
            </div>

          </div>
        </section>

        {/* O que dizem nossos clientes */}
        <section id="depoimentos" className={styles.section} style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className={styles.depoimentosHeader}>
            <div className={styles.depoimentosHeaderLeft}>
              <h2>O que dizem nossos clientes</h2>
              <div className={styles.ratingContainer}>
                <span className={styles.ratingValue}>4.9</span>
                <div className={styles.starsContainer}>
                  <div className={styles.starsRow}>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <span className={styles.ratingMeta}>Média baseada em +2.000 avaliações no Google</span>
                </div>
              </div>
            </div>

            <a 
              href="https://www.google.com/search?q=iMaster+Assistencia+Tecnica" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.002c1.49 0 2.858.547 3.908 1.457l3.14-3.14C19.102 2.992 16.729 2 13.99 2 8.134 2 3.39 6.745 3.39 12.6s4.743 10.6 10.6 10.6c5.96 0 10.514-4.184 10.514-10.686 0-.613-.075-1.2-.214-1.73H12.24z" />
              </svg>
              Ver todas no Google
            </a>
          </div>

          <div className={styles.depoimentosGrid}>
            
            {/* Depoimento 1 */}
            <div className={`${styles.depoimentoCard} glass-card`}>
              <div className={styles.depoimentoUser}>
                <div className={styles.avatar}>RS</div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>Ricardo S.</span>
                  <span className={styles.userTime}>há 2 dias</span>
                </div>
                <div className={styles.googleIconWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.002c1.49 0 2.858.547 3.908 1.457l3.14-3.14C19.102 2.992 16.729 2 13.99 2 8.134 2 3.39 6.745 3.39 12.6s4.743 10.6 10.6 10.6c5.96 0 10.514-4.184 10.514-10.686 0-.613-.075-1.2-.214-1.73H12.24z" />
                  </svg>
                </div>
              </div>
              <p className={styles.depoimentoText}>
                &ldquo;Serviço impecável. Trocaram o vidro do meu iPhone 15 Pro Max em 40 minutos e ficou perfeito. O atendimento é diferenciado.&rdquo;
              </p>
            </div>

            {/* Depoimento 2 */}
            <div className={`${styles.depoimentoCard} glass-card`}>
              <div className={styles.depoimentoUser}>
                <div className={styles.avatar}>FL</div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>Fernanda L.</span>
                  <span className={styles.userTime}>há 1 semana</span>
                </div>
                <div className={styles.googleIconWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.002c1.49 0 2.858.547 3.908 1.457l3.14-3.14C19.102 2.992 16.729 2 13.99 2 8.134 2 3.39 6.745 3.39 12.6s4.743 10.6 10.6 10.6c5.96 0 10.514-4.184 10.514-10.686 0-.613-.075-1.2-.214-1.73H12.24z" />
                  </svg>
                </div>
              </div>
              <p className={styles.depoimentoText}>
                &ldquo;Levei meu Samsung que não ligava e resolveram o problema na placa no mesmo dia. Preço justo e muita transparência. Recomendo!&rdquo;
              </p>
            </div>

            {/* Depoimento 3 */}
            <div className={`${styles.depoimentoCard} glass-card`}>
              <div className={styles.depoimentoUser}>
                <div className={styles.avatar}>MO</div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>Marcos O.</span>
                  <span className={styles.userTime}>há 1 mês</span>
                </div>
                <div className={styles.googleIconWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.002c1.49 0 2.858.547 3.908 1.457l3.14-3.14C19.102 2.992 16.729 2 13.99 2 8.134 2 3.39 6.745 3.39 12.6s4.743 10.6 10.6 10.6c5.96 0 10.514-4.184 10.514-10.686 0-.613-.075-1.2-.214-1.73H12.24z" />
                  </svg>
                </div>
              </div>
              <p className={styles.depoimentoText}>
                &ldquo;Melhor assistência técnica da região. O site facilitou muito saber o preço antes mesmo de sair de casa. Transparência nota 10.&rdquo;
              </p>
            </div>

          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className={styles.section}>
          <div className={styles.faqGrid}>
            
            <div className={styles.faqInfo}>
              <div>
                <h2>Perguntas Frequentes</h2>
                <p>Tire suas principais dúvidas sobre nossos serviços de reparo e garantia.</p>
              </div>

              <div className={styles.duvidasCard}>
                <h4>Ainda com dúvidas?</h4>
                <p>Fale diretamente com um técnico agora mesmo via WhatsApp e receba uma orientação personalizada.</p>
                <a 
                  href="https://wa.me/5512991556459?text=Ol%C3%A1%20iMaster!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20reparo%20do%20meu%20aparelho." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  Falar com especialista
                </a>
              </div>
            </div>

            <div>
              <FAQAccordion />
            </div>

          </div>
        </section>

        {/* Final CTA Section */}
        <section className={styles.section} style={{ paddingBottom: '8rem' }}>
          <div className={styles.finalCtaContainer}>
            <span className="badge-premium">Orçamento Imediato</span>
            <h2>Pronto para dar vida nova ao seu smartphone?</h2>
            <p>
              Não sofra mais com a tela quebrada ou bateria viciada. Nossa equipe técnica está pronta para atendê-lo e realizar o reparo expresso que seu celular merece.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
              <a 
                href="https://wa.me/5512991556459?text=Ol%C3%A1%20iMaster!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20o%20meu%20celular." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary"
                style={{ padding: '16px 36px', fontSize: '0.9rem' }}
              >
                Conversar no WhatsApp
              </a>
              <a 
                href="#buscador" 
                className="btn-secondary"
                style={{ padding: '16px 36px', fontSize: '0.9rem' }}
              >
                Consultar Outros Preços
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
