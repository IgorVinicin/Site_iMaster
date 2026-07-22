import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log("Conectado com sucesso!");
    console.log(`Número de usuários: ${userCount}`);
    
    const brandCount = await prisma.brand.count();
    console.log(`Número de marcas: ${brandCount}`);
    
    const modelCount = await prisma.deviceModel.count();
    console.log(`Número de modelos: ${modelCount}`);
  } catch (error) {
    console.error("Erro ao conectar ou buscar dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
