import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET: liste tous les clients
export async function GET() {
  const { data, error } = await supabase.from('Customer').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: crée un client
export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, companyNumber, vatNumber, address } = body;
  const { data, error } = await supabase.from('Customer').insert([
    { name, email, companyNumber, vatNumber, address }
  ]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data?.[0] ?? null);
}
