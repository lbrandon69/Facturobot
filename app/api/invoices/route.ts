import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.json();
  const { customerId, items, issueDate, dueDate } = body;

  let totalHt = 0, totalVat = 0, totalTtc = 0;
  const dbItems: {
    description: any;
    quantity: any;
    unitPriceHt: any;
    vatRate: any;
    lineTotalHt: number;
    lineTotalVat: number;
    lineTotalTtc: number;
  }[] = [];
  for (const it of items) {
    const lineHt = it.quantity * it.unitPriceHt;
    const lineVat = lineHt * (it.vatRate / 100);
    const lineTtc = lineHt + lineVat;
    totalHt += lineHt; totalVat += lineVat; totalTtc += lineTtc;
    dbItems.push({ description: it.description, quantity: it.quantity, unitPriceHt: it.unitPriceHt, vatRate: it.vatRate, lineTotalHt: lineHt, lineTotalVat: lineVat, lineTotalTtc: lineTtc });
  }

  const { count, error: errorCount } = await supabase
    .from('Invoice')
    .select('id', { count: 'exact', head: true });
  if (errorCount) return NextResponse.json({ error: errorCount.message }, { status: 500 });
  const number = `${new Date().getFullYear()}-${String(count + 1).padStart(4,'0')}`;

  const { data: invoiceData, error: errorInvoice } = await supabase
    .from('Invoice')
    .insert({
      number,
      customerId,
      status: 'sent',
      issueDate,
      dueDate,
      totalHt,
      totalVat,
      totalTtc
    })
    .select()
    .single();
  if (errorInvoice) return NextResponse.json({ error: errorInvoice.message }, { status: 500 });
  for (const item of dbItems) {
    await supabase.from('InvoiceItem').insert({
      ...item,
      invoiceId: invoiceData.id
    });
  }
  return NextResponse.json({ id: invoiceData.id, number });
}

export async function GET(req: Request) {
  const url = new URL(req.url!);
  const withCustomer = url.searchParams.get('withCustomer');
  let query = supabase.from('Invoice').select(withCustomer ? '*, customer(*)' : '*');
  query = query.order('issueDate', { ascending: false });
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
