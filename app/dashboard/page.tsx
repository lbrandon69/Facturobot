'use client';


import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart2, Users, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    fetch('/api/dashboard?' + params.toString())
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || res.statusText || 'Erreur API');
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Erreur réseau : ' + err.message);
        setLoading(false);
      });
  }, [startDate, endDate, router]);

  if (loading) {
    return (
      <>
        <AnimatedBackground />
        <main className="p-12 relative z-10" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: '1px solid #f1f5f9', fontFamily: 'Urbanist, Inter, SF Pro Display, Segoe UI, Arial, sans-serif' }}>
          <p className="text-center text-lg text-zinc-500">Chargement...</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AnimatedBackground />
        <main className="p-12 relative z-10" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: '1px solid #f1f5f9', fontFamily: 'Urbanist, Inter, SF Pro Display, Segoe UI, Arial, sans-serif' }}>
          <p style={{ color: '#ef4444', fontWeight: 700, fontSize: 22, textAlign: 'center', margin: '48px 0' }}>Erreur : {error}</p>
        </main>
      </>
    );
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
            fontSize: '2.7rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: '#6366f1',
            marginBottom: 32,
            textAlign: 'center',
            lineHeight: 1.08,
            textShadow: '0 2px 24px rgba(139,92,246,0.10)'
          }}>Dashboard</h1>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#a1a1aa', fontSize: 20, margin: '48px 0' }}>Chargement…</p>
          ) : (
            <>
              {/* Statistiques principales */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginBottom: 48, justifyContent: 'center' }}>
                <div style={{ background: '#eef2ff', borderRadius: 20, minWidth: 180, flex: 1, textAlign: 'center', boxShadow: '0 2px 8px 0 rgba(139,92,246,0.06)', padding: 32 }}>
                  <FileText style={{ color: '#6366f1', marginBottom: 8 }} size={28} />
                  <div style={{ fontWeight: 700, color: '#6366f1', fontSize: 18, marginBottom: 6 }}>Factures totales</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#6366f1', fontFamily: 'Urbanist' }}>{stats.totalInvoices}</div>
                </div>
                <div style={{ background: '#f0fdfa', borderRadius: 20, minWidth: 180, flex: 1, textAlign: 'center', boxShadow: '0 2px 8px 0 rgba(16,185,129,0.06)', padding: 32 }}>
                  <BarChart2 style={{ color: '#10b981', marginBottom: 8 }} size={28} />
                  <div style={{ fontWeight: 700, color: '#10b981', fontSize: 18, marginBottom: 6 }}>Factures payées</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981', fontFamily: 'Urbanist' }}>{stats.paidInvoices}</div>
                </div>
                <div style={{ background: '#fef9c3', borderRadius: 20, minWidth: 180, flex: 1, textAlign: 'center', boxShadow: '0 2px 8px 0 rgba(251,191,36,0.06)', padding: 32 }}>
                  <BarChart2 style={{ color: '#f59e42', marginBottom: 8 }} size={28} />
                  <div style={{ fontWeight: 700, color: '#f59e42', fontSize: 18, marginBottom: 6 }}>Chiffre d'affaires</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#f59e42', fontFamily: 'Urbanist' }}>{(stats.totalRevenue ?? 0).toFixed(2)} €</div>
                </div>
              </div>
              {/* Boutons d’export */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 36, justifyContent: 'center' }}>
                <a href="/api/invoices/export" download style={{ textDecoration: 'none' }}>
                  <button style={{ background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)', color: 'white', border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px 0 rgba(139,92,246,0.08)', marginRight: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Download size={18} /> Exporter factures CSV
                  </button>
                </a>
                <a href="/api/customers/export" download style={{ textDecoration: 'none' }}>
                  <button style={{ background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)', color: 'white', border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px 0 rgba(139,92,246,0.08)', marginRight: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Download size={18} /> Exporter clients CSV
                  </button>
                </a>
                <a href="/api/products/export" download style={{ textDecoration: 'none' }}>
                  <button style={{ background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)', color: 'white', border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px 0 rgba(139,92,246,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Download size={18} /> Exporter produits CSV
                  </button>
                </a>
              </div>
              {/* Filtres dates */}
              <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <label style={{ marginRight: 24, color: '#6366f1', fontWeight: 600 }}>Du&nbsp;
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e0e7ff', fontWeight: 500, fontSize: 15, outline: 'none' }} />
                </label>
                <label style={{ marginLeft: 24, color: '#6366f1', fontWeight: 600 }}>au&nbsp;
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e0e7ff', fontWeight: 500, fontSize: 15, outline: 'none' }} />
                </label>
              </div>
              {/* Top clients */}
              <h2 style={{ color: '#6366f1', fontWeight: 800, fontSize: 26, marginBottom: 18, textAlign: 'center', letterSpacing: '-0.02em' }}>Top clients</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ minWidth: 400, width: '100%', background: 'white', borderRadius: 18, boxShadow: '0 2px 8px 0 rgba(139,92,246,0.04)', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(90deg, #eef2ff 0%, #f0fdfa 100%)' }}>
                      <th style={{ color: '#6366f1', fontWeight: 800, fontSize: 16, padding: '14px 18px', textAlign: 'left' }}>Client</th>
                      <th style={{ color: '#6366f1', fontWeight: 800, fontSize: 16, padding: '14px 18px', textAlign: 'left' }}>Nombre de factures</th>
                      <th style={{ color: '#10b981', fontWeight: 800, fontSize: 16, padding: '14px 18px', textAlign: 'left' }}>Total payé (€)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...(stats.topCustomers ?? [])]
                      .sort((a, b) => b.totalPaid - a.totalPaid)
                      .map((c: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #eef2ff', transition: 'background 0.2s' }}>
                          <td style={{ color: '#8b5cf6', fontWeight: 700, fontSize: 16, padding: '12px 18px' }}>{c.name}</td>
                          <td style={{ color: '#6366f1', fontWeight: 600, padding: '12px 18px' }}>{c.invoiceCount}</td>
                          <td style={{ color: '#10b981', fontWeight: 700, padding: '12px 18px' }}>{c.totalPaid.toFixed(2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 40, textAlign: 'center' }}>
                <Link href="/" style={{ color: '#6366f1', fontWeight: 700, fontSize: 17, textDecoration: 'underline', letterSpacing: '-0.01em' }}>Retour accueil</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
