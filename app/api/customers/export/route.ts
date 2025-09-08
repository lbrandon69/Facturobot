import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function isAuthenticated(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  return cookie.includes('session=valid');
}

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // À migrer vers Supabase JS. Fonctionnalité désactivée temporairement.
    const { data, error } = await supabase.from('Customer').select('*');
    if (error) return Response.json({ error: error.message }, { status: 500 });
    const header = ['Nom', 'Email', 'Numéro SIRET', 'Numéro TVA', 'Adresse'];
    const rows = (data || []).map(c => [
      c.name,
      c.email,
      c.companyNumber || '',
      c.vatNumber || '',
      typeof c.address === 'object' ? JSON.stringify(c.address) : ''
    ]);
    const csv = [header, ...rows].map(r => r.join(';')).join('\n');
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="clients.csv"',
      },
    });
}
