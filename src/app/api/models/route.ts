import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// Public endpoint to get models (can filter by brandId, search, and page/limit)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const search = searchParams.get('search');

    const where: any = {};
    if (brandId) {
      where.brandId = brandId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (pageParam) {
      const page = parseInt(pageParam) || 1;
      const limit = parseInt(limitParam || '10') || 10;
      const skip = (page - 1) * limit;

      const [models, total] = await Promise.all([
        prisma.deviceModel.findMany({
          where,
          include: { brand: true },
          orderBy: { name: 'asc' },
          skip,
          take: limit,
        }),
        prisma.deviceModel.count({ where }),
      ]);

      return NextResponse.json({
        data: models,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      });
    }

    const models = await prisma.deviceModel.findMany({
      where,
      include: {
        brand: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Erro ao buscar modelos' }, { status: 500 });
  }
}

// Protected endpoint to create a model
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { name, brandId, imageUrl } = await request.json();
    if (!name || !brandId) {
      return NextResponse.json({ error: 'Nome e Marca são obrigatórios' }, { status: 400 });
    }

    const model = await prisma.deviceModel.create({
      data: { name, brandId, imageUrl: imageUrl || null },
      include: { brand: true }
    });

    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json({ error: 'Erro ao criar modelo' }, { status: 500 });
  }
}
