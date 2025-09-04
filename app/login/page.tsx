
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import LoginIcon from '@mui/icons-material/Login';

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

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Erreur inconnue");
      }
    } catch (err) {
      setError("Erreur réseau ou serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <Container maxWidth="xs" sx={{ zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
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
            Connexion
          </Typography>
          <Typography align="center" color="#6b7280" sx={{ fontWeight: 400, fontSize: { xs: 15, sm: 17 }, mb: 3, letterSpacing: 0.5 }}>
            Accédez à votre espace sécurisé.
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', mt: 1 }}>
            <TextField
              label="Nom d'utilisateur"
              value={username}
              onChange={e => setUsername(e.target.value)}
              fullWidth
              required
              margin="normal"
              autoFocus
            />
            <TextField
              label="Mot de passe"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              autoComplete="current-password"
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<LoginIcon />}
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                fontSize: 18,
                boxShadow: '0 2px 8px 0 rgba(139,92,246,0.08)',
                background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)',
                transition: 'all .2s',
                mt: 3,
                '&:hover': { background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 4px 16px 0 rgba(139,92,246,0.12)' },
              }}
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
