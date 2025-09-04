import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clients factices
  const customers = await prisma.customer.createMany({
    data: [
      { name: 'Apple France', companyNumber: 'FR123456789', vatNumber: 'FRXX999999', email: 'contact@apple.fr', address: { street: '1 Av. Apple', city: 'Paris', zip: '75001', country: 'France' } },
      { name: 'Revolut SAS', companyNumber: 'FR987654321', vatNumber: 'FRYY888888', email: 'hello@revolut.com', address: { street: '2 Rue Fintech', city: 'Paris', zip: '75002', country: 'France' } },
      { name: 'Tesla Europe', companyNumber: 'FR192837465', vatNumber: 'FRZZ777777', email: 'eu@tesla.com', address: { street: '3 Bd Électrique', city: 'Paris', zip: '75003', country: 'France' } },
    ]
  });

  // Produits factices
  const products = await prisma.product.createMany({
    data: [
      { name: 'Abonnement Premium', unit: 'mois', priceHt: 49.99, vatRate: 20 },
      { name: 'Consulting', unit: 'heure', priceHt: 120, vatRate: 20 },
      { name: 'Formation', unit: 'jour', priceHt: 800, vatRate: 20 },
    ]
  });

  // Factures factices (liées aux clients et produits)
  const customer1 = await prisma.customer.findFirst({ where: { name: 'Apple France' } });
  const customer2 = await prisma.customer.findFirst({ where: { name: 'Revolut SAS' } });
  const product1 = await prisma.product.findFirst({ where: { name: 'Abonnement Premium' } });
  const product2 = await prisma.product.findFirst({ where: { name: 'Consulting' } });

  if (customer1 && product1) {
    await prisma.invoice.create({
      data: {
        number: '2025-0001',
        customerId: customer1.id,
        status: 'payée',
        issueDate: new Date('2025-09-01'),
        dueDate: new Date('2025-09-15'),
        totalHt: 49.99,
        totalVat: 9.998,
        totalTtc: 59.988,
        items: {
          create: [
            { description: 'Abonnement Premium', quantity: 1, unitPriceHt: 49.99, vatRate: 20, lineTotalHt: 49.99, lineTotalVat: 9.998, lineTotalTtc: 59.988 }
          ]
        }
      }
    });
  }
  if (customer2 && product2) {
    await prisma.invoice.create({
      data: {
        number: '2025-0002',
        customerId: customer2.id,
        status: 'envoyée',
        issueDate: new Date('2025-09-02'),
        dueDate: new Date('2025-09-16'),
        totalHt: 240,
        totalVat: 48,
        totalTtc: 288,
        items: {
          create: [
            { description: 'Consulting', quantity: 2, unitPriceHt: 120, vatRate: 20, lineTotalHt: 240, lineTotalVat: 48, lineTotalTtc: 288 }
          ]
        }
      }
    });
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
