"use client";

// Fond animé et typo premium (DA Apple/Revolut)
const AnimatedBackground = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100vw', height: '100vh', overflow: 'hidden' }}>
    <style>{`
      @keyframes ellipseMove {
        0% { transform: scale(1.02) translateY(-30px) rotate(-2deg); }
        30% { transform: scale(1.08) translateY(40px) rotate(3deg); }
        60% { transform: scale(0.98) translateY(-20px) rotate(-4deg); }
        100% { transform: scale(1.02) translateY(-30px) rotate(-2deg); }
      }
      @keyframes ellipseMove2 {
        0% { transform: scale(1.1) translate(80px, 60px) rotate(0deg); }
        50% { transform: scale(1.18) translate(-60px, -40px) rotate(6deg); }
        100% { transform: scale(1.1) translate(80px, 60px) rotate(0deg); }
      }
    `}</style>
    <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform', animation: 'ellipseMove 14s ease-in-out infinite', filter: 'blur(0.5px)' }}>
      <ellipse cx="720" cy="400" rx="700" ry="320" fill="url(#paint0_radial)" fillOpacity="0.5" />
      <defs>
        <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(720 400) scale(700 320)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#f8fafc" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
    <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform', animation: 'ellipseMove2 22s ease-in-out infinite', opacity: 0.45, mixBlendMode: 'lighten', filter: 'blur(2.5px)' }}>
      <ellipse cx="900" cy="600" rx="400" ry="180" fill="url(#paint1_radial)" fillOpacity="0.7" />
      <defs>
        <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(900 600) scale(400 180)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#f8fafc" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User2, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Avatar from "react-avatar";
import { Toaster } from "react-hot-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  companyNumber?: string;
  vatNumber?: string;
}
export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      });
  }, []);

  function handleDelete(id: string) {
    if (window.confirm("Supprimer ce client ?")) {
      fetch(`/api/customers/${id}`, { method: "DELETE" })
        .then(async (res) => {
          if (res.ok) window.location.reload();
          else {
            const data = await res.json().catch(() => ({}));
            alert(
              "Erreur lors de la suppression : " + (data.error || res.statusText)
            );
          }
        })
        .catch((err) => alert("Erreur réseau : " + err));
    }
  }

  return (
    <>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Urbanist, Inter, SF Pro Display, Segoe UI, Arial, sans-serif' }}>
        <div style={{
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 32,
          boxShadow: '0 8px 32px 0 rgba(60,60,100,0.10)',
          border: '1px solid #f1f5f9',
          padding: '48px 32px',
          maxWidth: 900,
          width: '100%',
          margin: '48px 0',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: '#6366f1',
            marginBottom: 32,
            textAlign: 'center',
            lineHeight: 1.08,
            textShadow: '0 2px 24px rgba(139,92,246,0.10)'
          }}>Liste des clients</h1>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
            <Link href="/customers/new" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)', color: 'white', border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px 0 rgba(139,92,246,0.08)', cursor: 'pointer' }}>
                Nouveau client
              </button>
            </Link>
          </div>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#a1a1aa', fontSize: 20, margin: '48px 0' }}>Chargement…</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ minWidth: 500, width: '100%', background: 'white', borderRadius: 18, boxShadow: '0 2px 8px 0 rgba(139,92,246,0.04)', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg, #eef2ff 0%, #f0fdfa 100%)' }}>
                    <th style={{ color: '#6366f1', fontWeight: 800, fontSize: 16, padding: '14px 18px', textAlign: 'left' }}>Nom</th>
                    <th style={{ color: '#6366f1', fontWeight: 800, fontSize: 16, padding: '14px 18px', textAlign: 'left' }}>Email</th>
                    <th style={{ color: '#6366f1', fontWeight: 800, fontSize: 16, padding: '14px 18px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(customers) ? customers : [])
                    .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'fr', { sensitivity: 'base' }))
                    .map((customer) => (
                    <tr key={customer.id} style={{ borderBottom: '1px solid #eef2ff', transition: 'background 0.2s' }}>
                      <td style={{ color: '#8b5cf6', fontWeight: 700, fontSize: 16, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ background: '#eef2ff', color: '#6366f1', borderRadius: '50%', width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>{customer.name[0]}</span>
                        {customer.name}
                      </td>
                      <td style={{ color: '#18181b', fontWeight: 500, padding: '12px 18px' }}>{customer.email}</td>
                      <td style={{ padding: '12px 18px', display: 'flex', gap: 8 }}>
                        <Link href={`/customers/${customer.id}/edit`} style={{ textDecoration: 'none' }}>
                          <button style={{ background: '#f1f5f9', color: '#6366f1', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Éditer</button>
                        </Link>
                        <button onClick={() => handleDelete(customer.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <Link href="/" style={{ color: '#6366f1', fontWeight: 700, fontSize: 17, textDecoration: 'underline', letterSpacing: '-0.01em' }}>Retour accueil</Link>
          </div>
        </div>
      </div>
    </>
  );
}
