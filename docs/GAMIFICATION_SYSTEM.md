# Système de Gamification - Formation en Ligne

## Philosophie

> **"Motivant sans être infantilisant"**

Le système de gamification vise à encourager l'engagement et la persévérance, sans tomber dans les mécaniques de jeu trop enfantines. L'approche est celle d'un **parcours de progression professionnelle** plutôt qu'un jeu vidéo.

---

## 1. Système de Points

### Types de Points

| Type | Nom | Description | Icône |
|------|-----|-------------|-------|
| **XP** | Points d'expérience | Progression générale | ⚡ |
| **Maîtrise** | Points de compétence | Qualité des réponses | 🎯 |

### Attribution des Points

| Action | XP | Maîtrise | Conditions |
|--------|----|-----------| ----------|
| Compléter une étape texte | +10 | - | Lecture confirmée |
| Terminer une vidéo | +15 | - | Vidéo vue à 90%+ |
| Écouter un audio | +10 | - | Audio écouté à 80%+ |
| Répondre à un QCM | +5 | +0-20 | Selon score |
| Score parfait QCM | +20 bonus | +30 | 100% correct |
| Terminer un parcours | +50 | +20 | Toutes étapes complètes |
| Terminer un cours | +200 | +50 | Tous parcours terminés |
| Connexion quotidienne | +5 | - | 1x par jour max |
| Série de 7 jours | +50 bonus | - | 7 jours consécutifs |

### Niveaux de Progression

```
Niveau 1: Débutant       0 - 100 XP
Niveau 2: Apprenti       101 - 300 XP
Niveau 3: Étudiant       301 - 600 XP
Niveau 4: Pratiquant     601 - 1000 XP
Niveau 5: Confirmé       1001 - 1500 XP
Niveau 6: Avancé         1501 - 2200 XP
Niveau 7: Expert         2201 - 3000 XP
Niveau 8: Maître         3001+ XP
```

---

## 2. Badges (Accomplissements)

### Catégorie: Premiers Pas
*Encourager les débuts*

| Badge | Condition | Points | Icône |
|-------|-----------|--------|-------|
| **Premier Pas** | Terminer sa première étape | 50 XP | 🎯 |
| **Curieux** | S'inscrire à son premier cours | 30 XP | 🔍 |
| **En Route** | Atteindre 25% d'un cours | 40 XP | 🛤️ |

### Catégorie: Régularité
*Valoriser la constance*

| Badge | Condition | Points | Icône |
|-------|-----------|--------|-------|
| **Assidu** | 7 jours consécutifs d'activité | 100 XP | 🔥 |
| **Dévoué** | 30 jours consécutifs | 300 XP | 💪 |
| **Infaillible** | 100 jours consécutifs | 1000 XP | 🏆 |

### Catégorie: Excellence
*Récompenser la qualité*

| Badge | Condition | Points | Icône |
|-------|-----------|--------|-------|
| **Perfectionniste** | Premier score parfait à un QCM | 80 XP | ⭐ |
| **Sans Faute** | 5 scores parfaits | 150 XP | 🌟 |
| **Virtuose** | 20 scores parfaits | 400 XP | ✨ |

### Catégorie: Accomplissement
*Célébrer les étapes majeures*

| Badge | Condition | Points | Icône |
|-------|-----------|--------|-------|
| **Diplômé** | Terminer un cours complet | 200 XP | 🎓 |
| **Polyvalent** | Terminer 5 cours | 500 XP | 📚 |
| **Érudit** | Terminer 10 cours | 1000 XP | 🏅 |

### Catégorie: Exploration
*Encourager la diversité*

| Badge | Condition | Points | Icône |
|-------|-----------|--------|-------|
| **Explorateur** | S'inscrire à 5 cours différents | 100 XP | 🧭 |
| **Touche-à-tout** | Compléter des étapes de 3 types différents | 60 XP | 🎨 |

### Catégorie: Vitesse
*Pour les plus motivés*

| Badge | Condition | Points | Icône |
|-------|-----------|--------|-------|
| **Sprinter** | Terminer un cours en moins de 7 jours | 150 XP | ⚡ |
| **Marathonien** | Compléter 50 étapes | 250 XP | 🏃 |

---

## 3. Moments de Récompense

### Micro-récompenses (immédiates)
*Feedback positif instantané*

| Moment | Récompense | Affichage |
|--------|------------|-----------|
| Étape complétée | Animation check ✓ + "+10 XP" | Toast discret 2s |
| Bonne réponse QCM | Flash vert + son subtil | Inline |
| Mauvaise réponse | Explication constructive | Inline (pas de punition) |

### Récompenses intermédiaires
*Célébration modérée*

| Moment | Récompense | Affichage |
|--------|------------|-----------|
| Parcours terminé | Badge animé + résumé | Modal léger |
| Nouveau niveau | Animation niveau + encouragement | Notification + confetti léger |
| Série maintenue | Compteur flame 🔥 + bonus | Badge animé dans header |

### Récompenses majeures
*Célébration significative*

| Moment | Récompense | Affichage |
|--------|------------|-----------|
| Cours terminé | Certificat visuel + badge | Modal complet |
| Badge rare débloqué | Animation dorée + description | Modal avec partage optionnel |
| Top 10% score | Mention spéciale | Notification + badge profil |

---

## 4. Éléments Visuels

### Barre de Progression (Header)

```
┌──────────────────────────────────────────────────────────┐
│  🧑 Jean Dupont   Niveau 4 • Pratiquant   ⚡ 856 XP      │
│  ████████████████████░░░░░░░░  144 XP → Niveau 5        │
│                                         🔥 12 jours      │
└──────────────────────────────────────────────────────────┘
```

### Profil Accomplissements

```
┌──────────────────────────────────────────────────────────┐
│  Mes Accomplissements                                    │
│                                                          │
│  🎯 Premier Pas    🔥 Assidu       ⭐ Perfectionniste   │
│  🎓 Diplômé        🧭 Explorateur  ░░ Sans Faute        │
│                                                          │
│  Prochain objectif: 3 scores parfaits restants          │
│  pour débloquer "Sans Faute" 🌟                         │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Principes Anti-Infantilisation

### ✅ À FAIRE

| Principe | Exemple |
|----------|---------|
| Vocabulaire professionnel | "Accomplissement" plutôt que "Trophée" |
| Design épuré | Couleurs sobres, pas de personnages cartoon |
| Feedback constructif | Explications sur les erreurs, pas de moqueries |
| Progression significative | Niveaux liés à de vraies compétences |
| Optionnel | Possibilité de masquer la gamification |

### ❌ À ÉVITER

| Piège | Alternative |
|-------|-------------|
| Sons excessifs | Un seul son discret optionnel |
| Animations longues | Animations courtes (<2s) |
| Confetti permanent | Réservé aux accomplissements majeurs |
| Classements publics | Progression personnelle uniquement |
| Punitions visibles | Feedback positif uniquement |
| Pression temporelle | Pas de compte à rebours stressant |

---

## 6. Implémentation Technique

### Tables Existantes (déjà créées)

```sql
-- learning_badges: Définition des badges
-- user_badges: Badges obtenus
-- user_learning_stats: Statistiques utilisateur (XP, streak, etc.)
```

### Fonction de Vérification des Badges

```typescript
const checkBadgeUnlock = async (userId: string, action: string) => {
  const stats = await getUserStats(userId);
  const newBadges = [];

  // Vérifier chaque condition
  if (action === 'step_completed' && stats.total_steps_completed === 1) {
    newBadges.push('premier_pas');
  }
  
  if (stats.current_streak === 7 && !hasBadge(userId, 'assidu')) {
    newBadges.push('assidu');
  }
  
  // Attribuer les nouveaux badges
  for (const badge of newBadges) {
    await grantBadge(userId, badge);
    showBadgeNotification(badge);
  }
};
```

### Hooks React Suggérés

```typescript
// Hooks pour la gamification
useUserXP()           // Retourne XP actuel et niveau
useUserBadges()       // Retourne badges obtenus
useStreak()           // Retourne série actuelle
useBadgeProgress()    // Retourne progression vers prochain badge
```

---

## 7. Métriques de Succès

| Métrique | Objectif |
|----------|----------|
| Taux de complétion | +20% avec gamification |
| Connexions quotidiennes | +30% |
| Temps moyen par session | +15 min |
| Retour après 7 jours | +25% |
| NPS utilisateurs | > 40 |

---

## 8. Roadmap d'Implémentation

### Phase 1 (MVP) ✅
- [x] Système de points XP basique
- [x] 8 badges essentiels
- [x] Barre de progression
- [x] Notifications de récompense

### Phase 2 (Amélioration)
- [ ] Niveaux avec noms
- [ ] Animation de level-up
- [ ] Profil accomplissements
- [ ] Statistiques détaillées

### Phase 3 (Engagement)
- [ ] Défis hebdomadaires
- [ ] Certificats téléchargeables
- [ ] Partage social optionnel
- [ ] Objectifs personnalisés
