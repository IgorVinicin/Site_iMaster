import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// Protected endpoint to update a brand
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { name, logoUrl, showInMenu } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Nome da marca é obrigatório' }, { status: 400 });
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: { 
        name, 
        logoUrl,
        showInMenu: showInMenu !== undefined ? showInMenu : undefined
      },
    });

    return NextResponse.json(brand);
  } catch (error: any) {
    console.error('Error updating brand:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe uma marca com este nome' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro ao atualizar marca' }, { status: 500 });
  }
}

// Protected endpoint to delete a brand
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso proibido. Apenas administradores gerais podem excluir.' }, { status: 403 });
    }

    const { id } = await params;

    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Marca excluída com sucesso' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json({ error: 'Erro ao excluir marca' }, { status: 500 });
  }
}
