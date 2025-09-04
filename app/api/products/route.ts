import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET: liste tous les produits
export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

// POST: crée un produit
export async function POST(req: Request) {
  const body = await req.json();
  const { name, priceHt, vatRate, unit } = body;
  const product = await prisma.product.create({
    data: { name, priceHt, vatRate, unit },
  });
  return NextResponse.json(product);
}
