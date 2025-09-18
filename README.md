
# Automatisation de Factures – Plateforme Premium


## 🚀 Présentation

Application Next.js 15/React 19 pour la gestion et l’automatisation de factures, inspirée du design Apple/Revolut : UI premium, responsive, animations, glassmorphism, typographies modernes, expérience utilisateur haut de gamme.

---

## 🏆 Fonctionnalités principales

- **Dashboard premium** : stats, top clients, exports CSV
- **Factures** : création, édition, suppression, visualisation, export PDF, paiement Stripe, envoi par email
- **Clients** : création, édition, suppression, tri alphabétique
- **Produits** : création, édition, suppression
- **Authentification** (login)
- **Filtres, recherche, responsive** mobile/tablette/desktop
- **Design Apple/Revolut** : fond animé, glassmorphism, boutons dégradés, couleurs premium, typographies Urbanist/Inter

---

## 🛠️ Stack technique

- Next.js 15, React 19, TypeScript
- Tailwind CSS 4, MUI, Framer Motion, react-hot-toast, react-avatar
- API REST (pages/api)
- Stripe (paiement)
- Export CSV/PDF

---

## 🗂️ Structure du projet

- `/app` : pages Next.js (dashboard, factures, clients, produits, login, etc.)
- `/app/_components` : composants réutilisables (fond animé, hero, etc.)
- `/public` : assets statiques (logo, screenshot, etc.)
- `/scripts` : scripts utilitaires (seed, etc.)
- `/styles` : fichiers globaux

---

## ⚡ Installation & Lancement

```bash
git clone <https://github.com/lbrandon69/Facturobot.git>
cd <https://github.com/lbrandon69/Facturobot.git>
npm install
npm run dev
```

---

## ☁️ Déploiement

- Prêt pour Vercel ou tout hébergeur Next.js compatible
- Variables d’environnement à configurer pour Stripe, base de données, etc.

---

## 🔥 Exemples d’usage

- Créer/éditer/supprimer des clients, produits, factures
- Générer et télécharger des factures PDF
- Envoyer une facture par email ou la faire payer en ligne (Stripe)
- Exporter la base clients/produits/factures en CSV
- Visualiser les stats et top clients sur le dashboard

---

## 📈 Évolutions futures possibles

- Moteur de recherche global
- Gestion multi-utilisateurs et rôles
- Statistiques avancées (graphiques, exports personnalisés)
- Automatisation de relances clients
- Personnalisation avancée des thèmes/couleurs
- Application mobile (PWA ou React Native)
- Intégration CRM/ERP

---

## 🧑‍💻 Bonnes pratiques & conseils

- Respecter la structure premium (fond animé, glassmorphism, typographies, responsive)
- Utiliser les composants existants pour garder la cohérence visuelle
- Nettoyer régulièrement les dépendances et le code mort
- Privilégier la simplicité d’usage et la rapidité d’accès aux infos clés

---

## ❓ FAQ

**Q : Comment ajouter un nouveau client/produit ?**
A : Utiliser le bouton “Nouveau client/produit” sur la page correspondante.

**Q : Comment exporter mes données ?**
A : Utiliser les boutons d’export CSV sur le dashboard ou les pages concernées.

**Q : Comment personnaliser le design ?**
A : Modifier les couleurs/fonds dans les composants ou le tailwind.config.js.

**Q : Comment activer le paiement Stripe ?**
A : Renseigner les variables d’environnement Stripe dans un fichier .env.local.

**Q : Comment déployer sur Vercel ?**
A : Pousser le repo, configurer les variables d’environnement, c’est prêt !

---

## 📸 Screenshots

> Ajoutez ici vos captures d’écran premium (dashboard, factures, clients, etc.)

---

## 🛟 Suupport & Contact

Pour toute évolution, bug ou suggestion, ouvrir une issue ou contacter le développeur.

---

## 👤 Auteur

Projet réalisé par Lbrandon.
