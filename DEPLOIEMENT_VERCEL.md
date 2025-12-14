# 🚀 Déploiement sur Vercel - Guide Complet

## 🐛 Problème : 404 NOT_FOUND

### Cause

Vercel ne sait pas que votre application est une **SPA (Single Page Application)** avec React Router. 

Quand vous accédez à `/services`, Vercel cherche un fichier physique à cette URL et ne le trouve pas → **404**.

### Solution

Le fichier `vercel.json` a été créé pour rediriger toutes les routes vers `index.html`, permettant à React Router de gérer le routage côté client.

## ✅ Fichier créé : `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Ce fichier indique à Vercel :
- **Toutes les routes** (`(.*)`) doivent être redirigées vers `index.html`
- React Router prendra ensuite le relais pour afficher la bonne page

## 🚀 Étapes de déploiement

### 1. Commiter le fichier vercel.json

```bash
git add vercel.json
git commit -m "Add vercel.json for SPA routing"
git push
```

### 2. Redéployer sur Vercel

Vercel détectera automatiquement le push et redéploiera l'application.

**Ou manuellement** :
1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet `forum-services`
3. Onglet **Deployments**
4. Cliquer sur **Redeploy**

### 3. Vérifier les variables d'environnement

Dans Vercel Dashboard → Settings → Environment Variables :

```
VITE_SUPABASE_URL = https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY = votre-cle-anon-key
```

⚠️ **Important** : Après avoir ajouté/modifié des variables d'environnement, **redéployer** l'application.

## ✅ Test après déploiement

### Routes à tester

| Route | Description | Attendu |
|-------|-------------|---------|
| `/` | Page d'accueil (Forum) | ✅ Affiche le Forum des Services |
| `/services` | Liste des services (Conciergerie) | ✅ Affiche la Conciergerie |
| `/services/repassage` | Détail d'un service | ✅ Affiche le formulaire |
| `/admin/conciergerie` | Admin conciergerie | ✅ Affiche la modal de connexion |

### Vérifications

1. **Toutes les routes fonctionnent** (pas de 404)
2. **Les images se chargent** (logo, etc.)
3. **Les formulaires fonctionnent** (soumission vers Supabase)
4. **L'authentification fonctionne** (connexion admin)

## 🔧 Configuration avancée (optionnelle)

### Optimisations Vercel

Créer un fichier `vercel.json` plus complet :

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
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

Cette configuration ajoute :
- **Headers de sécurité**
- **Cache optimisé** pour les assets

## 🌐 Domaine personnalisé

### Ajouter un domaine

1. Aller dans **Settings** → **Domains**
2. Ajouter votre domaine (ex: `services.eglise-poissy.fr`)
3. Suivre les instructions pour configurer les DNS

### Certificat SSL

Vercel génère automatiquement un certificat SSL (HTTPS) pour tous les domaines.

## 📊 Monitoring

### Logs Vercel

1. **Deployments** → Cliquer sur un déploiement
2. **View Function Logs** pour voir les erreurs

### Analytics (optionnel)

Activer Vercel Analytics :
1. **Analytics** dans le menu
2. **Enable Analytics**
3. Suivre les visites, performances, etc.

## 🐛 Dépannage

### La page est toujours en 404

1. **Vérifier que `vercel.json` est bien commité**
   ```bash
   git status
   git log --oneline -1
   ```

2. **Vérifier le build sur Vercel**
   - Aller dans **Deployments**
   - Vérifier que le build est **Ready**
   - Vérifier les logs de build

3. **Forcer un redéploiement**
   - Onglet **Deployments**
   - Cliquer sur **...** → **Redeploy**

### Les variables d'environnement ne fonctionnent pas

1. **Vérifier qu'elles sont définies**
   - Settings → Environment Variables
   - Vérifier `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

2. **Redéployer après modification**
   - Les variables ne sont appliquées qu'au prochain déploiement

3. **Vérifier le préfixe `VITE_`**
   - Vite nécessite le préfixe `VITE_` pour exposer les variables au client

### Les images ne se chargent pas

1. **Vérifier les chemins**
   - Utiliser des chemins absolus : `/image.png`
   - Ou relatifs depuis `public/` : `./image.png`

2. **Vérifier que les images sont dans `public/`**
   ```
   public/
     ├── image.png
     └── favicon.ico
   ```

### Erreur de connexion Supabase

1. **Vérifier les CORS dans Supabase**
   - Dashboard Supabase → Settings → API
   - Ajouter votre domaine Vercel dans les CORS autorisés

2. **Vérifier les clés API**
   - Utiliser la clé `anon` (publique), pas `service_role`

## 📋 Checklist de déploiement

- [ ] `vercel.json` créé et commité
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Application redéployée
- [ ] Route `/` fonctionne
- [ ] Route `/services` fonctionne
- [ ] Route `/services/:slug` fonctionne
- [ ] Route `/admin/conciergerie` fonctionne
- [ ] Formulaires de soumission fonctionnent
- [ ] Authentification admin fonctionne
- [ ] Images et assets se chargent
- [ ] Pas d'erreurs dans la console

## 🎯 URLs de production

Après déploiement, vos URLs seront :

- **Forum** : `https://forum-services.vercel.app/`
- **Conciergerie** : `https://forum-services.vercel.app/services`
- **Service détail** : `https://forum-services.vercel.app/services/repassage`
- **Admin** : `https://forum-services.vercel.app/admin/conciergerie`

## 📱 QR Codes pour production

Une fois déployé, générez les QR codes avec les URLs de production :

**Forum** :
```
https://forum-services.vercel.app/
```

**Conciergerie** :
```
https://forum-services.vercel.app/services
```

## ✨ Prochaines étapes

1. **Commiter et pusher** `vercel.json`
2. **Attendre le redéploiement** automatique
3. **Tester toutes les routes**
4. **Générer les QR codes** avec les URLs de production
5. **Configurer un domaine personnalisé** (optionnel)

Votre application sera alors accessible et fonctionnelle sur Vercel ! 🎉
