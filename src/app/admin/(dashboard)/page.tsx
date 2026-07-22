import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Disable cache so it always shows fresh stats

export default async function AdminDashboard() {
  const brandsCount = await prisma.brand.count();
  const modelsCount = await prisma.deviceModel.count();
  const pricesCount = await prisma.repairVariantPrice.count();
  const typesCount = await prisma.repairType.count();

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Painel de Controle</h1>
      </div>

      <p style={{ marginBottom: '2rem' }}>Bem-vindo ao painel administrativo do iMaster. Aqui você gerencia o catálogo de marcas, modelos e preços exibidos no site.</p>

      <div className="form-grid">
        <div className="admin-card text-center" style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '8px' }}>
            {brandsCount}
          </h2>
          <p style={{ margin: 0, fontWeight: 600 }}>Marcas Cadastradas</p>
        </div>

        <div className="admin-card text-center" style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '8px' }}>
            {modelsCount}
          </h2>
          <p style={{ margin: 0, fontWeight: 600 }}>Modelos Disponíveis</p>
        </div>

        <div className="admin-card text-center" style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '8px' }}>
            {pricesCount}
          </h2>
          <p style={{ margin: 0, fontWeight: 600 }}>Preços Configurados</p>
        </div>

        <div className="admin-card text-center" style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '8px' }}>
            {typesCount}
          </h2>
          <p style={{ margin: 0, fontWeight: 600 }}>Tipos de Conserto</p>
        </div>
      </div>
    </div>
  );
}
