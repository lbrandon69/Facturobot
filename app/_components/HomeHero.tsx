"use client";
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import Link from 'next/link';
import { BarChart, People, Inventory2, ReceiptLong } from '@mui/icons-material';

export default function HomeHero() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* SVG décoratif flou en fond */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <style>{`
          @keyframes ellipseMove {
            0% {
              transform: scale(1.02) translateY(-30px) rotate(-2deg);
            }
            30% {
              transform: scale(1.08) translateY(40px) rotate(3deg);
            }
            60% {
              transform: scale(0.98) translateY(-20px) rotate(-4deg);
            }
            100% {
              transform: scale(1.02) translateY(-30px) rotate(-2deg);
            }
          }
          @keyframes ellipseMove2 {
            0% {
              transform: scale(1.1) translate(80px, 60px) rotate(0deg);
            }
            50% {
              transform: scale(1.18) translate(-60px, -40px) rotate(6deg);
            }
            100% {
              transform: scale(1.1) translate(80px, 60px) rotate(0deg);
            }
          }
        `}</style>
        {/* Premier SVG animé (accentué) */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            willChange: 'transform',
            animation: 'ellipseMove 14s ease-in-out infinite',
            filter: 'blur(0.5px)',
          }}
        >
          <ellipse cx="720" cy="400" rx="700" ry="320" fill="url(#paint0_radial)" fillOpacity="0.5" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(720 400) scale(700 320)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a5b4fc" />
              <stop offset="1" stopColor="#f8fafc" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        {/* Second SVG animé (couleur complémentaire, effet waouh) */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            willChange: 'transform',
            animation: 'ellipseMove2 22s ease-in-out infinite',
            opacity: 0.45,
            mixBlendMode: 'lighten',
            filter: 'blur(2.5px)',
          }}
        >
          <ellipse cx="900" cy="600" rx="400" ry="180" fill="url(#paint1_radial)" fillOpacity="0.7" />
          <defs>
            <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(900 600) scale(400 180)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f472b6" />
              <stop offset="1" stopColor="#f8fafc" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </Box>
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
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <TextHoverEffect text="Facturobot" fontSize={48} color="#222" />
          </Box>
          <Typography
            variant="h6"
            align="center"
            color="#6b7280"
            sx={{ fontWeight: 400, fontSize: { xs: 18, sm: 22 }, mb: 4, letterSpacing: 0.5 }}
          >
            Plateforme d’automatisation de factures<br />
            <span style={{ color: '#8b5cf6', fontWeight: 500 }}>Simple. Élégant. Efficace.</span>
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-2">
            <Link href="/dashboard">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                startIcon={<BarChart />}
                sx={{
                  borderRadius: 3,
                  fontWeight: 500,
                  fontSize: 18,
                  boxShadow: '0 2px 8px 0 rgba(139,92,246,0.08)',
                  background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)',
                  transition: 'all .2s',
                  '&:hover': { background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 4px 16px 0 rgba(139,92,246,0.12)' },
                }}
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/customers">
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<People />}
                sx={{
                  borderRadius: 3,
                  fontWeight: 500,
                  fontSize: 18,
                  background: 'rgba(245,245,255,0.7)',
                  borderColor: '#e0e7ef',
                  color: '#222',
                  transition: 'all .2s',
                  '&:hover': { background: '#f3f4f6', borderColor: '#8b5cf6', color: '#8b5cf6' },
                }}
              >
                Clients
              </Button>
            </Link>
            <Link href="/products">
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<Inventory2 />}
                sx={{
                  borderRadius: 3,
                  fontWeight: 500,
                  fontSize: 18,
                  background: 'rgba(245,245,255,0.7)',
                  borderColor: '#e0e7ef',
                  color: '#222',
                  transition: 'all .2s',
                  '&:hover': { background: '#f3f4f6', borderColor: '#8b5cf6', color: '#8b5cf6' },
                }}
              >
                Produits
              </Button>
            </Link>
            <Link href="/invoices">
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<ReceiptLong />}
                sx={{
                  borderRadius: 3,
                  fontWeight: 500,
                  fontSize: 18,
                  background: 'rgba(245,245,255,0.7)',
                  borderColor: '#e0e7ef',
                  color: '#222',
                  transition: 'all .2s',
                  '&:hover': { background: '#f3f4f6', borderColor: '#8b5cf6', color: '#8b5cf6' },
                }}
              >
                Factures
              </Button>
            </Link>
          </div>
        </Paper>
      </Container>
    </Box>
  );
}
