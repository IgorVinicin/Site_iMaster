const bcrypt = require('bcryptjs');
// Load environment variables
require('dotenv').config();

// Since we are running outside webpack/next.js, we need to register ts-node or resolve TS paths,
// or just manually copy the Prisma Pg Adapter instantiation logic from src/lib/prisma.ts.
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined.');
}

let prisma;
if (connectionString.startsWith('prisma+postgres://')) {
  prisma = new PrismaClient({
    accelerateUrl: connectionString,
  });
} else {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('ERRO: ADMIN_EMAIL e ADMIN_PASSWORD devem estar definidos no arquivo .env');
    process.exit(1);
  }

  const hash = await bcrypt.hash(adminPassword, 10);
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hash, role: 'ADMIN' },
    create: { email: adminEmail, password: hash, role: 'ADMIN' },
  });
  console.log('Admin criado com sucesso:', user.email);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
