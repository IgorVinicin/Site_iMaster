import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const brands = await prisma.brand.findMany();
  console.log("Brands in DB:", JSON.stringify(brands, null, 2));
}

main();
