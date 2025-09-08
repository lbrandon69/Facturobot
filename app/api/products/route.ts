
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('Product').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { id, ...productData } = body;
  const { data, error } = await supabase.from('Product').insert([
    productData
  ]).select();
  if (error) {
    console.error('Erreur Supabase:', error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }
  return NextResponse.json(data?.[0] ?? null);
}
