'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Inventory2, Edit, Delete } from '@mui/icons-material';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  priceHt: number;
  vatRate: number;
  unit: string;
}



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
  </Box>
);

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  function handleDelete(id: string) {
    toast.promise(
      fetch(`/api/products/${id}`, { method: 'DELETE' })
        .then(async res => {
          if (res.ok) {
            setProducts(prev => Array.isArray(prev) ? prev.filter(p => p.id !== id) : []);
            return "Produit supprimé !";
          } else {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || res.statusText);
          }
        }),
      {
        loading: "Suppression...",
        success: (msg) => msg,
        error: (err) => err.message || "Erreur lors de la suppression"
      }
    );
  }

  return (
    <>
      <AnimatedBackground />
      <Container maxWidth="sm" sx={{ zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
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
            Produits
          </Typography>
          <Typography align="center" color="#6b7280" sx={{ fontWeight: 400, fontSize: { xs: 16, sm: 18 }, mb: 3, letterSpacing: 0.5 }}>
            Gérez vos articles avec élégance et rapidité.
          </Typography>
          <Button
            component={Link}
            href="/products/new"
            variant="contained"
            color="primary"
            startIcon={<Inventory2 />}
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
            Nouveau produit
          </Button>
          {loading ? (
            <Typography align="center" sx={{ mt: 4 }}>Chargement...</Typography>
          ) : (
            <Box sx={{ width: '100%', mt: 2 }}>
              {products.length === 0 ? (
                <Typography align="center" color="text.secondary">Aucun produit.</Typography>
              ) : (
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, width: '100%' }}>
                  {(Array.isArray(products) ? products : []).map((product: any) => (
                    <Box key={product.id} component="li" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', py: 2 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{product.priceHt.toFixed(2)} € HT</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          component={Link}
                          href={`/products/${product.id}/edit`}
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<Edit />}
                          sx={{ borderRadius: 2, fontWeight: 500 }}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Delete />}
                          sx={{ borderRadius: 2, fontWeight: 500 }}
                          onClick={() => handleDelete(product.id)}
                        >
                          Supprimer
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
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
