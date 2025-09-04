'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Description from '@mui/icons-material/Description';
import Visibility from '@mui/icons-material/Visibility';


// Fond animé identique à HomeHero
const AnimatedBackground = () => (
  <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100vw', height: '100vh', overflow: 'hidden' }}>
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
      <defs>
        <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(720 400) scale(700 320)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#f8fafc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="720" cy="400" rx="700" ry="320" fill="url(#paint0_radial)" fillOpacity="0.5" />
    </svg>
    <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform', animation: 'ellipseMove2 22s ease-in-out infinite', opacity: 0.45, mixBlendMode: 'lighten', filter: 'blur(2.5px)' }}>
      <defs>
        <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(900 600) scale(400 180)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#f8fafc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="900" cy="600" rx="400" ry="180" fill="url(#paint1_radial)" fillOpacity="0.7" />
    </svg>
  </Box>
);

interface Invoice {
  id: string;
  number: string;
  status: string;
  issueDate: string;
  dueDate: string;
  totalHt: number;
  totalVat: number;
  totalTtc: number;
  customer: { name: string };
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/invoices?withCustomer=1')
      .then(res => res.json())
      .then(data => {
        setInvoices(data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <AnimatedBackground />
      <Container maxWidth="md" sx={{ zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: 6,
            boxShadow: '0 8px 32px 0 rgba(60,60,100,0.08)',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            width: '100%',
          }}
        >
          <Typography variant="h4" align="center" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.04em', color: '#18181b' }}>
            Factures
          </Typography>
          <Typography align="center" color="#6b7280" sx={{ fontWeight: 400, fontSize: { xs: 16, sm: 18 }, mb: 3, letterSpacing: 0.5 }}>
            Retrouvez toutes vos factures en un clin d’œil.
          </Typography>
          <Button
            component={Link}
            href="/invoices/new"
            variant="contained"
            color="primary"
            startIcon={<Description />}
            sx={{
              borderRadius: 3,
              fontWeight: 500,
              fontSize: 18,
              boxShadow: '0 2px 8px 0 rgba(139,92,246,0.08)',
              background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)',
              transition: 'all .2s',
              mb: 4,
              width: '100%',
              '&:hover': { background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 4px 16px 0 rgba(139,92,246,0.12)' },
            }}
          >
            Nouvelle facture
          </Button>
          {loading ? (
            <Typography align="center" sx={{ mt: 4 }}>Chargement...</Typography>
          ) : (
            <TableContainer sx={{ mt: 2, borderRadius: 3, boxShadow: '0 2px 8px 0 rgba(60,60,100,0.04)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(90deg, #eef2ff 0%, #f0fdfa 100%)' }}>
                    <TableCell sx={{ color: '#6366f1', fontWeight: 800, fontSize: 16 }}>N°</TableCell>
                    <TableCell sx={{ color: '#6366f1', fontWeight: 800, fontSize: 16 }}>Client</TableCell>
                    <TableCell sx={{ color: '#6366f1', fontWeight: 800, fontSize: 16 }}>Date</TableCell>
                    <TableCell sx={{ color: '#0ea5e9', fontWeight: 800, fontSize: 16 }}>Montant HT</TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 800, fontSize: 16 }}>Montant TTC</TableCell>
                    <TableCell sx={{ color: '#6366f1', fontWeight: 800, fontSize: 16 }}>Statut</TableCell>
                    <TableCell sx={{ color: '#6366f1', fontWeight: 800, fontSize: 16 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...invoices]
                    .sort((a, b) => {
                      // Tri par numéro décroissant si possible, sinon par date décroissante
                      const numA = parseInt(a.number.replace(/\D/g, ''));
                      const numB = parseInt(b.number.replace(/\D/g, ''));
                      if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
                        return numB - numA;
                      }
                      return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
                    })
                    .map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell sx={{ fontWeight: 700, color: '#6366f1', fontSize: 17 }}>{invoice.number}</TableCell>
                      <TableCell sx={{ color: '#8b5cf6', fontWeight: 700, fontSize: 16 }}>{invoice.customer?.name}</TableCell>
                      <TableCell sx={{ color: '#6366f1', fontWeight: 600 }}>{invoice.issueDate?.slice(0,10)}</TableCell>
                      <TableCell sx={{ color: '#0ea5e9', fontWeight: 700 }}>{invoice.totalHt.toFixed(2)} €</TableCell>
                      <TableCell sx={{ color: '#10b981', fontWeight: 700 }}>{invoice.totalTtc.toFixed(2)} €</TableCell>
                      <TableCell>
                        <Chip
                          label={invoice.status}
                          color={invoice.status === 'paid' ? 'success' : invoice.status === 'sent' ? 'primary' : 'default'}
                          size="small"
                          sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          component={Link}
                          href={`/invoices/${invoice.id}`}
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<Visibility />}
                          sx={{ borderRadius: 2, fontWeight: 500 }}
                        >
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
            <Button component={Link} href="/" color="primary" variant="text">
              Retour accueil
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
