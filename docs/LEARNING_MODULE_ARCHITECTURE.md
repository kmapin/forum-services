# Module de Formation en Ligne - Architecture

## 1. Vision Globale

### Objectif
Plateforme de formation en ligne simple et ludique permettant :
- Aux **enseignants** de créer et gérer des formations structurées
- Aux **étudiants** de suivre des parcours pédagogiques interactifs
- Un **suivi de progression** en temps réel pour les deux parties

### Principes directeurs
- **Simplicité** : Interface épurée, pas de surcharge cognitive
- **Ludification** : Badges, progression visuelle, feedback positif
- **Mobile-first** : Accessible sur tous les appareils
- **MVP rapide** : Fonctionnalités essentielles uniquement

---

## 2. Architecture Fonctionnelle

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLATEFORME LEARNING                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐          ┌──────────────────┐            │
│  │   ENSEIGNANT     │          │     ÉTUDIANT     │            │
│  ├──────────────────┤          ├──────────────────┤            │
│  │ • Créer cours    │          │ • Parcourir cours│            │
│  │ • Gérer parcours │          │ • Suivre leçons  │            │
│  │ • Créer QCM      │          │ • Passer QCM     │            │
│  │ • Voir progrès   │          │ • Voir progrès   │            │
│  │ • Corriger       │          │ • Gagner badges  │            │
│  └────────┬─────────┘          └────────┬─────────┘            │
│           │                              │                      │
│           ▼                              ▼                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    CONTENU                               │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  COURS → PARCOURS → ÉTAPES (Texte/Vidéo/Audio/QCM)     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   PROGRESSION                            │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Inscriptions • Avancement • Scores • Badges            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Modules fonctionnels

#### Module Enseignant
| Fonction | Description |
|----------|-------------|
| Gestion des cours | Créer, modifier, publier des cours |
| Éditeur de parcours | Construire des parcours avec drag & drop |
| Création d'étapes | Ajouter contenu texte, vidéo, audio, QCM |
| Tableau de bord | Voir les inscriptions et progressions |
| Correction | Corriger les exercices et donner des feedbacks |

#### Module Étudiant
| Fonction | Description |
|----------|-------------|
| Catalogue | Parcourir et s'inscrire aux cours |
| Lecteur de cours | Suivre les étapes séquentiellement |
| QCM interactif | Répondre aux questions avec feedback |
| Progression | Voir son avancement et ses scores |
| Badges | Collecter des récompenses |

---

## 3. Stack Technique

### Frontend
| Technologie | Raison |
|-------------|--------|
| **React 18** | Déjà utilisé dans le projet |
| **TypeScript** | Typage fort, moins de bugs |
| **TailwindCSS** | Style rapide et cohérent |
| **Lucide Icons** | Icônes modernes |
| **React DnD** | Drag & drop pour l'éditeur |
| **Framer Motion** | Animations ludiques |

### Backend
| Technologie | Raison |
|-------------|--------|
| **Supabase** | Déjà intégré, Auth + DB + Storage |
| **PostgreSQL** | Base relationnelle robuste |
| **Row Level Security** | Sécurité des données |
| **Supabase Storage** | Hébergement médias (vidéos, audios) |

### Outils complémentaires
| Outil | Usage |
|-------|-------|
| **React Hook Form** | Formulaires performants |
| **Zod** | Validation des données |
| **date-fns** | Manipulation des dates |

---

## 4. Modèle de Données

### Schéma relationnel simplifié

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   profiles  │     │   courses   │     │   paths     │
│─────────────│     │─────────────│     │─────────────│
│ id (PK)     │◄────│ teacher_id  │     │ id (PK)     │
│ role        │     │ id (PK)     │◄────│ course_id   │
│ full_name   │     │ title       │     │ title       │
│ ...         │     │ description │     │ order_index │
└─────────────┘     │ is_published│     │ ...         │
                    └─────────────┘     └──────┬──────┘
                                               │
                    ┌─────────────┐     ┌──────▼──────┐
                    │ enrollments │     │    steps    │
                    │─────────────│     │─────────────│
                    │ id (PK)     │     │ id (PK)     │
                    │ user_id     │     │ path_id     │
                    │ course_id   │     │ type        │
                    │ progress    │     │ content     │
                    │ ...         │     │ order_index │
                    └─────────────┘     └──────┬──────┘
                                               │
┌─────────────┐     ┌─────────────┐     ┌──────▼──────┐
│ qcm_options │     │qcm_questions│     │step_progress│
│─────────────│     │─────────────│     │─────────────│
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ question_id │◄────│ step_id     │     │ user_id     │
│ text        │     │ question    │     │ step_id     │
│ is_correct  │     │ type        │     │ status      │
│ order_index │     │ points      │     │ score       │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Entités principales

#### `courses` - Formations
```sql
- id, title, description, image_url
- teacher_id (créateur)
- category, difficulty_level
- is_published, estimated_duration
- created_at, updated_at
```

#### `paths` - Parcours pédagogiques
```sql
- id, course_id, title, description
- order_index (position dans le cours)
- is_required (obligatoire ou optionnel)
```

#### `steps` - Étapes pédagogiques
```sql
- id, path_id, title
- type: 'text' | 'video' | 'audio' | 'qcm' | 'exercise'
- content (JSON flexible)
- order_index, estimated_duration
```

#### `qcm_questions` - Questions QCM
```sql
- id, step_id, question, type
- points, explanation
- order_index
```

#### `qcm_options` - Options de réponse
```sql
- id, question_id, text
- is_correct, order_index
```

#### `enrollments` - Inscriptions
```sql
- id, user_id, course_id
- enrolled_at, completed_at
- progress_percentage
```

#### `step_progress` - Progression par étape
```sql
- id, user_id, step_id
- status: 'not_started' | 'in_progress' | 'completed'
- score (pour QCM), attempts
- started_at, completed_at
```

#### `badges` - Badges et récompenses
```sql
- id, name, description, icon
- condition_type, condition_value
```

#### `user_badges` - Badges obtenus
```sql
- id, user_id, badge_id
- earned_at
```

---

## 5. Structure des Composants Frontend

```
src/
├── components/
│   └── learning/
│       ├── common/
│       │   ├── ProgressBar.tsx        # Barre de progression animée
│       │   ├── Badge.tsx              # Affichage de badge
│       │   ├── ScoreDisplay.tsx       # Affichage du score
│       │   └── DifficultyBadge.tsx    # Niveau de difficulté
│       │
│       ├── teacher/
│       │   ├── TeacherDashboard.tsx   # Dashboard enseignant
│       │   ├── CourseEditor.tsx       # Éditeur de cours
│       │   ├── PathEditor.tsx         # Éditeur de parcours (DnD)
│       │   ├── StepEditor.tsx         # Éditeur d'étape
│       │   ├── QCMEditor.tsx          # Éditeur de QCM
│       │   └── StudentProgress.tsx    # Suivi des étudiants
│       │
│       ├── student/
│       │   ├── StudentDashboard.tsx   # Dashboard étudiant
│       │   ├── CourseCatalog.tsx      # Catalogue des cours
│       │   ├── CourseViewer.tsx       # Lecteur de cours
│       │   ├── StepViewer.tsx         # Affichage d'une étape
│       │   ├── QCMPlayer.tsx          # Interface QCM interactive
│       │   └── MyProgress.tsx         # Ma progression
│       │
│       └── LearningApp.tsx            # Point d'entrée du module
```

---

## 6. Éditeur de Parcours (UX)

### Fonctionnement

```
┌────────────────────────────────────────────────────────────┐
│  📚 Éditeur de Parcours: "Introduction à React"           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 1. 📝 Qu'est-ce que React ?           [≡] [✏️] [🗑️] │ │
│  └──────────────────────────────────────────────────────┘ │
│                          ↕️                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 2. 🎥 Vidéo: Premier composant        [≡] [✏️] [🗑️] │ │
│  └──────────────────────────────────────────────────────┘ │
│                          ↕️                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 3. ❓ QCM: Vérification des acquis    [≡] [✏️] [🗑️] │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ➕ Ajouter une étape                                 │ │
│  │     📝 Texte  🎥 Vidéo  🎧 Audio  ❓ QCM  ✍️ Exercice │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [Aperçu]                              [Enregistrer]      │
└────────────────────────────────────────────────────────────┘
```

### Interactions
1. **Cliquer sur ➕** → Sélectionner le type d'étape
2. **Drag & Drop** → Réorganiser les étapes (handle [≡])
3. **Cliquer sur ✏️** → Éditer le contenu de l'étape
4. **Cliquer sur 🗑️** → Supprimer (avec confirmation)
5. **[Aperçu]** → Voir comme un étudiant
6. **[Enregistrer]** → Sauvegarder les modifications

### État React
```typescript
interface PathEditorState {
  path: Path;
  steps: Step[];
  selectedStep: Step | null;
  isDragging: boolean;
  hasUnsavedChanges: boolean;
}
```

---

## 7. QCM Interactif (UX)

### Interface Étudiant

```
┌────────────────────────────────────────────────────────────┐
│  Question 3 / 5                              ⏱️ Score: 80  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │   Quelle syntaxe utilise-t-on pour créer un         │ │
│  │   composant React fonctionnel ?                     │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ○  class MyComponent extends React.Component       │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ●  function MyComponent() { return <div/> }   ✅   │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ○  const MyComponent = new Component()              │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  💡 Explication: Les composants fonctionnels sont   │ │
│  │  la méthode moderne et recommandée avec les Hooks.  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ████████████████████░░░░░░░░░░  60%                      │
│                                                            │
│                                      [Question suivante →] │
└────────────────────────────────────────────────────────────┘
```

### Animations
- **Sélection** : Highlight doux de l'option
- **Bonne réponse** : Fond vert + ✅ + confetti (optionnel)
- **Mauvaise réponse** : Fond rouge + ❌ + shake
- **Progression** : Barre animée smoothly

### Logique de correction
```typescript
const checkAnswer = (questionId: string, selectedOptions: string[]) => {
  const question = questions.find(q => q.id === questionId);
  const correctOptions = question.options.filter(o => o.is_correct);
  
  // Choix unique
  if (question.type === 'single') {
    return selectedOptions[0] === correctOptions[0].id;
  }
  
  // Choix multiple
  const correctIds = new Set(correctOptions.map(o => o.id));
  const selectedIds = new Set(selectedOptions);
  return correctIds.size === selectedIds.size && 
         [...correctIds].every(id => selectedIds.has(id));
};
```

---

## 8. Ludification

### Badges prévus
| Badge | Condition | Icône |
|-------|-----------|-------|
| Premier pas | Terminer 1 étape | 🎯 |
| Assidu | 5 jours consécutifs | 🔥 |
| Perfectionniste | 100% à un QCM | ⭐ |
| Explorateur | S'inscrire à 5 cours | 🧭 |
| Diplômé | Terminer un cours | 🎓 |
| Expert | Terminer 10 cours | 🏆 |

### Feedback visuel
- **Toast de félicitations** à chaque étape complétée
- **Animation de level up** quand badge obtenu
- **Confetti** pour les scores parfaits
- **Streak counter** pour la régularité

---

## 9. Routes Prévues

```typescript
// Routes Learning
/learning                    // Dashboard (redirige selon rôle)
/learning/catalog            // Catalogue des cours
/learning/course/:id         // Détail d'un cours
/learning/course/:id/learn   // Mode apprentissage
/learning/my-courses         // Mes cours (étudiant)
/learning/my-progress        // Ma progression

// Routes Enseignant
/learning/teacher            // Dashboard enseignant
/learning/teacher/courses    // Mes cours créés
/learning/teacher/course/:id // Éditer un cours
/learning/teacher/students   // Suivi des étudiants
```

---

## 10. Prochaines Étapes

1. ✅ Documentation architecture (ce fichier)
2. ⬜ Migration SQL pour le modèle de données
3. ⬜ Interfaces TypeScript
4. ⬜ Composants de base (ProgressBar, Badge, etc.)
5. ⬜ Dashboard étudiant
6. ⬜ Dashboard enseignant
7. ⬜ Éditeur de parcours
8. ⬜ QCM interactif
9. ⬜ Système de badges
10. ⬜ Tests et déploiement
