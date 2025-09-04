import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: récupérer un client par ID

export async function GET(req: Request, { params }) {
  try {
    const customer = await prisma.customer.findUnique({ where: { id: params.id } });
    if (!customer) return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 });
    return NextResponse.json(customer);
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT: modifier un client

export async function PUT(req: Request, { params }) {
  const body = await req.json();
  const { name, email, companyNumber, vatNumber } = body;
  try {
    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: { name, email, companyNumber, vatNumber },
    });
    return NextResponse.json(customer);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}


export async function DELETE(req: Request, { params }) {
  try {
    await prisma.customer.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === 'P2003' || error.message.includes('Foreign key constraint')) {
      return NextResponse.json({ error: 'Impossible de supprimer ce client : il existe des factures associées.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
