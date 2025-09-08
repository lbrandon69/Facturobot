import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request, context) {
  const { params } = await context;
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { customer: true },
  });
  if (!invoice || !invoice.customer?.email) {
    return NextResponse.json({ error: 'Facture ou email client introuvable' }, { status: 404 });
  }

  const subject = `Votre facture ${invoice.number}`;
  const html = `<p>Bonjour ${invoice.customer.name},<br>Veuillez trouver votre facture n°${invoice.number} en pièce jointe ou à télécharger depuis votre espace client.</p>`;

  // Envoi de l'email (sans pièce jointe PDF pour la version simple)
  try {
    const { data, error } = await resend.emails.send({
      from: 'Facturobot <noreply@facturobot.com>',
      to: [invoice.customer.email],
      subject: `Votre facture n°${invoice.id}`,
      html: `<strong>Bonjour ${invoice.customer.name},</strong><br/>Veuillez trouver votre facture en pièce jointe ou en téléchargement.`,
      // Ajoute ici l'attachement PDF si tu veux aller plus loin
    });
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
