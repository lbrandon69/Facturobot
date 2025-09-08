import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: récupérer un produit par ID
export async function GET(req: Request, context) {
  const { params } = await context;
  const id = await params.id;
  const { data, error } = await supabase.from('Product').select('*').eq('id', id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
  return NextResponse.json(data);
}
export async function PUT(req: Request, context) {
  const { params } = await context;
  const id = await params.id;
  const body = await req.json();
  // On retire la clé 'id' si elle existe
  const { id: _id, ...productData } = body;
  const { data, error } = await supabase.from('Product').update(productData).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data?.[0] ?? null);
}
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(req: Request, context) {
  const { params } = await context;
  const id = await params.id;
  const { error } = await supabase.from('Product').delete().eq('id', id);
  if (error) {
    if (error.message.includes('foreign key constraint')) {
      return NextResponse.json({ error: 'Impossible de supprimer ce produit : il existe des factures associées.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
