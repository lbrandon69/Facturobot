
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request, context) {
  const { params } = await context;
  const id = await params.id;
  const { data, error } = await supabase.from('Customer').select('*').eq('id', id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, context) {
  const { params } = await context;
  const id = await params.id;
  const body = await req.json();
  const { name, email, companyNumber, vatNumber } = body;
  const { data, error } = await supabase.from('Customer').update({ name, email, companyNumber, vatNumber }).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data?.[0] ?? null);
}

export async function DELETE(req: Request, context) {
  const { params } = await context;
  const id = await params.id;
  const { error } = await supabase.from('Customer').delete().eq('id', id);
  if (error) {
    if (error.message.includes('foreign key constraint')) {
      return NextResponse.json({ error: 'Impossible de supprimer ce client : il existe des factures associées.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
