
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('Product').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Validation stricte des champs
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const priceHt = typeof body.priceHt === 'number' ? body.priceHt : parseFloat(body.priceHt);
    const vatRate = typeof body.vatRate === 'number' ? body.vatRate : parseFloat(body.vatRate);
    const unit = typeof body.unit === 'string' ? body.unit.trim() : '';
    if (!name || isNaN(priceHt) || isNaN(vatRate) || !unit) {
      return NextResponse.json({ error: 'Champs invalides ou manquants', details: { name, priceHt, vatRate, unit } }, { status: 400 });
    }
    const { data, error } = await supabase.from('Product').insert([
      { name, priceHt, vatRate, unit }
    ]).select();
    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }
    return NextResponse.json(data?.[0] ?? null);
  } catch (e: any) {
    return NextResponse.json({ error: 'Erreur serveur', details: e?.message || e }, { status: 500 });
  }
}
