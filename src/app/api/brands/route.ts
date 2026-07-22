import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// Public endpoint to get all brands (can be filtered by showInMenu)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyMenu = searchParams.get('showInMenu') === 'true';

    const where: any = {};
    if (onlyMenu) {
      where.showInMenu = true;
    }

    const brands = await prisma.brand.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Erro ao buscar marcas' }, { status: 500 });
  }
}

// Protected endpoint to create a brand
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { name, logoUrl, showInMenu } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Nome da marca é obrigatório' }, { status: 400 });
    }

    const brand = await prisma.brand.create({
      data: { 
        name, 
        logoUrl,
        showInMenu: showInMenu !== undefined ? showInMenu : true
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error: any) {
    console.error('Error creating brand:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe uma marca com este nome' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro ao criar marca' }, { status: 500 });
  }
}
