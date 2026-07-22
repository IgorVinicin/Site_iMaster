import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// PUT/DELETE /api/repair-variants/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { id } = await params;
    const { name, description, sortOrder } = await request.json();

    if (!name) return NextResponse.json({ error: 'name é obrigatório' }, { status: 400 });

    const variant = await prisma.repairVariant.update({
      where: { id },
      data: { name: name.trim(), description, sortOrder: sortOrder ?? 0 },
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.error('Error updating variant:', error);
    return NextResponse.json({ error: 'Erro ao atualizar variante' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso proibido. Apenas administradores gerais podem excluir.' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.repairVariant.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting variant:', error);
    return NextResponse.json({ error: 'Erro ao excluir variante' }, { status: 500 });
  }
}
