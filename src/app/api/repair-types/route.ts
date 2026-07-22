import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// Public endpoint to get all repair types
export async function GET() {
  try {
    const types = await prisma.repairType.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(types);
  } catch (error) {
    console.error('Error fetching repair types:', error);
    return NextResponse.json({ error: 'Erro ao buscar tipos de conserto' }, { status: 500 });
  }
}

// Protected endpoint to create/update repair types (optional, for flexibility)
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const type = await prisma.repairType.create({
      data: { name, description },
    });

    return NextResponse.json(type, { status: 201 });
  } catch (error: any) {
    console.error('Error creating repair type:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe um tipo de conserto com este nome' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro ao criar tipo de conserto' }, { status: 500 });
  }
}
