import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// GET /api/repair-variants?repairTypeId=...  → lista variantes de um tipo
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const repairTypeId = searchParams.get('repairTypeId');

    const where = repairTypeId ? { repairTypeId } : {};

    const variants = await prisma.repairVariant.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { repairType: { select: { id: true, name: true } } },
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json({ error: 'Erro ao buscar variantes' }, { status: 500 });
  }
}

// POST /api/repair-variants  → cria variante (admin)
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { repairTypeId, name, description, sortOrder } = await request.json();

    if (!repairTypeId || !name) {
      return NextResponse.json({ error: 'repairTypeId e name são obrigatórios' }, { status: 400 });
    }

    const variant = await prisma.repairVariant.create({
      data: { repairTypeId, name: name.trim(), description, sortOrder: sortOrder ?? 0 },
    });

    return NextResponse.json(variant, { status: 201 });
  } catch (error: any) {
    console.error('Error creating variant:', error);
    return NextResponse.json({ error: 'Erro ao criar variante' }, { status: 500 });
  }
}
