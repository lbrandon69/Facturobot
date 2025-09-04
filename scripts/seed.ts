import { prisma } from '../lib/prisma';

async function main() {
  // Ajoute quelques clients, produits, etc.
  await prisma.customer.create({
    data: {
      name: 'Client Démo',
      email: 'demo@client.fr',
      companyNumber: '123456789',
      vatNumber: 'FR123456789',
      address: { rue: '1 rue de la Paix', ville: 'Paris' },
    },
  });
  await prisma.product.create({
    data: {
      name: 'Prestation de service',
      priceHt: 100,
      vatRate: 20,
      unit: 'heure',
    },
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
