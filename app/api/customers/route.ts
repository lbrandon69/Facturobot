import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET: liste tous les clients
export async function GET() {
  const customers = await prisma.customer.findMany();
  return NextResponse.json(customers);
}

// POST: crée un client
export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, companyNumber, vatNumber, address } = body;
  const customer = await prisma.customer.create({
    data: { name, email, companyNumber, vatNumber, address },
  });
  return NextResponse.json(customer);
}
