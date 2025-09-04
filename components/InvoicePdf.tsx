import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

export default function InvoicePdf({ invoice }: { invoice: any }) {
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
