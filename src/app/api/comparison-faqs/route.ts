import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// GET /api/comparison-faqs  → public: lista FAQs ativas
export async function GET() {
  try {
    const faqs = await prisma.comparisonFAQ.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ error: 'Erro ao buscar FAQs' }, { status: 500 });
  }
}

// POST /api/comparison-faqs  → admin: cria FAQ
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { question, answer, sortOrder, active } = await request.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Pergunta e resposta são obrigatórias' }, { status: 400 });
    }

    const faq = await prisma.comparisonFAQ.create({
      data: { question: question.trim(), answer: answer.trim(), sortOrder: sortOrder ?? 0, active: active ?? true },
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: 'Erro ao criar FAQ' }, { status: 500 });
  }
}
