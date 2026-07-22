import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// PUT /api/users/[id] - Update employee details (Only ADMIN allowed)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso proibido. Apenas administradores.' }, { status: 403 });
    }

    const { id } = await params;
    const { email, password, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'E-mail e perfil são obrigatórios' }, { status: 400 });
    }

    if (role !== 'ADMIN' && role !== 'SUBADMIN') {
      return NextResponse.json({ error: 'Perfil inválido' }, { status: 400 });
    }

    // Check if email belongs to another user
    const existing = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'E-mail já utilizado por outro usuário' }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      email,
      role,
    };

    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Erro ao atualizar funcionário' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete employee (Only ADMIN allowed, cannot delete oneself)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso proibido. Apenas administradores.' }, { status: 403 });
    }

    const { id } = await params;

    // Prevent self-deletion
    if (session.userId === id) {
      return NextResponse.json({ error: 'Você não pode excluir sua própria conta.' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Funcionário excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Erro ao excluir funcionário' }, { status: 500 });
  }
}
