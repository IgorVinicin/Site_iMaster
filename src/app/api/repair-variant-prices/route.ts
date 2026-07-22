import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// GET /api/repair-variant-prices?modelId=...
// Returns all repair types with their variants and prices for the given model
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('modelId');

    if (!modelId) {
      return NextResponse.json({ error: 'modelId é obrigatório' }, { status: 400 });
    }

    const repairTypes = await prisma.repairType.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        variants: {
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          include: {
            prices: {
              where: { modelId },
            },
          },
        },
      },
    });

    // Shape: [{ repairTypeId, repairTypeName, variants: [{ variantId, variantName, description, price, installmentsEnabled, installmentCount, installmentValue }] }]
    const result = repairTypes
      .filter((rt) => rt.variants.length > 0)
      .map((rt) => ({
        repairTypeId: rt.id,
        repairTypeName: rt.name,
        variants: rt.variants.map((v) => {
          const priceRecord = v.prices[0] ?? null;
          return {
            variantId: v.id,
            variantName: v.name,
            description: v.description,
            sortOrder: v.sortOrder,
            price: priceRecord?.price ?? null,
            installmentsEnabled: priceRecord?.installmentsEnabled ?? false,
            installmentCount: priceRecord?.installmentCount ?? null,
            installmentValue: priceRecord?.installmentValue ?? null,
          };
        }),
      }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching variant prices:', error);
    return NextResponse.json({ error: 'Erro ao buscar preços' }, { status: 500 });
  }
}

// POST /api/repair-variant-prices  → upsert a price for a variant+model (admin)
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { variantId, modelId, price, installmentsEnabled, installmentCount, installmentValue } =
      await request.json();

    if (!variantId || !modelId) {
      return NextResponse.json({ error: 'variantId e modelId são obrigatórios' }, { status: 400 });
    }

    // If price is empty/null, delete the record
    if (price === null || price === undefined || price === '') {
      await prisma.repairVariantPrice.deleteMany({ where: { variantId, modelId } });
      return NextResponse.json({ success: true, message: 'Preço removido' });
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      return NextResponse.json({ error: 'Preço inválido' }, { status: 400 });
    }

    const record = await prisma.repairVariantPrice.upsert({
      where: { variantId_modelId: { variantId, modelId } },
      update: {
        price: numericPrice,
        installmentsEnabled: installmentsEnabled ?? false,
        installmentCount: installmentsEnabled ? (installmentCount ?? null) : null,
        installmentValue: installmentsEnabled ? (installmentValue ?? null) : null,
      },
      create: {
        variantId,
        modelId,
        price: numericPrice,
        installmentsEnabled: installmentsEnabled ?? false,
        installmentCount: installmentsEnabled ? (installmentCount ?? null) : null,
        installmentValue: installmentsEnabled ? (installmentValue ?? null) : null,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Error saving variant price:', error);
    return NextResponse.json({ error: 'Erro ao salvar preço' }, { status: 500 });
  }
}
