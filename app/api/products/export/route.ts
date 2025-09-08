import { supabase } from '@/lib/supabase';

function isAuthenticated(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  return cookie.includes('session=valid');
}

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data, error } = await supabase.from('Product').select('*');
  if (error) return Response.json({ error: error.message }, { status: 500 });
  const header = ['Nom', 'Unité', 'Prix HT', 'TVA (%)'];
  const rows = (data || []).map(p => [
    p.name,
    p.unit || '',
    typeof p.priceHt === 'number' ? p.priceHt.toFixed(2) : '',
    typeof p.vatRate === 'number' ? p.vatRate : ''
  ]);
  const csv = [header, ...rows].map(r => r.join(';')).join('\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="produits.csv"',
    },
  });
}
