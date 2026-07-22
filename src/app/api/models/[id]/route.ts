import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// Public endpoint to get a model with its brand
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const model = await prisma.deviceModel.findUnique({
      where: { id },
      include: { brand: true },
    });

    if (!model) {
      return NextResponse.json({ error: 'Modelo não encontrado' }, { status: 404 });
    }

    return NextResponse.json(model);
  } catch (error) {
    console.error('Error fetching model:', error);
    return NextResponse.json({ error: 'Erro ao buscar modelo' }, { status: 500 });
  }
}


// Protected endpoint to update a model
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
    const { name, brandId, imageUrl } = await request.json();

    if (!name || !brandId) {
      return NextResponse.json({ error: 'Nome e Marca são obrigatórios' }, { status: 400 });
    }

    const model = await prisma.deviceModel.update({
      where: { id },
      data: { name, brandId, imageUrl: imageUrl || null },
      include: { brand: true }
    });

    return NextResponse.json(model);
  } catch (error) {
    console.error('Error updating model:', error);
    return NextResponse.json({ error: 'Erro ao atualizar modelo' }, { status: 500 });
  }
}

// Protected endpoint to delete a model
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

    await prisma.deviceModel.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Modelo excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting model:', error);
    return NextResponse.json({ error: 'Erro ao excluir modelo' }, { status: 500 });
  }
}
