import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not defined in the environment.');
  process.exit(1);
}

let prisma: PrismaClient;
let poolToEnd: any = null;

if (connectionString.startsWith('prisma+postgres://')) {
  prisma = new PrismaClient({
    accelerateUrl: connectionString,
  });
} else {
  const { Pool } = require('pg');
  const { PrismaPg } = require('@prisma/adapter-pg');
  const pool = new Pool({ connectionString });
  poolToEnd = pool;
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
}

async function main() {
  console.log('Seeding repair types...');
  
  const repairTypes = [
    { name: 'Troca de Tela', description: 'Substituição de tela danificada ou com problemas de toque' },
    { name: 'Troca de Bateria', description: 'Substituição de bateria desgastada ou estufada' },
    { name: 'Conector de Carga', description: 'Reparo ou troca do conector USB-C / Lightning' },
    { name: 'Câmera Frontal', description: 'Substituição da câmera de selfie' },
    { name: 'Câmera Traseira', description: 'Substituição do módulo de câmera principal' },
    { name: 'Tampa Traseira', description: 'Troca do vidro ou tampa traseira quebrada' },
    { name: 'Reparo em Placa', description: 'Análise microscópica e micro-soldagem de componentes da placa mãe' },
  ];

  for (const rt of repairTypes) {
    await prisma.repairType.upsert({
      where: { name: rt.name },
      update: {},
      create: rt,
    });
  }

  console.log('Seeding brands...');
  const brands = [
    { name: 'Apple' },
    { name: 'Samsung' },
    { name: 'Motorola' },
    { name: 'Xiaomi' },
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { name: brand.name },
      update: {},
      create: brand,
    });
  }

  console.log('Seeding admin user...');
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('AVISO: ADMIN_EMAIL e ADMIN_PASSWORD não definidos no .env. Usando credenciais padrão temporárias.');
  }

  const emailToUse = adminEmail || 'admin@imaster.com.br';
  const passToUse = adminPassword || 'imaster2025';
  const hashedPassword = await bcrypt.hash(passToUse, 10);

  await prisma.user.upsert({
    where: { email: emailToUse },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: emailToUse,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    if (poolToEnd) {
      await poolToEnd.end();
    }
  });
