import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET: liste tous les produits
export async function GET() {
  const { data, error } = await supabase.from('Product').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: crée un produit
export async function POST(req: Request) {
  const body = await req.json();
  // On retire la clé 'id' si elle existe
  const { id, ...productData } = body;
  const { data, error } = await supabase.from('Product').insert([
    productData
  ]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data?.[0] ?? null);
}
