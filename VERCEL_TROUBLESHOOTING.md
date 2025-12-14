# 🔧 Dépannage Vercel - 404 NOT_FOUND

## 🐛 Problème persistant

Si vous avez toujours l'erreur **404: NOT_FOUND** sur `/services` après avoir ajouté `vercel.json`, voici les étapes de dépannage.

## ✅ Checklist de vérification

### 1. Vérifier que vercel.json est bien commité

```bash
# Vérifier le statut
git status

# Si vercel.json n'est pas commité
git add vercel.json
git commit -m "Fix: Add vercel.json for SPA routing"
git push
```

### 2. Vérifier le contenu de vercel.json

Le fichier doit contenir :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Forcer un redéploiement sur Vercel

**Option A : Via le Dashboard**
1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet
3. Onglet **Deployments**
4. Cliquer sur les **3 points** du dernier déploiement
5. Cliquer sur **Redeploy**
6. ✅ Cocher **Use existing Build Cache** = OFF
7. Cliquer sur **Redeploy**

**Option B : Via CLI**
```bash
# Installer Vercel CLI si pas déjà fait
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

### 4. Vérifier les logs de build

1. Dashboard Vercel → **Deployments**
2. Cliquer sur le dernier déploiement
3. Onglet **Build Logs**
4. Vérifier qu'il n'y a pas d'erreurs

**Rechercher** :
- ✅ `Build Completed`
- ✅ `Output Directory: dist`
- ❌ Pas d'erreurs de build

### 5. Vérifier la configuration du projet Vercel

Dashboard → Settings → General :

| Paramètre | Valeur attendue |
|-----------|-----------------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

Si ce n'est pas le cas, modifier et redéployer.

## 🔍 Diagnostics avancés

### Vérifier que dist/ contient index.html

Après le build local :

```bash
npm run build
ls dist/
```

Vous devriez voir :
```
dist/
  ├── index.html
  ├── assets/
  │   ├── index-[hash].js
  │   └── index-[hash].css
  └── vite.svg
```

### Tester en local avec preview

```bash
npm run build
npm run preview
```

Puis tester :
- http://localhost:4173/
- http://localhost:4173/services
- http://localhost:4173/services/repassage

Si ça fonctionne en local mais pas sur Vercel, c'est un problème de configuration Vercel.

### Vérifier le fichier .gitignore

Assurez-vous que `vercel.json` n'est **pas** dans `.gitignore` :

```bash
cat .gitignore | grep vercel
```

Si `vercel.json` apparaît, le retirer de `.gitignore`.

## 🚀 Solutions alternatives

### Solution 1 : Utiliser _redirects (Netlify style)

Créer un fichier `public/_redirects` :

```
/*    /index.html   200
```

Puis :
```bash
git add public/_redirects
git commit -m "Add _redirects for SPA routing"
git push
```

### Solution 2 : Configurer via le Dashboard Vercel

1. Settings → **Rewrites and Redirects**
2. Ajouter une règle :
   - **Source** : `/(.*)`
   - **Destination** : `/index.html`
3. Sauvegarder et redéployer

### Solution 3 : Utiliser routes dans vercel.json

```json
{
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

## 🔧 Configuration complète vercel.json

Essayez cette configuration plus complète :

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 📊 Vérifier le déploiement

### Tester toutes les routes

Après redéploiement, tester :

| URL | Attendu |
|-----|---------|
| `https://votre-app.vercel.app/` | ✅ Page Forum |
| `https://votre-app.vercel.app/services` | ✅ Page Conciergerie |
| `https://votre-app.vercel.app/services/repassage` | ✅ Détail service |
| `https://votre-app.vercel.app/admin/conciergerie` | ✅ Modal login |

### Vérifier dans la console du navigateur

1. Ouvrir la console (F12)
2. Aller sur `/services`
3. Vérifier qu'il n'y a pas d'erreurs JavaScript
4. Vérifier que React Router charge bien

## 🆘 Si rien ne fonctionne

### Option 1 : Supprimer et recréer le projet Vercel

1. Dashboard Vercel → Settings → **Advanced**
2. **Delete Project**
3. Réimporter depuis GitHub
4. Configurer :
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Ajouter les variables d'environnement
6. Déployer

### Option 2 : Utiliser un autre service

Si Vercel pose toujours problème :

**Netlify** :
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**Cloudflare Pages** :
- Connecter le repo GitHub
- Build command: `npm run build`
- Output directory: `dist`

## 📞 Informations à fournir pour le support

Si vous avez besoin d'aide, fournir :

1. **URL du déploiement** : `https://votre-app.vercel.app`
2. **Logs de build** : Copier les logs depuis Vercel Dashboard
3. **Contenu de vercel.json** : Copier le fichier
4. **Erreur exacte** : Screenshot ou message d'erreur
5. **Routes qui ne fonctionnent pas** : Liste des URLs en erreur

## ✅ Commandes à exécuter maintenant

```bash
# 1. Vérifier que vercel.json est bien là
cat vercel.json

# 2. Commiter si nécessaire
git add vercel.json
git commit -m "Update vercel.json with build config"
git push

# 3. Attendre le redéploiement automatique (2-3 minutes)

# 4. Tester les routes
curl -I https://votre-app.vercel.app/services
# Devrait retourner 200 OK, pas 404
```

## 🎯 Résumé des actions

1. ✅ Mettre à jour `vercel.json` avec `buildCommand` et `outputDirectory`
2. ✅ Commiter et pusher
3. ✅ Forcer un redéploiement sur Vercel (sans cache)
4. ✅ Vérifier les logs de build
5. ✅ Tester toutes les routes
6. ✅ Si ça ne fonctionne toujours pas, essayer les solutions alternatives

Le problème devrait être résolu après ces étapes ! 🚀
