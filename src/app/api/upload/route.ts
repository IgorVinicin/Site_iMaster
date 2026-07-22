import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    // 1. Authorize the admin
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Validate file type (Images only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato de arquivo inválido. Apenas imagens JPEG, PNG, WEBP e SVG são permitidas.' },
        { status: 400 }
      );
    }

    // Validate file size (Max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: 'O tamanho do arquivo excede o limite máximo de 5MB.' },
        { status: 400 }
      );
    }

    // 3. Get file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Create uploads folder inside public if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 5. Generate a unique name
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}_${sanitizedName}`;
    const filePath = path.join(uploadDir, filename);

    // 6. Write file to disk
    await writeFile(filePath, buffer);

    // 7. Return local url path
    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error('Error during file upload:', error);
    return NextResponse.json({ error: 'Erro interno ao realizar upload do arquivo' }, { status: 500 });
  }
}
