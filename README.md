# OmarSoft – Jlidi Network Solutions · Site officiel (v3.1)

Site vitrine + catalogue + espace administrateur, en français, arabe et anglais.
**Stack :** React 18 · Vite · Tailwind CSS · Supabase · Vercel

> Installation pas à pas : **`Guide-Installation-OmarSoft.pdf`**. Nouveautés de la v3.1 (menu administrable, exemples de catalogue) : **`Guide-MiseAJour-v3.1.pdf`** et **`MISE-A-JOUR-v3.1.txt`**.

## Démarrage rapide

```powershell
copy .env.example .env.local      # puis renseignez les 2 clés Supabase
npm install
npm run dev                       # http://localhost:5173
npm run build                     # vérifie que le projet compile
```

## Contenu

| Dossier / fichier | Rôle |
|---|---|
| `src/components/SolarSystem.jsx` | Hero : le logo est le soleil, les services sont des planètes |
| `src/components/Navbar.jsx` | Menu latéral **ou** horizontal (au choix de l'admin), tiroir sur mobile, drapeaux SVG |
| `src/pages/Admin/ManageMenu.jsx` | Admin > Menu du site : disposition, ordre, noms FR/AR/EN, liens personnalisés |
| `src/pages/Admin/` | Tableau de bord, produits, services, galerie, devis/factures, demandes, paramètres |
| `src/i18n/translations.js` | Tous les textes FR / AR / EN |
| `src/utils/config.js` | Coordonnées de l'entreprise |
| `supabase/schema.sql` | Base de données, sécurité, stockage (relançable sans risque) |
| `supabase/catalogue-exemples.sql` | 8 produits et 6 images de galerie **d'exemple** (à remplacer) |
| `supabase/supprimer-exemples.sql` | Supprime tous les exemples encore marqués « EXEMPLE » |
| `public/` | Logo, icônes, image de partage, robots.txt, sitemap.xml, llms.txt |
| `public/examples/` | Illustrations des exemples (produits et galerie) |

## Sécurité

- Seules les adresses listées dans `is_admin()` (voir `schema.sql`) peuvent modifier les données.
- Ne publiez jamais la clé `service_role`. Le fichier `.env.local` n'est jamais envoyé sur GitHub (`.gitignore`).
