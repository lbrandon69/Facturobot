import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
export async function GET(req: Request, context: any) {
  const { id } = context.params;
  const { data, error } = await supabase
    .from('Invoice')
    .select('*, items(*), customer(*), payments(*)')
    .eq('id', id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}
