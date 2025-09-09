import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, items, issueDate, dueDate } = body;
    // Validation stricte
    if (!customerId || typeof customerId !== 'string') {
      console.error('customerId manquant ou invalide', customerId);
      return NextResponse.json({ error: 'customerId manquant ou invalide' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      console.error('items doit être un tableau non vide', items);
      return NextResponse.json({ error: 'items doit être un tableau non vide' }, { status: 400 });
    }
    if (!issueDate || typeof issueDate !== 'string') {
      console.error('issueDate manquant ou invalide', issueDate);
      return NextResponse.json({ error: 'issueDate manquant ou invalide' }, { status: 400 });
    }
    if (!dueDate || typeof dueDate !== 'string') {
      console.error('dueDate manquant ou invalide', dueDate);
      return NextResponse.json({ error: 'dueDate manquant ou invalide' }, { status: 400 });
    }

    let totalHt = 0, totalVat = 0, totalTtc = 0;
    const dbItems = [];
    for (const it of items) {
      if (!it || typeof it !== 'object') {
        console.error('item mal formé', it);
        return NextResponse.json({ error: 'item mal formé' }, { status: 400 });
      }
      const { description, quantity, unitPriceHt, vatRate } = it;
      if (typeof description !== 'string' || typeof quantity !== 'number' || typeof unitPriceHt !== 'number' || typeof vatRate !== 'number') {
        console.error('Champs item invalides', it);
        return NextResponse.json({ error: 'Champs item invalides' }, { status: 400 });
      }
      const lineHt = quantity * unitPriceHt;
      const lineVat = lineHt * (vatRate / 100);
      const lineTtc = lineHt + lineVat;
      totalHt += lineHt; totalVat += lineVat; totalTtc += lineTtc;
      dbItems.push({ description, quantity, unitPriceHt, vatRate, lineTotalHt: lineHt, lineTotalVat: lineVat, lineTotalTtc: lineTtc });
    }

    const { count, error: errorCount } = await supabase
      .from('Invoice')
      .select('id', { count: 'exact', head: true });
    if (errorCount) {
      console.error('Erreur supabase count', errorCount);
      return NextResponse.json({ error: errorCount.message }, { status: 500 });
    }
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
    if (errorInvoice || !invoiceData) {
      console.error('Erreur création Invoice', errorInvoice);
      return NextResponse.json({ error: errorInvoice?.message || 'Erreur création Invoice' }, { status: 500 });
    }
    for (const item of dbItems) {
      const { error: errorItem } = await supabase.from('InvoiceItem').insert({
        ...item,
        invoiceId: invoiceData.id
      });
      if (errorItem) {
        console.error('Erreur création InvoiceItem', errorItem);
        return NextResponse.json({ error: errorItem.message }, { status: 500 });
      }
    }
    return NextResponse.json({ id: invoiceData.id, number });
  } catch (err: any) {
    console.error('Erreur inattendue', err);
    return NextResponse.json({ error: err?.message || 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url!);
  const withCustomer = url.searchParams.get('withCustomer');
  let query = supabase.from('Invoice').select('*');
  query = query.order('issueDate', { ascending: false });
  const { data: invoices, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (withCustomer) {
    // Récupérer tous les clients en une requête
    const { data: customers, error: errorCustomers } = await supabase.from('Customer').select('id, name');
    if (errorCustomers) return NextResponse.json({ error: errorCustomers.message }, { status: 500 });
    // Récupérer tous les items en une requête
    const { data: items, error: errorItems } = await supabase.from('InvoiceItem').select('*, invoiceId');
    if (errorItems) return NextResponse.json({ error: errorItems.message }, { status: 500 });
    // Enrichir chaque facture avec le client et les items
    const customersMap = new Map(customers.map(c => [c.id, c]));
    const itemsMap = new Map();
    for (const item of items) {
      if (!itemsMap.has(item.invoiceId)) itemsMap.set(item.invoiceId, []);
      itemsMap.get(item.invoiceId).push(item);
    }
    const enriched = (Array.isArray(invoices) ? invoices : []).map(inv => ({
      ...inv,
      customer: customersMap.get(inv.customerId) || null,
      items: itemsMap.get(inv.id) || []
    }));
    return NextResponse.json(enriched);
  }
  return NextResponse.json(Array.isArray(invoices) ? invoices.map(inv => ({ ...inv, items: [] })) : []);
}
