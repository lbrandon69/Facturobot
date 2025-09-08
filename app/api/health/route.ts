import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test simple : compter les clients
    const count = await prisma.customer.count();
    return NextResponse.json({ status: 'ok', message: 'Connexion à la base réussie', customerCount: count });
  } catch (e) {
    return NextResponse.json({ status: 'error', message: e.message || 'Erreur de connexion à la base', error: e }, { status: 500 });
  }
}
