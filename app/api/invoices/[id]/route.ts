import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { items: true, customer: true, payments: true },
  });
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(invoice);
}
