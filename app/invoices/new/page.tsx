
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import MenuItem from '@mui/material/MenuItem';

interface Customer { id: string; name: string; }
interface Product { id: string; name: string; priceHt: number; vatRate: number; unit: string; }
interface Item { productId: string; description: string; quantity: number; unitPriceHt: number; vatRate: number; }

function AnimatedBackground() {
  return (
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
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0,10));
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setDueDate(new Date(Date.now()+7*24*60*60*1000).toISOString().slice(0,10));
  }, []);

  useEffect(() => {
    fetch('/api/customers').then(r=>r.json()).then(setCustomers);
    fetch('/api/products').then(r=>r.json()).then(setProducts);
  }, []);

  function addItem() {
    setItems(Array.isArray(items) ? [...items, { productId: '', description: '', quantity: 1, unitPriceHt: 0, vatRate: 20 }] : [{ productId: '', description: '', quantity: 1, unitPriceHt: 0, vatRate: 20 }]);
  }
  function updateItem(idx: number, field: keyof Item, value: any) {
    setItems(items => Array.isArray(items) ? items.map((it, i) => i===idx ? { ...it, [field]: value } : it) : []);
  }
  function removeItem(idx: number) {
    setItems(items => Array.isArray(items) ? items.filter((_, i) => i!==idx) : []);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, items, issueDate, dueDate })
    });
    if (response.ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      const err = await response.json().catch(() => ({}));
      setError(err?.error || 'Erreur lors de la création de la facture');
    }
    setLoading(false);
  };

  return (
    <>
      <AnimatedBackground />
      <Container maxWidth="sm" sx={{ zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
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
            Créer une facture
          </Typography>
          <Typography align="center" color="#6b7280" sx={{ fontWeight: 400, fontSize: { xs: 15, sm: 17 }, mb: 3, letterSpacing: 0.5 }}>
            Saisissez les informations de la facture et ajoutez vos articles.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
            <TextField
              select
              label="Client"
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              fullWidth
              required
              margin="normal"
            >
              <MenuItem value="">Sélectionner…</MenuItem>
              {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>
            <TextField
              label="Date d’émission"
              type="date"
              value={issueDate}
              onChange={e => setIssueDate(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Date d’échéance"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Typography variant="h6" sx={{ mt: 3, mb: 1, color: '#333', fontWeight: 700 }}>Articles</Typography>
            {items.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                <TextField
                  select
                  label="Produit"
                  value={item.productId}
                  onChange={e => updateItem(idx, 'productId', e.target.value)}
                  sx={{ flex: 2 }}
                  required
                  size="small"
                >
                  <MenuItem value="">Produit…</MenuItem>
                  {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                </TextField>
                <TextField
                  label="Description"
                  value={item.description}
                  onChange={e => updateItem(idx, 'description', e.target.value)}
                  sx={{ flex: 3 }}
                  size="small"
                />
                <TextField
                  label="Qté"
                  type="number"
                  value={item.quantity}
                  onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                  sx={{ width: 70 }}
                  size="small"
                  required
                  inputProps={{ min: 1, step: 1 }}
                />
                <TextField
                  label="Prix HT"
                  type="number"
                  value={item.unitPriceHt}
                  onChange={e => updateItem(idx, 'unitPriceHt', Number(e.target.value))}
                  sx={{ width: 100 }}
                  size="small"
                  required
                  inputProps={{ step: 0.01 }}
                />
                <TextField
                  label="TVA"
                  type="number"
                  value={item.vatRate}
                  onChange={e => updateItem(idx, 'vatRate', Number(e.target.value))}
                  sx={{ width: 70 }}
                  size="small"
                  required
                  inputProps={{ step: 0.01 }}
                />
                <Button type="button" color="error" onClick={() => removeItem(idx)} sx={{ minWidth: 0, ml: 1 }}><RemoveCircleOutlineIcon /></Button>
              </Box>
            ))}
            <Button type="button" onClick={addItem} color="primary" startIcon={<AddCircleOutlineIcon />} sx={{ mt: 1, mb: 2, fontWeight: 600 }}>
              Ajouter un article
            </Button>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>Facture créée avec succès !</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
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
              {loading ? "Création..." : "Créer"}
            </Button>
          </Box>
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

// ...fin du fichier, tout code résiduel supprimé...
