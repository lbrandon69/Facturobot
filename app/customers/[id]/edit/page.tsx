"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params?.id as string;
  const [form, setForm] = useState({ name: '', email: '', companyNumber: '', vatNumber: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!customerId) return;
    fetch(`/api/customers/${customerId}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name || '',
          email: data.email || '',
          companyNumber: data.companyNumber || '',
          vatNumber: data.vatNumber || ''
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger le client.");
        setLoading(false);
      });
  }, [customerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch(`/api/customers/${customerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/customers');
      }, 2000);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || res.statusText);
    }
    setLoading(false);
  };

  if (loading) return <main style={{ maxWidth: 500, margin: '40px auto', padding: 32 }}>Chargement...</main>;

  return (
    <main style={{ maxWidth: 500, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #eee' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24, textAlign: 'center', color: '#635bff' }}>Modifier le client</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input required placeholder="Nom" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ padding: '10px', borderRadius: 6, border: '1px solid #ccc' }} />
        <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ padding: '10px', borderRadius: 6, border: '1px solid #ccc' }} />
        <input placeholder="SIREN/SIRET" value={form.companyNumber} onChange={e => setForm(f => ({ ...f, companyNumber: e.target.value }))} style={{ padding: '10px', borderRadius: 6, border: '1px solid #ccc' }} />
        <input placeholder="N° TVA" value={form.vatNumber} onChange={e => setForm(f => ({ ...f, vatNumber: e.target.value }))} style={{ padding: '10px', borderRadius: 6, border: '1px solid #ccc' }} />
        <button type="submit" disabled={loading} style={{ background: '#635bff', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 500 }}>{loading ? 'Modification...' : 'Enregistrer'}</button>
        {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
        {success && <p className="text-green-600" style={{ marginTop: 16 }}>Client modifié avec succès !</p>}
      </form>
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link href="/customers">Retour à la liste</Link>
      </div>
    </main>
  );
}
