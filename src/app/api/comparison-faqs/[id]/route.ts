import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { id } = await params;
    const { question, answer, sortOrder, active } = await request.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Pergunta e resposta são obrigatórias' }, { status: 400 });
    }

    const faq = await prisma.comparisonFAQ.update({
      where: { id },
      data: { question: question.trim(), answer: answer.trim(), sortOrder: sortOrder ?? 0, active: active ?? true },
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ error: 'Erro ao atualizar FAQ' }, { status: 500 });
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
    await prisma.comparisonFAQ.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: 'Erro ao excluir FAQ' }, { status: 500 });
  }
}
