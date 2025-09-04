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

  const invoices = await prisma.invoice.findMany({
    include: { customer: true },
    orderBy: { issueDate: 'desc' },
  });

  const header = [
    'Numéro', 'Client', 'Date émission', 'Date échéance', 'Statut', 'Total HT', 'TVA', 'Total TTC'
  ];
  const rows = invoices.map(inv => [
    inv.number,
    inv.customer?.name || '',
    inv.issueDate?.toISOString().slice(0,10) || '',
    inv.dueDate?.toISOString().slice(0,10) || '',
    inv.status,
    inv.totalHt.toFixed(2),
    inv.totalVat.toFixed(2),
    inv.totalTtc.toFixed(2)
  ]);
  const csv = [header, ...rows].map(r => r.join(';')).join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="factures.csv"',
    },
  });
}
