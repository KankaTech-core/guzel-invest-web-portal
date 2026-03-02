import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const listings = await prisma.listing.findMany({
    where: { isProject: true },
    include: {
        translations: { select: { title: true } },
        projectUnits: { include: { translations: true } }
    },
	take: 5
  });
  console.log(JSON.stringify(listings.map(l => ({ 
      title: l.translations[0]?.title, 
      units: l.projectUnits 
  })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
