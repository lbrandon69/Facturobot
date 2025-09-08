import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // Test simple : compter les clients
  const { count, error } = await supabase
    .from('Customer')
    .select('id', { count: 'exact', head: true });
  if (error) {
    return Response.json({ status: 'error', message: error.message || 'Erreur de connexion à la base', error }, { status: 500 });
  }
  return Response.json({ status: 'ok', message: 'Connexion à la base réussie', customerCount: count });
}
