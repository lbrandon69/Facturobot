import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import PDFDocument from 'pdfkit';

export async function GET(req: Request, { params }) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { items: true, customer: true },
  });
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const doc = new PDFDocument({ margin: 40 });
  let buffers: Buffer[] = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(18).text(`Facture ${invoice.number}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Client : ${invoice.customer?.name || ''}`);
  doc.text(`Date : ${invoice.issueDate?.toISOString().slice(0,10)} | Échéance : ${invoice.dueDate?.toISOString().slice(0,10)}`);
  doc.text(`Statut : ${invoice.status}`);
  doc.moveDown();

  doc.text('Articles :');
  invoice.items.forEach((it: any) => {
    doc.text(`- ${it.description} | Qté: ${it.quantity} | PU HT: ${it.unitPriceHt} | TVA: ${it.vatRate}% | Total HT: ${it.lineTotalHt} | Total TTC: ${it.lineTotalTtc}`);
  });
  doc.moveDown();
  doc.text(`Total HT : ${invoice.totalHt.toFixed(2)} €`);
  doc.text(`TVA : ${invoice.totalVat.toFixed(2)} €`);
  doc.text(`Total TTC : ${invoice.totalTtc.toFixed(2)} €`);

  doc.end();
  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    const bufs: Buffer[] = [];
    doc.on('data', (d) => bufs.push(d));
    doc.on('end', () => resolve(Buffer.concat(bufs)));
  });

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="facture-${invoice.number}.pdf"`
    }
  });
}
