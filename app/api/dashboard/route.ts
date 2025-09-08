
import { supabase } from '@/lib/supabase';

function isAuthenticated(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  return cookie.includes('session=valid');
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  let filters = {};
  if (start) filters['issueDate'] = { gte: start };
  if (end) filters['issueDate'] = { ...(filters['issueDate'] || {}), lte: end };

  const { count: totalInvoices, error: errorTotal } = await supabase
    .from('Invoice')
    .select('id', { count: 'exact', head: true });

  const { count: paidInvoices, error: errorPaid } = await supabase
    .from('Invoice')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'payée');

  const { data: revenueData, error: errorRevenue } = await supabase
    .from('Invoice')
    .select('totalTtc, status')
    .eq('status', 'payée');
  const totalRevenue = revenueData?.reduce((sum, i) => sum + (i.totalTtc || 0), 0) || 0;

  const { data: customersData, error: errorCustomers } = await supabase
    .from('Customer')
    .select('id, name, invoices(totalTtc, status)');
  const topCustomersStats = (customersData || [])
    .map(c => ({
      name: c.name,
      invoiceCount: c.invoices?.filter(i => i.status === 'payée').length || 0,
      totalPaid: c.invoices?.filter(i => i.status === 'payée').reduce((sum, i) => sum + (i.totalTtc || 0), 0) || 0,
    }))
    .filter(c => c.invoiceCount > 0)
    .sort((a, b) => b.totalPaid - a.totalPaid)
    .slice(0, 5);

  return Response.json({
    totalInvoices,
    paidInvoices,
    totalRevenue,
    topCustomers: topCustomersStats,
  });
}
