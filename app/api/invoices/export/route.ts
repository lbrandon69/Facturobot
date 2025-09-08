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

  const { data: invoices, error } = await supabase
    .from('Invoice')
    .select('*, customer(*)')
    .order('issueDate', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const header = [
    'Numéro', 'Client', 'Date émission', 'Date échéance', 'Statut', 'Total HT', 'TVA', 'Total TTC'
  ];
  const rows = invoices.map(inv => [
    inv.number,
    inv.customer?.name || '',
    inv.issueDate?.toISOString().slice(0,10) || '',
    inv.dueDate?.toISOString().slice(0,10) || '',
    inv.status,
    inv.totalHt.toFixed(2),
    inv.totalVat.toFixed(2),
    inv.totalTtc.toFixed(2)
  ]);
  const csv = [header, ...rows].map(r => r.join(';')).join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="factures.csv"',
    },
  });
}
