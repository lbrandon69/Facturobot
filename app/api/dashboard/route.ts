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

  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const dateFilter: any = {};
  if (start) dateFilter['issueDate'] = { gte: new Date(start) };
  if (end) dateFilter['issueDate'] = { ...(dateFilter['issueDate'] || {}), lte: new Date(end) };

  const totalInvoices = await prisma.invoice.count({ where: dateFilter });
  const paidInvoices = await prisma.invoice.count({ where: { ...dateFilter, status: 'payée' } });
  const totalRevenue = await prisma.invoice.aggregate({
    _sum: { totalTtc: true },
    where: { ...dateFilter, status: 'payée' },
  });
  const topCustomers = await prisma.customer.findMany({
    include: {
      invoices: {
        where: { ...dateFilter, status: 'payée' },
        select: { totalTtc: true },
      },
    },
  });
  const topCustomersStats = topCustomers
    .map(c => ({
      name: c.name,
      invoiceCount: c.invoices.length,
      totalPaid: c.invoices.reduce((sum, i) => sum + i.totalTtc, 0),
    }))
    .filter(c => c.invoiceCount > 0)
    .sort((a, b) => b.totalPaid - a.totalPaid)
    .slice(0, 5);

  return NextResponse.json({
    totalInvoices,
    paidInvoices,
    totalRevenue: totalRevenue._sum.totalTtc || 0,
    topCustomers: topCustomersStats,
  });
}
