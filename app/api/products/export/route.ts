import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isAuthenticated(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  return cookie.includes('session=valid');
}

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const products = await prisma.product.findMany();
  const header = ['Nom', 'Unité', 'Prix HT', 'TVA (%)'];
  const rows = products.map(p => [
    p.name,
    p.unit || '',
    typeof p.priceHt === 'number' ? p.priceHt.toFixed(2) : '',
    typeof p.vatRate === 'number' ? p.vatRate : ''
  ]);
  const csv = [header, ...rows].map(r => r.join(';')).join('\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="produits.csv"',
    },
  });
}
