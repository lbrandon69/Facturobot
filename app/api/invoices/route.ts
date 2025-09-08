import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { customerId, items, issueDate, dueDate } = body;

  let totalHt = 0, totalVat = 0, totalTtc = 0;
  const dbItems: {
    description: any;
    quantity: any;
    unitPriceHt: any;
    vatRate: any;
    lineTotalHt: number;
    lineTotalVat: number;
    lineTotalTtc: number;
  }[] = [];
  for (const it of items) {
    const lineHt = it.quantity * it.unitPriceHt;
    const lineVat = lineHt * (it.vatRate / 100);
    const lineTtc = lineHt + lineVat;
    totalHt += lineHt; totalVat += lineVat; totalTtc += lineTtc;
    dbItems.push({ description: it.description, quantity: it.quantity, unitPriceHt: it.unitPriceHt, vatRate: it.vatRate, lineTotalHt: lineHt, lineTotalVat: lineVat, lineTotalTtc: lineTtc });
  }

  const count = await prisma.invoice.count();
  const number = `${new Date().getFullYear()}-${String(count + 1).padStart(4,'0')}`;

  const invoice = await prisma.invoice.create({
    data: {
      number,
      customerId,
      status: 'sent',
      issueDate: new Date(issueDate),
      dueDate: new Date(dueDate),
      totalHt, totalVat, totalTtc,
      items: { create: dbItems }
    },
    include: { items: true }
  });

  return NextResponse.json({ id: invoice.id, number });
}

export async function GET(req: Request) {
  const url = new URL(req.url!);
  const withCustomer = url.searchParams.get('withCustomer');
  const invoices = await prisma.invoice.findMany({
    include: withCustomer ? { customer: true } : undefined,
    orderBy: { issueDate: 'desc' }
  });
  return NextResponse.json(invoices);
}
