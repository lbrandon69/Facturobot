import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request, context) {
  const { params } = await context;
  const { data: invoice, error } = await supabase
    .from('Invoice')
    .select('*, customer(*)')
    .eq('id', params.id)
    .single();
  if (error || !invoice || !invoice.customer?.email) {
    return NextResponse.json({ error: 'Facture ou email client introuvable' }, { status: 404 });
  }

  const subject = `Votre facture ${invoice.number}`;
  const html = `<p>Bonjour ${invoice.customer.name},<br>Veuillez trouver votre facture n°${invoice.number} en pièce jointe ou à télécharger depuis votre espace client.</p>`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Facturobot <noreply@facturobot.com>',
      to: [invoice.customer.email],
      subject: `Votre facture n°${invoice.id}`,
      html: `<strong>Bonjour ${invoice.customer.name},</strong><br/>Veuillez trouver votre facture en pièce jointe ou en téléchargement.`,
    });
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
