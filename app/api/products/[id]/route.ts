import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, context) {
  const { params } = await context;
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === 'P2003' || error.message.includes('Foreign key constraint')) {
      return NextResponse.json({ error: 'Impossible de supprimer ce produit : il existe des factures associées.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
