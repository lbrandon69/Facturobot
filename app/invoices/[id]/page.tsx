'use client';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

function InvoicePdf({ invoice }: { invoice: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <Text style={styles.title}>Facture {invoice.number}</Text>
        <Text>Client : {invoice.customer?.name}</Text>
        <Text>Date : {invoice.issueDate?.slice(0,10)} | Échéance : {invoice.dueDate?.slice(0,10)}</Text>
        <Text>Status : {invoice.status}</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cell}>Description</Text>
            <Text style={styles.cell}>Qté</Text>
            <Text style={styles.cell}>PU HT</Text>
            <Text style={styles.cell}>TVA (%)</Text>
            <Text style={styles.cell}>Total HT</Text>
            <Text style={styles.cell}>Total TTC</Text>
          </View>
          {invoice.items.map((it: any, idx: number) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.cell}>{it.description}</Text>
              <Text style={styles.cell}>{it.quantity}</Text>
              <Text style={styles.cell}>{it.unitPriceHt.toFixed(2)} €</Text>
              <Text style={styles.cell}>{it.vatRate}</Text>
              <Text style={styles.cell}>{it.lineTotalHt.toFixed(2)} €</Text>
              <Text style={styles.cell}>{it.lineTotalTtc.toFixed(2)} €</Text>
            </View>
          ))}
        </View>
        <Text>Total HT : {invoice.totalHt.toFixed(2)} €</Text>
        <Text>TVA : {invoice.totalVat.toFixed(2)} €</Text>
        <Text>Total TTC : {invoice.totalTtc.toFixed(2)} €</Text>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  body: { padding: 24 },
  title: { fontSize: 20, marginBottom: 16 },
  table: { width: 'auto', marginVertical: 12 },
  row: { flexDirection: 'row' },
  cell: { flex: 1, fontSize: 10, padding: 2, border: '1px solid #eee' },
});

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/invoices/${id}`)
      .then(res => res.json())
      .then(data => {
        setInvoice(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box sx={{ p: 6 }}><p>Chargement...</p></Box>;
  if (!invoice || invoice.error) return (
    <Box sx={{ p: 6 }}>
      <p>Facture introuvable.</p>
      <Link href="/invoices">Retour à la liste des factures</Link>
    </Box>
  );

  // Classement logique des infos : client, date/échéance, statut
  return (
    <Container maxWidth="sm" sx={{ zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 6,
          boxShadow: '0 8px 32px 0 rgba(60,60,100,0.08)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          width: '100%',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.04em', color: '#18181b' }}>
              Facture {invoice.number}
            </Typography>
            <PDFDownloadLink
              document={<InvoicePdf invoice={invoice} />}
              fileName={`facture-${invoice.number}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outlined" color="primary" sx={{ ml: 2, fontWeight: 600 }}>
                  {loading ? 'Préparation PDF...' : 'Télécharger PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="#6366f1" sx={{ fontWeight: 700 }}>Client</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#18181b' }}>{invoice.customer?.name}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="#6366f1" sx={{ fontWeight: 700 }}>Date</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{invoice.issueDate?.slice(0,10)}</Typography>
              <Typography variant="subtitle2" color="#6366f1" sx={{ fontWeight: 700, mt: 1 }}>Échéance</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{invoice.dueDate?.slice(0,10)}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="#6366f1" sx={{ fontWeight: 700 }}>Statut</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>{invoice.status}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontWeight: 600, borderRadius: 3 }}
              onClick={async () => {
                const res = await fetch(`/api/invoices/${invoice.id}/send`, { method: 'POST' });
                if (res.ok) {
                  alert('Email envoyé !');
                } else {
                  alert('Erreur lors de l’envoi de l’email');
                }
              }}
            >
              Envoyer par email
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ fontWeight: 600, borderRadius: 3 }}
              onClick={async () => {
                const res = await fetch('/api/stripe/checkout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    invoiceId: invoice.id,
                    amount: invoice.totalTtc,
                    customerEmail: invoice.customer?.email,
                  }),
                });
                const data = await res.json();
                if (data.url) {
                  window.location.href = data.url;
                } else {
                  alert('Erreur lors de la création du paiement Stripe : ' + (data.error || 'Erreur inconnue'));
                }
              }}
            >
              Payer en ligne
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mt: 3, mb: 1, color: '#333', fontWeight: 700 }}>Articles</Typography>
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', color: '#6366f1', fontWeight: 700 }}>Description</th>
                  <th style={{ textAlign: 'right', color: '#6366f1', fontWeight: 700 }}>Qté</th>
                  <th style={{ textAlign: 'right', color: '#6366f1', fontWeight: 700 }}>PU HT</th>
                  <th style={{ textAlign: 'right', color: '#6366f1', fontWeight: 700 }}>TVA (%)</th>
                  <th style={{ textAlign: 'right', color: '#6366f1', fontWeight: 700 }}>Total HT</th>
                  <th style={{ textAlign: 'right', color: '#6366f1', fontWeight: 700 }}>Total TTC</th>
                </tr>
              </thead>
              <tbody>
                {[...invoice.items]
                  .sort((a, b) => a.description.localeCompare(b.description))
                  .map((it: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td>{it.description}</td>
                    <td style={{ textAlign: 'right' }}>{it.quantity}</td>
                    <td style={{ textAlign: 'right' }}>{it.unitPriceHt.toFixed(2)} €</td>
                    <td style={{ textAlign: 'right' }}>{it.vatRate}</td>
                    <td style={{ textAlign: 'right' }}>{it.lineTotalHt.toFixed(2)} €</td>
                    <td style={{ textAlign: 'right' }}>{it.lineTotalTtc.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          <Typography sx={{ mt: 2, fontWeight: 600, color: '#18181b' }}>
            Total HT : {invoice.totalHt.toFixed(2)} € | TVA : {invoice.totalVat.toFixed(2)} € | <b>Total TTC : {invoice.totalTtc.toFixed(2)} €</b>
          </Typography>
          <Box sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
            <Button component={Link} href="/invoices" color="primary" variant="text">
              Retour à la liste
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
