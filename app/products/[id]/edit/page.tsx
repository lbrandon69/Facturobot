"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const [form, setForm] = useState({ name: "", priceHt: "", vatRate: "", unit: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name || "",
          priceHt: data.priceHt?.toString() || "",
          vatRate: data.vatRate?.toString() || "",
          unit: data.unit || ""
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger le produit.");
        setLoading(false);
      });
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        priceHt: parseFloat(form.priceHt),
        vatRate: parseFloat(form.vatRate),
        unit: form.unit
      })
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/products");
      }, 2000);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || res.statusText);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 480, margin: "64px auto", background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px 0 rgba(60,60,100,0.10)", padding: 32 }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#6366f1", marginBottom: 24 }}>Modifier le produit</h1>
      {loading ? (
        <p style={{ textAlign: "center", color: "#a1a1aa", fontSize: 20, margin: "48px 0" }}>Chargement…</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Nom<br /><input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></label><br /><br />
          <label>Prix HT<br /><input type="number" step="0.01" value={form.priceHt} onChange={e => setForm(f => ({ ...f, priceHt: e.target.value }))} required /></label><br /><br />
          <label>Taux TVA (%)<br /><input type="number" step="0.01" value={form.vatRate} onChange={e => setForm(f => ({ ...f, vatRate: e.target.value }))} required /></label><br /><br />
          <label>Unité<br /><input type="text" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} required /></label><br /><br />
          <button type="submit" style={{ background: "#6366f1", color: "white", border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Enregistrer</button>
          {error && <p style={{ color: "#ef4444", fontWeight: 700, marginTop: 18 }}>{error}</p>}
          {success && <p style={{ color: "#10b981", fontWeight: 700, marginTop: 18 }}>Produit modifié !</p>}
        </form>
      )}
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <Link href="/products" style={{ color: "#6366f1", fontWeight: 700, fontSize: 17, textDecoration: "underline" }}>Retour à la liste</Link>
      </div>
    </div>
  );
}
