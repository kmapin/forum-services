-- ============================================
-- COURS: Diffusion Vidéo en Direct - Maîtrise Technique
-- ============================================

DO $$
DECLARE
  v_course_id UUID;
  v_path1_id UUID;
  v_path2_id UUID;
  v_path3_id UUID;
  v_step1_id UUID;
  v_step2_id UUID;
  v_step3_id UUID;
  v_step4_id UUID;
  v_step5_id UUID;
  v_step6_id UUID;
  v_step7_id UUID;
  v_step8_id UUID;
  v_step9_id UUID;
BEGIN
  -- Insérer le cours et récupérer son ID
  INSERT INTO courses (id, title, description, difficulty_level, estimated_duration, teacher_id, is_published, created_at)
  VALUES (
    gen_random_uuid(),
    'Diffusion Vidéo en Direct - Maîtrise Technique',
    'Apprenez à maîtriser l''environnement technique de diffusion vidéo en direct pour les cultes. Ce cours couvre la configuration matérielle, la gestion des flux vidéo et audio, et les procédures opérationnelles complètes.',
    'intermediate',
    180,
    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    true,
    NOW()
  ) RETURNING id INTO v_course_id;

  -- ============================================
  -- PARCOURS 1: Comprendre l'environnement technique
  -- ============================================
  INSERT INTO learning_paths (id, course_id, title, description, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_course_id,
    'Comprendre l''environnement technique',
    'Découvrez les deux configurations (ancienne et nouvelle) et comprenez le rôle de chaque équipement dans la chaîne de diffusion.',
    1,
    NOW()
  ) RETURNING id INTO v_path1_id;

  -- Étape 1.1: Configuration ancienne
  INSERT INTO learning_steps (id, path_id, title, step_type, content, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path1_id,
    'Vue d''ensemble - Ancienne configuration',
    'text',
    jsonb_build_object(
      'body', '## Architecture de l''ancienne configuration

### Schéma de connexion

```
┌─────────┐                    ┌─────────┐
│  Audio  │                    │  Vidéo  │
└────┬────┘                    └────┬────┘
     │                              │
     │                              │
     └──────────┐        ┌──────────┘
                │        │
           ┌────▼────────▼────┐
           │        PC         │
           │   ┌─────────┐    │
           │   │   OBS   │────┼──► YouTube
           │   └─────────┘    │
           │                  │────┼──► Zoom
           └──────────────────┘
```

### Composants principaux

L''ancienne configuration repose sur une architecture simple et centralisée :

**Sources Audio et Vidéo**
- **Audio** : Signal provenant de la console de mixage
  - Connecté directement au PC
  - Gère tous les micros, instruments et playback
- **Vidéo** : Caméra unique
  - Connectée au PC via USB ou HDMI
  - Capture vidéo principale du culte

**Traitement central : PC avec OBS**
Le PC est le cœur du système et gère :
- 🎥 **Capture vidéo** : Acquisition du flux caméra
- 🎵 **Capture audio** : Réception du signal audio
- 🎬 **Mixage** : Combinaison audio/vidéo
- 📡 **Encodage** : Compression pour le streaming
- 🌐 **Diffusion** : Envoi simultané vers les plateformes

**Destinations de diffusion**
- **YouTube** : Streaming en direct public
- **Zoom** : Visioconférence pour participants à distance

### Flux de données détaillé

1. **Entrée Audio** : Console de mixage → PC (câble audio)
2. **Entrée Vidéo** : Caméra → PC (USB/HDMI)
3. **Traitement** : OBS capture, mixe et encode les deux flux
4. **Sortie** : OBS diffuse simultanément vers YouTube et Zoom

### Analyse technique

✅ **Avantages**
- Configuration simple et rapide à installer
- Peu d''équipements nécessaires
- Facile à comprendre pour les débutants
- Coût réduit

⚠️ **Limitations**
- Dépendance totale au PC (point de défaillance unique)
- Pas de redondance en cas de panne
- Flexibilité limitée (une seule caméra)
- Charge importante sur le PC
- Pas de transitions professionnelles entre sources'
    ),
    1,
    NOW()
  ) RETURNING id INTO v_step1_id;

  -- Étape 1.2: Matériel ancienne configuration
  INSERT INTO learning_steps (id, path_id, title, step_type, content, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path1_id,
    'Équipements - Ancienne configuration',
    'text',
    jsonb_build_object(
      'body', '## Présentation du matériel

### Console de mixage audio
- **Rôle** : Mixage de toutes les sources audio (micros, instruments, playback)
- **Connexion** : Sortie audio vers le PC (câble jaune)

### Caméra PTZ
- **Type** : Caméra motorisée pilotable à distance
- **Connexion** : USB-A vers le PC (câble bleu)
- **Fonction** : Capture vidéo principale

### Vidéoprojecteur
- **Rôle** : Affichage pour l''assemblée
- **Connexion** : HDMI depuis le splitter (câble vert)

### Écran de contrôle
- **Rôle** : Monitoring pour l''équipe technique
- **Connexion** : HDMI depuis le splitter (câble vert)

### Splitter HDMI
- **Fonction** : Duplique le signal HDMI
- **Entrée** : Signal depuis le PC (câble rouge)
- **Sorties** : Vers vidéoprojecteur et écran de contrôle

### PC de diffusion
- **Rôle central** : Gère tout le flux de diffusion
- **Logiciels** :
  - OBS Studio (streaming)
  - OpenSong (paroles de chants)
  - Navigateur (YouTube, Zoom)

### Câblage
- 🟢 **Vert** : HDMI Output (affichage)
- 🔴 **Rouge** : HDMI Input (entrée vidéo)
- 🟡 **Jaune** : Audio Input (entrée audio)
- 🔵 **Bleu** : USB-A Input (caméra)'
    ),
    2,
    NOW()
  ) RETURNING id INTO v_step2_id;

  -- Étape 1.3: Nouvelle configuration
  INSERT INTO learning_steps (id, path_id, title, step_type, content, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path1_id,
    'Vue d''ensemble - Nouvelle configuration',
    'text',
    jsonb_build_object(
      'body', '## Architecture de la nouvelle configuration

### Schéma de connexion

```
┌─────────┐                    ┌─────────┐
│  Audio  │                    │  Vidéo  │
└────┬────┘                    └────┬────┘
     │                              │
     │                         ┌────▼────────┐
     │                         │ ATEM Mini   │
     │                         │    Pro      │
     │                         └────┬────────┘
     │                              │
     └──────────┐        ┌──────────┘
                │        │
           ┌────▼────────▼────┐
           │        PC         │
           │   ┌─────────┐    │
           │   │   OBS   │────┼──► YouTube
           │   └─────────┘    │
           │                  │────┼──► Zoom
           └──────────────────┘
```

### Évolution majeure : ATEM Mini Pro

La nouvelle configuration introduit un **mélangeur vidéo professionnel** qui révolutionne la gestion des flux vidéo.

### Composants principaux

**Sources**
- **Audio** : Console de mixage → PC (inchangé)
  - Gère tous les micros et instruments
  - Connexion directe au PC
- **Vidéo** : Multiples caméras → ATEM Mini Pro
  - Jusqu''à 4 sources HDMI simultanées
  - Caméras professionnelles avec différents objectifs

**Traitement vidéo : ATEM Mini Pro**
Le cœur de la nouvelle configuration :
- 🎬 **Mélangeur vidéo** : Gère plusieurs sources vidéo
- ✨ **Transitions** : Effets professionnels entre caméras
- 🎨 **Effets** : Picture-in-Picture, split screen
- 📹 **Enregistrement** : Sauvegarde locale intégrée
- 🔄 **Sortie propre** : Envoie un flux vidéo mixé au PC

**Traitement final : PC avec OBS**
Rôle simplifié :
- Reçoit le flux vidéo déjà mixé de l''ATEM
- Ajoute l''audio de la console
- Encode pour le streaming
- Diffuse vers YouTube et Zoom

**Destinations**
- **YouTube** : Streaming en direct public
- **Zoom** : Visioconférence interactive

### Flux de données détaillé

1. **Entrée Vidéo** : Caméras → ATEM Mini Pro (HDMI)
2. **Mixage Vidéo** : ATEM traite et mixe les sources
3. **Sortie Vidéo** : ATEM → PC (USB-C)
4. **Entrée Audio** : Console → PC (audio)
5. **Combinaison** : OBS combine vidéo ATEM + audio
6. **Diffusion** : OBS → YouTube + Zoom

### Avantages de la nouvelle configuration

✅ **Professionnalisme**
- Transitions fluides et élégantes entre caméras
- Qualité vidéo broadcast supérieure
- Multiples angles de vue simultanés
- Effets visuels professionnels

✅ **Flexibilité**
- Jusqu''à 4 caméras simultanées
- Ajout facile de nouvelles sources (ordinateur, tablette)
- Contrôle indépendant de chaque source
- Prévisualisation avant diffusion

✅ **Fiabilité**
- Charge réduite sur le PC (traitement vidéo déporté)
- Traitement vidéo dédié et optimisé
- Enregistrement de secours intégré
- Meilleure stabilité générale du système

✅ **Évolutivité**
- Possibilité d''ajouter plus de sources
- Compatible avec du matériel professionnel
- Mise à jour firmware pour nouvelles fonctionnalités'
    ),
    3,
    NOW()
  ) RETURNING id INTO v_step3_id;

  -- Étape 1.4: Matériel nouvelle configuration
  INSERT INTO learning_steps (id, path_id, title, step_type, content, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path1_id,
    'Équipements - Nouvelle configuration',
    'text',
    jsonb_build_object(
      'body', '## Présentation du matériel évolué

### ATEM Mini Pro (Nouveau !)
- **Rôle central** : Mélangeur vidéo professionnel
- **Capacités** :
  - 4 entrées HDMI
  - Transitions professionnelles
  - Enregistrement intégré
  - Streaming direct possible
- **Connexions** :
  - Entrées : Caméras (câbles rouges)
  - Sortie : Vers PC (USB-C/USB-C&A)
  - Contrôle : USB depuis PC

### Caméras (2 modèles)
- **Caméra avec petit objectif** :
  - Connexion : HDMI vers ATEM (câble rouge)
  - Usage : Plan large ou fixe
  
- **Caméra avec grand objectif** :
  - Connexion : HDMI vers ATEM (câble rouge)
  - Usage : Gros plans, détails
  - ⚠️ Stockage spécial : Carton noir/orange

### Console de mixage audio
- Identique à l''ancienne configuration
- Connexion : Vers PC (câble jaune)

### Splitter HDMI
- **Fonction** : Distribution du signal d''affichage
- **Entrées** :
  - Depuis PC (câble rouge)
  - Depuis caméra PTZ (câble rouge)
- **Sorties** : Vers vidéoprojecteur et écran (câbles verts)

### Écran de monitoring
- **Nouveau** : Affiche le retour de l''ATEM Mini Pro
- Permet de voir ce qui est diffusé en temps réel

### PC de diffusion
- Rôle similaire mais allégé
- Reçoit le flux vidéo déjà mixé de l''ATEM
- Gère l''audio et le streaming final

### Câblage détaillé
- 🟢 **Vert** : HDMI Output (affichage)
- 🔴 **Rouge** : HDMI Input (entrées vidéo)
- 🟡 **Jaune** : Audio Input (entrée audio)
- 🔵 **Bleu** : ATEM Mini Pro Management (USB-C/USB-C&A)'
    ),
    4,
    NOW()
  ) RETURNING id INTO v_step4_id;

  -- QCM Parcours 1
  INSERT INTO learning_steps (id, path_id, title, step_type, content, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path1_id,
    'Quiz : Environnement technique',
    'qcm',
    jsonb_build_object('description', 'Testez vos connaissances sur les configurations matérielles'),
    5,
    NOW()
  ) RETURNING id INTO v_step5_id;

  -- Questions QCM Parcours 1
  INSERT INTO qcm_questions (id, step_id, question, order_index, created_at)
  VALUES 
    (gen_random_uuid(), v_step5_id, 'Quel est le rôle principal de l''ATEM Mini Pro dans la nouvelle configuration ?', 1, NOW()),
    (gen_random_uuid(), v_step5_id, 'Quelle couleur de câble représente les connexions HDMI Input ?', 2, NOW()),
    (gen_random_uuid(), v_step5_id, 'Quel équipement gère le streaming final vers YouTube et Zoom ?', 3, NOW());

  -- Options pour question 1
  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Enregistrer uniquement les vidéos', false, NOW() FROM qcm_questions WHERE question = 'Quel est le rôle principal de l''ATEM Mini Pro dans la nouvelle configuration ?'
  UNION ALL
  SELECT id, 'Mélanger plusieurs sources vidéo et gérer les transitions', true, NOW() FROM qcm_questions WHERE question = 'Quel est le rôle principal de l''ATEM Mini Pro dans la nouvelle configuration ?'
  UNION ALL
  SELECT id, 'Gérer uniquement l''audio', false, NOW() FROM qcm_questions WHERE question = 'Quel est le rôle principal de l''ATEM Mini Pro dans la nouvelle configuration ?'
  UNION ALL
  SELECT id, 'Remplacer le PC de diffusion', false, NOW() FROM qcm_questions WHERE question = 'Quel est le rôle principal de l''ATEM Mini Pro dans la nouvelle configuration ?';

  -- Options pour question 2
  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Vert', false, NOW() FROM qcm_questions WHERE question = 'Quelle couleur de câble représente les connexions HDMI Input ?'
  UNION ALL
  SELECT id, 'Rouge', true, NOW() FROM qcm_questions WHERE question = 'Quelle couleur de câble représente les connexions HDMI Input ?'
  UNION ALL
  SELECT id, 'Jaune', false, NOW() FROM qcm_questions WHERE question = 'Quelle couleur de câble représente les connexions HDMI Input ?'
  UNION ALL
  SELECT id, 'Bleu', false, NOW() FROM qcm_questions WHERE question = 'Quelle couleur de câble représente les connexions HDMI Input ?';

  -- Options pour question 3
  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'L''ATEM Mini Pro', false, NOW() FROM qcm_questions WHERE question = 'Quel équipement gère le streaming final vers YouTube et Zoom ?'
  UNION ALL
  SELECT id, 'La console de mixage', false, NOW() FROM qcm_questions WHERE question = 'Quel équipement gère le streaming final vers YouTube et Zoom ?'
  UNION ALL
  SELECT id, 'Le PC avec OBS', true, NOW() FROM qcm_questions WHERE question = 'Quel équipement gère le streaming final vers YouTube et Zoom ?'
  UNION ALL
  SELECT id, 'Le splitter HDMI', false, NOW() FROM qcm_questions WHERE question = 'Quel équipement gère le streaming final vers YouTube et Zoom ?';

  -- ============================================
  -- PARCOURS 2: Gestion de la diffusion vidéo
  -- ============================================
  INSERT INTO learning_paths (id, course_id, title, description, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_course_id,
    'Gestion de la diffusion vidéo',
    'Maîtrisez les procédures de démarrage et d''arrêt de la diffusion vidéo, ainsi que la gestion des annonces et du streaming.',
    2,
    NOW()
  ) RETURNING id INTO v_path2_id;

  -- Étape 2.1: Procédures de démarrage
  INSERT INTO learning_steps (id, path_id, title, step_type, content, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path2_id,
    'Démarrage de la diffusion - Début du culte',
    'text',
    jsonb_build_object(
      'body', '## Checklist complète de démarrage

### Responsabilités de l''équipe vidéo (début du culte)

#### 1. Allumage du système (30 min avant)
- ✅ **Allumer le PC de diffusion**
  - Attendre le démarrage complet de Windows
  - Vérifier la connexion internet
- ✅ **Brancher l''ATEM Mini Pro sur la multiprise**
  - Vérifier que les LED s''allument
  - Attendre l''initialisation complète (environ 10 secondes)
- ✅ **Brancher le switch HDMI sur la multiprise**
  - S''assurer que tous les ports sont alimentés

#### 2. Préparation des chants (25 min avant)
- ✅ **Ouvrir OpenSong**
  - Lancer le logiciel depuis le bureau
  - Charger la base de données des chants
- ✅ **Préparer la liste des chants du jour**
  - Créer ou ouvrir la playlist du culte
  - Vérifier l''ordre des chants
  - Tester l''affichage de chaque chant
- ✅ **Modifier le titre de la prédication**
  - Mettre à jour le titre selon le message du jour
  - Vérifier l''orthographe
- ✅ **Mettre à jour la date du culte**
  - Format : Dimanche DD/MM/YYYY
  - Vérifier l''affichage sur les écrans

#### 3. Vérification des écrans (20 min avant) ⚠️ TRÈS IMPORTANT !!!
- ✅ **Vérifier l''affichage sur les 3 écrans** :
  - **Vidéoprojecteur** : Affichage pour l''assemblée
  - **Écran de contrôle** : Monitoring technique
  - **Écran de monitoring ATEM** : Prévisualisation des sources

⚠️ **PROCÉDURE DE DÉPANNAGE** - Si l''image ne s''affiche pas sur le vidéoprojecteur :
1. Débrancher le câble HDMI du vidéoprojecteur
2. Attendre 5 secondes
3. Rebrancher le câble HDMI du vidéoprojecteur
4. Si le problème persiste :
   - Débrancher le câble HDMI du splitter HDMI
   - Attendre 5 secondes
   - Rebrancher le câble du splitter HDMI
5. Vérifier que le vidéoprojecteur est sur la bonne entrée HDMI

💡 **Astuce** : Cette manipulation résout 90% des problèmes d''affichage

#### 4. Configuration OBS (15 min avant)
- ✅ **Ouvrir OBS Studio**
  - Lancer depuis le bureau
  - Vérifier que toutes les sources sont actives
- ✅ **Préparer la diffusion des annonces**
  - Charger les slides d''annonces
  - Vérifier le contenu et l''ordre
  - Tester les transitions
- ✅ **Vérifier les scènes configurées**
  - Scène "Annonces"
  - Scène "Chants"
  - Scène "Prédication"
  - Scène "Fin de culte"

#### 5. Tests audio/vidéo (10 min avant)
- ✅ **Tester le son**
  - Vérifier le niveau audio dans OBS
  - S''assurer qu''il n''y a pas de saturation
  - Tester avec un micro
- ✅ **Tester la vidéo**
  - Vérifier toutes les sources caméra dans l''ATEM
  - Tester les transitions entre caméras
  - Vérifier la qualité d''image

#### 6. Démarrage du streaming (3 min avant)
- ✅ **Commencer le streaming YouTube**
  - Cliquer sur "Démarrer le streaming" dans OBS
  - ⏰ **TIMING CRITIQUE : 3 minutes avant le début du culte**
  - Attendre la confirmation de connexion
- ✅ **Vérifier que le stream est actif**
  - Ouvrir YouTube sur un autre appareil
  - Confirmer que le direct est visible
  - Vérifier le délai (environ 10-15 secondes)

#### 7. Diffusion du jingle (après la prière d''ouverture)
- ✅ **Diffuser le jingle d''ouverture** :
  - 🔊 Dans la salle (via le système audio)
  - 📺 Sur YouTube (via OBS)
- ⚠️ **IMPORTANT : Uniquement APRÈS la prière d''ouverture**
  - Ne jamais diffuser le jingle avant la prière
  - Attendre le signal du responsable du culte

### Timeline recommandée

| Temps | Action |
|-------|--------|
| **-30 min** | Allumage du système |
| **-25 min** | Préparation OpenSong |
| **-20 min** | Vérification écrans |
| **-15 min** | Configuration OBS |
| **-10 min** | Tests audio/vidéo |
| **-5 min** | Vérification finale complète |
| **-3 min** | 🔴 Démarrage streaming YouTube |
| **0 min** | Début du culte - Prière d''ouverture |
| **+2 min** | Diffusion du jingle |

### Points de contrôle essentiels

✅ Tous les équipements sont allumés
✅ Les 3 écrans affichent correctement
✅ OpenSong est prêt avec la bonne playlist
✅ OBS est configuré avec toutes les scènes
✅ Le streaming YouTube est actif
✅ L''équipe est prête et en position'
    ),
    1,
    NOW()
  ) RETURNING id INTO v_step6_id;

  -- Étape 2.2: Procédures d'arrêt
  INSERT INTO learning_steps (id, path_id, title, step_type, content, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path2_id,
    'Arrêt de la diffusion - Fin du culte',
    'text',
    jsonb_build_object(
      'body', '## Procédure de fin de diffusion

### Responsabilités de l''équipe vidéo (fin du culte)

#### 1. Diffusion des annonces de fin
- ✅ **Diffuser les annonces**
  - Annonces de début ET de fin
  - ⚠️ **Pas en boucle** : Une seule fois chacune
  - Respecter l''ordre prévu
- ✅ **Diffuser le message de fin de culte**
  - Message de remerciement
  - Informations pratiques
  - Invitation à revenir

💡 **Important** : Les annonces doivent être diffusées UNIQUEMENT au début et à la fin, pas en boucle continue

#### 2. Arrêt du streaming
- ✅ **Arrêter le streaming depuis OBS**
  - Cliquer sur "Arrêter le streaming"
  - Attendre la confirmation d''arrêt
  - Vérifier que le bouton est redevenu "Démarrer le streaming"
- ✅ **Arrêter le streaming depuis YouTube**
  - Ouvrir YouTube Studio
  - Terminer le direct
  - Confirmer l''arrêt
- ✅ **Vérifier que les deux sont bien arrêtés**
  - Double vérification sur OBS
  - Double vérification sur YouTube
  - S''assurer qu''il n''y a plus de diffusion active

#### 3. Extinction du système (À faire UNIQUEMENT à la fin)

⚠️ **ATTENTION** : Ne faire cette étape qu''une fois que tout le monde a quitté et que plus personne n''utilise le système

- ✅ **Débrancher l''ATEM Mini Pro**
  - Débrancher de la multiprise
  - Attendre l''extinction complète des LED
- ✅ **Débrancher le switch HDMI**
  - Débrancher de la multiprise
  - Ranger les câbles si nécessaire
- ✅ **Arrêter tous les programmes**
  - Fermer OpenSong (sauvegarder si demandé)
  - Fermer OBS Studio (sauvegarder la configuration si demandé)
  - Fermer tous les navigateurs web
  - Fermer toutes les autres applications
- ✅ **Éteindre le PC**
  - Menu Démarrer > Arrêter
  - Attendre l''extinction complète
  - Ne pas forcer l''arrêt

### Points d''attention critiques

⚠️ **Timing** :
- Ne pas arrêter le streaming trop tôt
- Laisser le temps aux annonces de se terminer complètement
- Attendre que le message de fin soit affiché pendant au moins 10 secondes

⚠️ **Vérifications** :
- Vérifier que personne n''utilise plus le système
- S''assurer que l''enregistrement est bien sauvegardé (si activé)
- Confirmer que tous les fichiers importants sont sauvegardés

⚠️ **Coordination** :
- Communiquer avec le responsable du culte
- S''assurer que toutes les équipes ont terminé
- Ne pas précipiter l''extinction

### Checklist de fin complète

**Phase 1 : Diffusion**
- [ ] Annonces de début diffusées
- [ ] Annonces de fin diffusées
- [ ] Message de fin affiché
- [ ] Temps d''affichage respecté (10 sec minimum)

**Phase 2 : Arrêt streaming**
- [ ] Streaming arrêté dans OBS
- [ ] Streaming arrêté sur YouTube
- [ ] Double vérification effectuée
- [ ] Confirmation d''arrêt obtenue

**Phase 3 : Extinction (uniquement à la fin)**
- [ ] ATEM Mini Pro débranché
- [ ] Switch HDMI débranché
- [ ] OpenSong fermé
- [ ] OBS Studio fermé
- [ ] Navigateurs fermés
- [ ] Autres applications fermées
- [ ] PC éteint correctement
- [ ] Zone de travail rangée
- [ ] Câbles organisés

### Ordre chronologique recommandé

1. **Fin du culte** : Bénédiction finale
2. **+30 sec** : Diffuser annonces de fin
3. **+2 min** : Diffuser message de fin
4. **+2 min 10 sec** : Arrêter streaming OBS
5. **+2 min 15 sec** : Arrêter streaming YouTube
6. **+5 min** : Vérifier que tout est terminé
7. **Quand la salle est vide** : Débrancher équipements
8. **En dernier** : Fermer programmes et éteindre PC'
    ),
    2,
    NOW()
  ) RETURNING id INTO v_step7_id;

  -- QCM Parcours 2
  INSERT INTO learning_steps (id, path_id, title, step_type, content, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path2_id,
    'Quiz : Gestion de la diffusion',
    'qcm',
    jsonb_build_object('description', 'Vérifiez votre maîtrise des procédures de diffusion'),
    3,
    NOW()
  ) RETURNING id INTO v_step8_id;

  -- Questions QCM Parcours 2
  INSERT INTO qcm_questions (id, step_id, question, order_index, created_at)
  VALUES 
    (gen_random_uuid(), v_step8_id, 'Combien de temps avant le début du culte faut-il démarrer le streaming YouTube ?', 1, NOW()),
    (gen_random_uuid(), v_step8_id, 'Quand faut-il diffuser le jingle d''ouverture ?', 2, NOW()),
    (gen_random_uuid(), v_step8_id, 'Que faire si l''image ne s''affiche pas sur le vidéoprojecteur ?', 3, NOW()),
    (gen_random_uuid(), v_step8_id, 'Comment diffuser les annonces de fin ?', 4, NOW());

  -- Options QCM Parcours 2
  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, '10 minutes avant', false, NOW() FROM qcm_questions WHERE question = 'Combien de temps avant le début du culte faut-il démarrer le streaming YouTube ?'
  UNION ALL
  SELECT id, '3 minutes avant', true, NOW() FROM qcm_questions WHERE question = 'Combien de temps avant le début du culte faut-il démarrer le streaming YouTube ?'
  UNION ALL
  SELECT id, '1 minute avant', false, NOW() FROM qcm_questions WHERE question = 'Combien de temps avant le début du culte faut-il démarrer le streaming YouTube ?'
  UNION ALL
  SELECT id, 'Au moment exact du début', false, NOW() FROM qcm_questions WHERE question = 'Combien de temps avant le début du culte faut-il démarrer le streaming YouTube ?';

  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Dès le démarrage du streaming', false, NOW() FROM qcm_questions WHERE question = 'Quand faut-il diffuser le jingle d''ouverture ?'
  UNION ALL
  SELECT id, 'Uniquement après la prière d''ouverture', true, NOW() FROM qcm_questions WHERE question = 'Quand faut-il diffuser le jingle d''ouverture ?'
  UNION ALL
  SELECT id, 'Avant l''arrivée des fidèles', false, NOW() FROM qcm_questions WHERE question = 'Quand faut-il diffuser le jingle d''ouverture ?'
  UNION ALL
  SELECT id, 'À la fin du culte', false, NOW() FROM qcm_questions WHERE question = 'Quand faut-il diffuser le jingle d''ouverture ?';

  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Redémarrer le PC immédiatement', false, NOW() FROM qcm_questions WHERE question = 'Que faire si l''image ne s''affiche pas sur le vidéoprojecteur ?'
  UNION ALL
  SELECT id, 'Débrancher et rebrancher les câbles HDMI du vidéoprojecteur et du splitter', true, NOW() FROM qcm_questions WHERE question = 'Que faire si l''image ne s''affiche pas sur le vidéoprojecteur ?'
  UNION ALL
  SELECT id, 'Changer de vidéoprojecteur', false, NOW() FROM qcm_questions WHERE question = 'Que faire si l''image ne s''affiche pas sur le vidéoprojecteur ?'
  UNION ALL
  SELECT id, 'Attendre que ça se règle tout seul', false, NOW() FROM qcm_questions WHERE question = 'Que faire si l''image ne s''affiche pas sur le vidéoprojecteur ?';

  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'En boucle continue', false, NOW() FROM qcm_questions WHERE question = 'Comment diffuser les annonces de fin ?'
  UNION ALL
  SELECT id, 'Début et fin uniquement, pas en boucle', true, NOW() FROM qcm_questions WHERE question = 'Comment diffuser les annonces de fin ?'
  UNION ALL
  SELECT id, 'Ne pas les diffuser', false, NOW() FROM qcm_questions WHERE question = 'Comment diffuser les annonces de fin ?'
  UNION ALL
  SELECT id, 'Seulement sur YouTube', false, NOW() FROM qcm_questions WHERE question = 'Comment diffuser les annonces de fin ?';

  -- ============================================
  -- PARCOURS 3: Gestion des caméras
  -- ============================================
  INSERT INTO learning_paths (id, course_id, title, description, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_course_id,
    'Gestion des caméras',
    'Apprenez à installer, configurer et ranger correctement les caméras de diffusion.',
    3,
    NOW()
  ) RETURNING id INTO v_path3_id;

  -- Étape 3.1: Installation des caméras
  INSERT INTO learning_steps (id, path_id, title, step_type, content, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path3_id,
    'Installation des caméras - Début du culte',
    'text',
    jsonb_build_object(
      'body', '## Procédure d''installation des caméras

### Responsabilités de l''équipe caméras (début du culte)

#### 1. Préparation du matériel (35 min avant)
- ✅ **Placer les trépieds aux emplacements définis**
  - Position 1 : Vue d''ensemble (fond de la salle)
  - Position 2 : Gros plan estrade (côté)
  - Vérifier la stabilité de chaque trépied
  - Ajuster la hauteur selon les besoins

- ✅ **Insérer les batteries dans les caméras**
  - Vérifier que les batteries sont chargées (LED verte)
  - Insérer fermement jusqu''au clic
  - S''assurer que la batterie est bien verrouillée

- ✅ **Monter et fixer les caméras sur les supports dédiés**
  - Visser la caméra sur la tête du trépied
  - Serrer fermement mais sans forcer
  - Vérifier que la caméra est bien fixée
  - Tester la rotation et l''inclinaison

#### 2. Connexion des caméras (30 min avant)
- ✅ **Brancher l''adaptateur Micro HDMI / HDMI sur chaque caméra**
  - Connecter délicatement (port fragile)
  - S''assurer que le connecteur est bien enfoncé
  - Ne pas forcer si résistance

- ✅ **Connecter les câbles HDMI vers l''ATEM Mini Pro**
  - Câble caméra 1 → Entrée HDMI 1 de l''ATEM
  - Câble caméra 2 → Entrée HDMI 2 de l''ATEM
  - Vérifier que les câbles sont bien branchés
  - Organiser les câbles pour éviter les chutes

#### 3. Mise en route (25 min avant)
- ✅ **Allumer les caméras**
  - Appuyer sur le bouton Power
  - Attendre le démarrage complet (5-10 secondes)

- ✅ **Vérifier l''alimentation**
  - LED allumée (verte ou bleue selon le modèle)
  - Indicateur de batterie visible à l''écran
  - Niveau de charge suffisant (>50%)

#### 4. Réglages techniques (20 min avant)
- ✅ **Effectuer les réglages nécessaires** :

  **Focus (Netteté)**
  - Passer en mode manuel si nécessaire
  - Zoomer au maximum sur le sujet
  - Ajuster le focus pour une netteté parfaite
  - Dézoomer en gardant le focus

  **Luminosité (Exposition)**
  - Vérifier l''histogramme
  - Ajuster l''exposition (ni trop sombre, ni surexposé)
  - Utiliser la compensation d''exposition si besoin
  - Vérifier sur l''écran de l''ATEM

  **Mode "vidéo"**
  - Sélectionner le mode vidéo (pas photo)
  - Régler la résolution (1080p recommandé)
  - Fréquence d''images : 25 ou 30 fps
  - Désactiver la stabilisation si sur trépied

  **Autres réglages**
  - Balance des blancs : Auto ou Tungsten selon éclairage
  - ISO : Le plus bas possible pour réduire le bruit
  - Obturateur : 1/50 ou 1/60 selon la fréquence

### Points d''attention critiques

⚠️ **Caméra avec petit objectif** :
- 📦 **Stockage** : Carton noir/orange
- 🎥 **Usage** : Plans larges, vue d''ensemble de la salle
- 📍 **Position** : Généralement au fond de la salle
- 🔧 **Réglages** : Grand angle, profondeur de champ importante

⚠️ **Caméra avec grand objectif** :
- 📦 **Stockage** : Carton orange UNIQUEMENT
- 🎥 **Usage** : Gros plans, détails, visages
- 📍 **Position** : Sur le côté de l''estrade
- 🔧 **Réglages** : Téléobjectif, focus précis
- ⚠️ **TRÈS IMPORTANT** : Ne JAMAIS démonter l''objectif
  - Placer l''ensemble caméra + objectif dans la boîte orange
  - Raison : Éviter poussière et dommages au capteur

### Checklist d''installation complète

**Matériel**
- [ ] Trépieds en place et stables
- [ ] Batteries chargées et insérées
- [ ] Caméras fixées solidement sur supports
- [ ] Adaptateurs Micro HDMI branchés
- [ ] Câbles HDMI connectés à l''ATEM

**Mise en route**
- [ ] Caméras allumées
- [ ] LED d''alimentation visible
- [ ] Niveau de batterie >50%
- [ ] Signal visible sur l''ATEM

**Réglages**
- [ ] Focus réglé et net
- [ ] Luminosité/exposition correcte
- [ ] Mode vidéo activé
- [ ] Résolution 1080p configurée
- [ ] Balance des blancs ajustée
- [ ] Cadrage vérifié

**Tests**
- [ ] Test de l''image sur l''ATEM
- [ ] Test des transitions entre caméras
- [ ] Vérification de la qualité d''image
- [ ] Test du zoom (si utilisé)

### Conseils pratiques

💡 **Cadrage**
- Caméra 1 (grand angle) : Vue d''ensemble incluant l''estrade et une partie de l''assemblée
- Caméra 2 (téléobjectif) : Cadrage serré sur le prédicateur ou les musiciens

💡 **Sécurité**
- Placer les câbles de manière à éviter les chutes
- Sécuriser les trépieds (écarter les pieds au maximum)
- Ne jamais laisser une caméra sans surveillance sur un trépied'
    ),
    1,
    NOW()
  ) RETURNING id INTO v_step9_id;

  -- Étape 3.2: Rangement des caméras
  INSERT INTO learning_steps (id, path_id, title, step_type, content, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path3_id,
    'Rangement des caméras - Fin du culte',
    'text',
    jsonb_build_object(
      'body', '## Procédure de rangement des caméras

### Responsabilités de l''équipe caméras (fin du culte)

#### 1. Extinction des caméras
- ✅ **Éteindre toutes les caméras**
  - Appuyer sur le bouton Power et maintenir
  - Attendre le message de confirmation
  - Confirmer l''extinction

- ✅ **Vérifier que les LED sont éteintes**
  - Aucune LED allumée
  - Écran complètement noir
  - Attendre 5 secondes pour être sûr

#### 2. Déconnexion (dans l''ordre)
- ✅ **Débrancher l''adaptateur Micro HDMI / HDMI de chaque caméra**
  - Débrancher délicatement (port fragile)
  - Tenir la caméra d''une main
  - Tirer doucement sur le connecteur (pas sur le câble)
  - Ne jamais forcer

- ✅ **Ranger les câbles proprement**
  - Enrouler sans serrer
  - Utiliser des attaches si disponibles
  - Éviter les nœuds
  - Ranger dans le sac dédié

#### 3. Démontage
- ✅ **Démonter les caméras des trépieds**
  - Dévisser la caméra de la tête du trépied
  - Tenir fermement la caméra pendant le dévissage
  - Poser la caméra sur une surface stable

- ✅ **Ranger les trépieds**
  - Replier les pieds
  - Réduire la hauteur au minimum
  - Ranger dans le coin dédié
  - S''assurer qu''ils sont stables

#### 4. Gestion des batteries (IMPORTANT)
- ✅ **Retirer les batteries des caméras**
  - Déverrouiller le compartiment
  - Retirer délicatement la batterie
  - Vérifier le niveau de charge restant

- ✅ **Placer les batteries dans les chargeurs dédiés**
  - Insérer dans le bon sens
  - Vérifier que la LED de charge s''allume
  - S''assurer que le chargeur est branché

- ⚠️ **IMPORTANT : Toujours recharger après utilisation**
  - Même si la batterie n''est pas complètement vide
  - Garantit une charge complète pour le prochain culte
  - Prolonge la durée de vie des batteries

#### 5. Rangement du matériel
- ✅ **Vérifier que les batteries sont en charge**
  - LED rouge/orange = en charge
  - LED verte = chargée
  - Laisser branché jusqu''au prochain culte

- ✅ **Remettre les caméras et accessoires dans leur carton d''origine**
  - Suivre les instructions de stockage spécifique ci-dessous
  - Manipuler avec précaution
  - S''assurer que tout est bien calé

### Stockage spécifique DÉTAILLÉ

#### 📦 Caméra avec petit objectif
**Carton : NOIR/ORANGE**

**Contenu à ranger :**
- ✅ Caméra (corps)
- ✅ Petit objectif (peut être démonté)
- ✅ Bouchons d''objectif (avant et arrière)
- ✅ Courroie de transport
- ✅ Accessoires divers

**Procédure :**
1. Remettre les bouchons d''objectif
2. Placer la caméra dans son emplacement
3. Ajouter les accessoires dans les compartiments
4. Fermer le carton

#### 📦 Caméra avec grand objectif
**Carton : ORANGE UNIQUEMENT**

⚠️ **PROCÉDURE SPÉCIALE - TRÈS IMPORTANT** :

**Pour la caméra avec le grand objectif :**
- ❌ **NE PAS démonter l''objectif de la caméra**
- ✅ **Placer l''ENSEMBLE (caméra + grand objectif monté) dans la boîte orange**

**Raisons critiques :**
- 🛡️ Éviter l''entrée de poussière sur le capteur
- 🔒 Éviter les dommages au système de fixation
- 🎯 Maintenir le calibrage optique
- ⚡ Protéger les contacts électroniques

**Procédure détaillée :**
1. Remettre le bouchon d''objectif AVANT
2. Remettre le bouchon de boîtier ARRIÈRE (si l''objectif était démonté)
3. Placer délicatement l''ensemble dans la boîte orange
4. S''assurer que la caméra est bien calée
5. Fermer le carton orange
6. ⚠️ **Vérifier visuellement que l''objectif est toujours monté**

**Image de référence :**
```
┌─────────────────────────┐
│  CARTON ORANGE         │
│                         │
│  ┌──────────────────┐  │
│  │ Caméra + Grand   │  │
│  │ Objectif MONTÉ   │  │
│  │ (Ne pas séparer) │  │
│  └──────────────────┘  │
│                         │
│  Chargeur de batterie  │
└─────────────────────────┘
```

### Checklist de rangement complète

**Phase 1 : Extinction**
- [ ] Toutes les caméras éteintes
- [ ] Toutes les LED éteintes
- [ ] Attente de 5 secondes confirmée

**Phase 2 : Déconnexion**
- [ ] Adaptateurs HDMI débranchés délicatement
- [ ] Câbles enroulés proprement
- [ ] Câbles rangés dans le sac

**Phase 3 : Démontage**
- [ ] Caméras démontées des trépieds
- [ ] Trépieds repliés
- [ ] Trépieds rangés au bon endroit

**Phase 4 : Batteries**
- [ ] Batteries retirées des caméras
- [ ] Batteries insérées dans les chargeurs
- [ ] LED de charge allumées
- [ ] Chargeurs branchés

**Phase 5 : Stockage**
- [ ] Caméra petit objectif → Carton NOIR/ORANGE
- [ ] Caméra grand objectif → Carton ORANGE (avec objectif MONTÉ)
- [ ] Bouchons d''objectif remis
- [ ] Accessoires rangés
- [ ] Cartons fermés

**Phase 6 : Vérification finale**
- [ ] Zone de travail propre
- [ ] Tous les câbles rangés
- [ ] Rien oublié sur place
- [ ] Matériel sécurisé

### Maintenance préventive

✅ **Après chaque utilisation** :
- **Batteries** : Vérifier l''état et mettre en charge
- **Objectifs** : Nettoyer avec un chiffon microfibre si nécessaire
- **Capteur** : Ne jamais toucher, signaler si poussière visible
- **Boîtier** : Essuyer avec un chiffon doux
- **Problèmes** : Signaler immédiatement tout dysfonctionnement

✅ **Vérification hebdomadaire** :
- État des batteries (capacité de charge)
- Propreté des objectifs
- Fonctionnement des boutons
- État des câbles et connecteurs

✅ **S''assurer que** :
- Tout est dans les bonnes boîtes
- Les cartons sont bien identifiés
- Le matériel est accessible pour le prochain culte
- Rien ne manque

### En cas de problème

🔧 **Problèmes courants et solutions** :
- **Batterie ne charge pas** : Vérifier les contacts, nettoyer si nécessaire
- **Objectif difficile à démonter** : Ne pas forcer, demander de l''aide
- **Poussière sur l''objectif** : Utiliser une soufflette puis chiffon microfibre
- **Carton manquant** : Signaler immédiatement au responsable'
    ),
    2,
    NOW()
  );

  -- QCM Parcours 3
  INSERT INTO learning_steps (id, path_id, title, step_type, content, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path3_id,
    'Quiz : Gestion des caméras',
    'qcm',
    jsonb_build_object('description', 'Validez vos connaissances sur la manipulation des caméras'),
    3,
    NOW()
  );

  -- Questions QCM Parcours 3
  INSERT INTO qcm_questions (id, step_id, question, order_index, created_at)
  SELECT gen_random_uuid(), id, 'Quels réglages faut-il effectuer sur les caméras après les avoir allumées ?', 1, NOW() FROM learning_steps WHERE title = 'Quiz : Gestion des caméras' AND path_id = v_path3_id
  UNION ALL
  SELECT gen_random_uuid(), id, 'Que faut-il faire avec les batteries après utilisation ?', 2, NOW() FROM learning_steps WHERE title = 'Quiz : Gestion des caméras' AND path_id = v_path3_id
  UNION ALL
  SELECT gen_random_uuid(), id, 'Comment ranger la caméra avec le grand objectif ?', 3, NOW() FROM learning_steps WHERE title = 'Quiz : Gestion des caméras' AND path_id = v_path3_id
  UNION ALL
  SELECT gen_random_uuid(), id, 'Quel carton utiliser pour la caméra avec le petit objectif ?', 4, NOW() FROM learning_steps WHERE title = 'Quiz : Gestion des caméras' AND path_id = v_path3_id;

  -- Options QCM Parcours 3
  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Aucun réglage nécessaire', false, NOW() FROM qcm_questions WHERE question = 'Quels réglages faut-il effectuer sur les caméras après les avoir allumées ?'
  UNION ALL
  SELECT id, 'Focus, luminosité et mode vidéo', true, NOW() FROM qcm_questions WHERE question = 'Quels réglages faut-il effectuer sur les caméras après les avoir allumées ?'
  UNION ALL
  SELECT id, 'Uniquement le focus', false, NOW() FROM qcm_questions WHERE question = 'Quels réglages faut-il effectuer sur les caméras après les avoir allumées ?'
  UNION ALL
  SELECT id, 'Uniquement la luminosité', false, NOW() FROM qcm_questions WHERE question = 'Quels réglages faut-il effectuer sur les caméras après les avoir allumées ?';

  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Les laisser dans les caméras', false, NOW() FROM qcm_questions WHERE question = 'Que faut-il faire avec les batteries après utilisation ?'
  UNION ALL
  SELECT id, 'Les retirer et les placer dans les chargeurs pour recharge', true, NOW() FROM qcm_questions WHERE question = 'Que faut-il faire avec les batteries après utilisation ?'
  UNION ALL
  SELECT id, 'Les jeter', false, NOW() FROM qcm_questions WHERE question = 'Que faut-il faire avec les batteries après utilisation ?'
  UNION ALL
  SELECT id, 'Les ranger sans les recharger', false, NOW() FROM qcm_questions WHERE question = 'Que faut-il faire avec les batteries après utilisation ?';

  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Démonter l''objectif et ranger séparément', false, NOW() FROM qcm_questions WHERE question = 'Comment ranger la caméra avec le grand objectif ?'
  UNION ALL
  SELECT id, 'Placer l''ensemble (caméra + objectif monté) dans la boîte orange', true, NOW() FROM qcm_questions WHERE question = 'Comment ranger la caméra avec le grand objectif ?'
  UNION ALL
  SELECT id, 'Laisser la caméra sur le trépied', false, NOW() FROM qcm_questions WHERE question = 'Comment ranger la caméra avec le grand objectif ?'
  UNION ALL
  SELECT id, 'Ranger dans le carton noir', false, NOW() FROM qcm_questions WHERE question = 'Comment ranger la caméra avec le grand objectif ?';

  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Carton orange uniquement', false, NOW() FROM qcm_questions WHERE question = 'Quel carton utiliser pour la caméra avec le petit objectif ?'
  UNION ALL
  SELECT id, 'Carton noir/orange', true, NOW() FROM qcm_questions WHERE question = 'Quel carton utiliser pour la caméra avec le petit objectif ?'
  UNION ALL
  SELECT id, 'Carton bleu', false, NOW() FROM qcm_questions WHERE question = 'Quel carton utiliser pour la caméra avec le petit objectif ?'
  UNION ALL
  SELECT id, 'Pas de carton spécifique', false, NOW() FROM qcm_questions WHERE question = 'Quel carton utiliser pour la caméra avec le petit objectif ?';

END $$;
