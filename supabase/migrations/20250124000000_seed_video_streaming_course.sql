-- ============================================
-- COURS: Diffusion Vidéo en Direct - Maîtrise Technique
-- ============================================

-- Insérer le cours
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
);

-- Récupérer l'ID du cours
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
  -- Récupérer l'ID du cours
  SELECT id INTO v_course_id FROM courses WHERE title = 'Diffusion Vidéo en Direct - Maîtrise Technique';

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
  INSERT INTO learning_steps (id, path_id, title, content, type, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path1_id,
    'Vue d''ensemble - Ancienne configuration',
    E'## Architecture de l''ancienne configuration\n\n### Composants principaux\n\nL''ancienne configuration repose sur une architecture simple :\n\n**Sources Audio et Vidéo**\n- **Audio** : Connecté directement au PC\n- **Vidéo** : Caméra connectée au PC\n\n**Traitement central**\n- **PC avec OBS** : Logiciel de streaming qui gère :\n  - La capture audio et vidéo\n  - Le mixage des sources\n  - L''encodage pour le streaming\n  - La diffusion vers les plateformes\n\n**Destinations de diffusion**\n- **YouTube** : Streaming en direct\n- **Zoom** : Visioconférence\n\n### Flux de données\n\n1. L''audio arrive au PC depuis la console de mixage\n2. La vidéo arrive au PC depuis la caméra\n3. OBS capture et mixe ces sources\n4. OBS encode et diffuse simultanément vers YouTube et Zoom\n\n### Points clés\n\n✅ **Avantages**\n- Configuration simple\n- Peu d''équipements\n- Facile à comprendre\n\n⚠️ **Limitations**\n- Dépendance totale au PC\n- Pas de redondance\n- Flexibilité limitée',
    'lesson',
    1,
    NOW()
  ) RETURNING id INTO v_step1_id;

  -- Étape 1.2: Matériel ancienne configuration
  INSERT INTO learning_steps (id, path_id, title, content, type, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path1_id,
    'Équipements - Ancienne configuration',
    E'## Présentation du matériel\n\n### Console de mixage audio\n- **Rôle** : Mixage de toutes les sources audio (micros, instruments, playback)\n- **Connexion** : Sortie audio vers le PC (câble jaune)\n\n### Caméra PTZ\n- **Type** : Caméra motorisée pilotable à distance\n- **Connexion** : USB-A vers le PC (câble bleu)\n- **Fonction** : Capture vidéo principale\n\n### Vidéoprojecteur\n- **Rôle** : Affichage pour l''assemblée\n- **Connexion** : HDMI depuis le splitter (câble vert)\n\n### Écran de contrôle\n- **Rôle** : Monitoring pour l''équipe technique\n- **Connexion** : HDMI depuis le splitter (câble vert)\n\n### Splitter HDMI\n- **Fonction** : Duplique le signal HDMI\n- **Entrée** : Signal depuis le PC (câble rouge)\n- **Sorties** : Vers vidéoprojecteur et écran de contrôle\n\n### PC de diffusion\n- **Rôle central** : Gère tout le flux de diffusion\n- **Logiciels** :\n  - OBS Studio (streaming)\n  - OpenSong (paroles de chants)\n  - Navigateur (YouTube, Zoom)\n\n### Câblage\n- 🟢 **Vert** : HDMI Output (affichage)\n- 🔴 **Rouge** : HDMI Input (entrée vidéo)\n- 🟡 **Jaune** : Audio Input (entrée audio)\n- 🔵 **Bleu** : USB-A Input (caméra)',
    'lesson',
    2,
    NOW()
  ) RETURNING id INTO v_step2_id;

  -- Étape 1.3: Nouvelle configuration
  INSERT INTO learning_steps (id, path_id, title, content, type, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path1_id,
    'Vue d''ensemble - Nouvelle configuration',
    E'## Architecture de la nouvelle configuration\n\n### Évolution majeure : ATEM Mini Pro\n\nLa nouvelle configuration introduit un **mélangeur vidéo professionnel** qui centralise la gestion des flux.\n\n### Composants principaux\n\n**Sources**\n- **Audio** : Console de mixage → PC\n- **Vidéo** : Caméra → ATEM Mini Pro\n\n**Traitement vidéo**\n- **ATEM Mini Pro** : Mélangeur vidéo professionnel\n  - Gère plusieurs sources vidéo\n  - Permet les transitions\n  - Envoie un flux propre au PC\n\n**Traitement final**\n- **PC avec OBS** : Reçoit le flux vidéo de l''ATEM\n  - Ajoute l''audio\n  - Encode pour le streaming\n  - Diffuse vers les plateformes\n\n**Destinations**\n- **YouTube** : Streaming en direct\n- **Zoom** : Visioconférence\n\n### Avantages de la nouvelle configuration\n\n✅ **Professionnalisme**\n- Transitions fluides entre caméras\n- Qualité vidéo supérieure\n- Plus de sources vidéo possibles\n\n✅ **Flexibilité**\n- Plusieurs caméras simultanées\n- Ajout facile de nouvelles sources\n- Contrôle indépendant de la vidéo\n\n✅ **Fiabilité**\n- Moins de charge sur le PC\n- Traitement vidéo dédié\n- Meilleure stabilité',
    'lesson',
    3,
    NOW()
  ) RETURNING id INTO v_step3_id;

  -- Étape 1.4: Matériel nouvelle configuration
  INSERT INTO learning_steps (id, path_id, title, content, type, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path1_id,
    'Équipements - Nouvelle configuration',
    E'## Présentation du matériel évolué\n\n### ATEM Mini Pro (Nouveau !)\n- **Rôle central** : Mélangeur vidéo professionnel\n- **Capacités** :\n  - 4 entrées HDMI\n  - Transitions professionnelles\n  - Enregistrement intégré\n  - Streaming direct possible\n- **Connexions** :\n  - Entrées : Caméras (câbles rouges)\n  - Sortie : Vers PC (USB-C/USB-C&A)\n  - Contrôle : USB depuis PC\n\n### Caméras (2 modèles)\n- **Caméra avec petit objectif** :\n  - Connexion : HDMI vers ATEM (câble rouge)\n  - Usage : Plan large ou fixe\n  \n- **Caméra avec grand objectif** :\n  - Connexion : HDMI vers ATEM (câble rouge)\n  - Usage : Gros plans, détails\n  - ⚠️ Stockage spécial : Carton noir/orange\n\n### Console de mixage audio\n- Identique à l''ancienne configuration\n- Connexion : Vers PC (câble jaune)\n\n### Splitter HDMI\n- **Fonction** : Distribution du signal d''affichage\n- **Entrées** :\n  - Depuis PC (câble rouge)\n  - Depuis caméra PTZ (câble rouge)\n- **Sorties** : Vers vidéoprojecteur et écran (câbles verts)\n\n### Écran de monitoring\n- **Nouveau** : Affiche le retour de l''ATEM Mini Pro\n- Permet de voir ce qui est diffusé en temps réel\n\n### PC de diffusion\n- Rôle similaire mais allégé\n- Reçoit le flux vidéo déjà mixé de l''ATEM\n- Gère l''audio et le streaming final\n\n### Câblage détaillé\n- 🟢 **Vert** : HDMI Output (affichage)\n- 🔴 **Rouge** : HDMI Input (entrées vidéo)\n- 🟡 **Jaune** : Audio Input (entrée audio)\n- 🔵 **Bleu** : ATEM Mini Pro Management (USB-C/USB-C&A)',
    'lesson',
    4,
    NOW()
  ) RETURNING id INTO v_step4_id;

  -- QCM Parcours 1
  INSERT INTO learning_steps (id, path_id, title, content, type, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path1_id,
    'Quiz : Environnement technique',
    'Testez vos connaissances sur les configurations matérielles',
    'qcm',
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
  INSERT INTO learning_steps (id, path_id, title, content, type, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path2_id,
    'Démarrage de la diffusion - Début du culte',
    E'## Checklist complète de démarrage\n\n### Responsabilités de l''équipe vidéo\n\n#### 1. Allumage du système\n- ✅ Allumer le PC de diffusion\n- ✅ Brancher l''ATEM Mini Pro sur la multiprise\n- ✅ Brancher le switch HDMI sur la multiprise\n\n#### 2. Préparation des chants\n- ✅ Ouvrir OpenSong\n- ✅ Préparer la liste des chants du jour\n- ✅ Modifier le titre de la prédication\n- ✅ Mettre à jour la date du culte\n\n#### 3. Vérification des écrans (TRÈS IMPORTANT !!!)\n- ✅ Vérifier l''affichage sur les 3 écrans :\n  - Vidéoprojecteur (salle)\n  - Écran de contrôle\n  - Écran de monitoring ATEM\n\n⚠️ **Si l''image ne s''affiche pas sur le vidéoprojecteur** :\n1. Débrancher le câble HDMI du vidéoprojecteur\n2. Rebrancher le câble HDMI\n3. Débrancher le câble du splitter HDMI\n4. Rebrancher le câble du splitter HDMI\n\n#### 4. Configuration OBS\n- ✅ Ouvrir OBS Studio\n- ✅ Préparer la diffusion des annonces\n- ✅ Vérifier les scènes configurées\n\n#### 5. Démarrage du streaming\n- ✅ Commencer le streaming YouTube **3 minutes avant le début du culte**\n- ✅ Vérifier que le stream est actif\n\n#### 6. Diffusion du jingle\n- ✅ Diffuser le jingle d''ouverture :\n  - Dans la salle (via le système audio)\n  - Sur YouTube (via OBS)\n- ⚠️ **Uniquement après la prière d''ouverture**\n\n### Timeline recommandée\n\n**30 minutes avant** : Allumage et vérifications\n**15 minutes avant** : Tests audio/vidéo\n**5 minutes avant** : Vérification finale\n**3 minutes avant** : Démarrage streaming YouTube\n**Début du culte** : Prière d''ouverture\n**Après la prière** : Diffusion du jingle',
    'lesson',
    1,
    NOW()
  ) RETURNING id INTO v_step6_id;

  -- Étape 2.2: Procédures d'arrêt
  INSERT INTO learning_steps (id, path_id, title, content, type, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path2_id,
    'Arrêt de la diffusion - Fin du culte',
    E'## Procédure de fin de diffusion\n\n### Responsabilités de l''équipe vidéo\n\n#### 1. Diffusion des annonces de fin\n- ✅ Diffuser les annonces de début ET de fin\n- ⚠️ **Pas en boucle** : Une seule fois\n- ✅ Diffuser le message de fin de culte\n\n#### 2. Arrêt du streaming\n- ✅ Arrêter le streaming depuis OBS\n- ✅ Arrêter le streaming depuis YouTube\n- ✅ Vérifier que les deux sont bien arrêtés\n\n#### 3. Extinction du système (À faire uniquement à la fin)\n- ✅ Débrancher l''ATEM Mini Pro\n- ✅ Débrancher le switch HDMI\n- ✅ Arrêter tous les programmes :\n  - OpenSong\n  - OBS Studio\n  - Navigateurs web\n  - Autres applications\n- ✅ Éteindre le PC\n\n### Points d''attention\n\n⚠️ **Important** :\n- Ne pas arrêter le streaming trop tôt\n- Laisser le temps aux annonces de se terminer\n- Vérifier que personne n''utilise plus le système\n- S''assurer que l''enregistrement est bien sauvegardé (si activé)\n\n### Checklist de fin\n\n- [ ] Annonces diffusées\n- [ ] Message de fin affiché\n- [ ] Streaming arrêté (OBS)\n- [ ] Streaming arrêté (YouTube)\n- [ ] ATEM Mini Pro débranché\n- [ ] Switch HDMI débranché\n- [ ] Programmes fermés\n- [ ] PC éteint\n- [ ] Zone de travail rangée',
    'lesson',
    2,
    NOW()
  ) RETURNING id INTO v_step7_id;

  -- QCM Parcours 2
  INSERT INTO learning_steps (id, path_id, title, content, type, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path2_id,
    'Quiz : Gestion de la diffusion',
    'Vérifiez votre maîtrise des procédures de diffusion',
    'qcm',
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

  -- Options pour question 1
  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, '10 minutes avant', false, NOW() FROM qcm_questions WHERE question = 'Combien de temps avant le début du culte faut-il démarrer le streaming YouTube ?'
  UNION ALL
  SELECT id, '3 minutes avant', true, NOW() FROM qcm_questions WHERE question = 'Combien de temps avant le début du culte faut-il démarrer le streaming YouTube ?'
  UNION ALL
  SELECT id, '1 minute avant', false, NOW() FROM qcm_questions WHERE question = 'Combien de temps avant le début du culte faut-il démarrer le streaming YouTube ?'
  UNION ALL
  SELECT id, 'Au moment exact du début', false, NOW() FROM qcm_questions WHERE question = 'Combien de temps avant le début du culte faut-il démarrer le streaming YouTube ?';

  -- Options pour question 2
  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Dès le démarrage du streaming', false, NOW() FROM qcm_questions WHERE question = 'Quand faut-il diffuser le jingle d''ouverture ?'
  UNION ALL
  SELECT id, 'Uniquement après la prière d''ouverture', true, NOW() FROM qcm_questions WHERE question = 'Quand faut-il diffuser le jingle d''ouverture ?'
  UNION ALL
  SELECT id, 'Avant l''arrivée des fidèles', false, NOW() FROM qcm_questions WHERE question = 'Quand faut-il diffuser le jingle d''ouverture ?'
  UNION ALL
  SELECT id, 'À la fin du culte', false, NOW() FROM qcm_questions WHERE question = 'Quand faut-il diffuser le jingle d''ouverture ?';

  -- Options pour question 3
  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Redémarrer le PC immédiatement', false, NOW() FROM qcm_questions WHERE question = 'Que faire si l''image ne s''affiche pas sur le vidéoprojecteur ?'
  UNION ALL
  SELECT id, 'Débrancher et rebrancher les câbles HDMI du vidéoprojecteur et du splitter', true, NOW() FROM qcm_questions WHERE question = 'Que faire si l''image ne s''affiche pas sur le vidéoprojecteur ?'
  UNION ALL
  SELECT id, 'Changer de vidéoprojecteur', false, NOW() FROM qcm_questions WHERE question = 'Que faire si l''image ne s''affiche pas sur le vidéoprojecteur ?'
  UNION ALL
  SELECT id, 'Attendre que ça se règle tout seul', false, NOW() FROM qcm_questions WHERE question = 'Que faire si l''image ne s''affiche pas sur le vidéoprojecteur ?';

  -- Options pour question 4
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
  INSERT INTO learning_steps (id, path_id, title, content, type, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path3_id,
    'Installation des caméras - Début du culte',
    E'## Procédure d''installation des caméras\n\n### Responsabilités de l''équipe caméras\n\n#### 1. Préparation du matériel\n- ✅ Placer les trépieds aux emplacements définis\n- ✅ Insérer les batteries dans les caméras\n- ✅ Monter et fixer les caméras sur les supports dédiés\n\n#### 2. Connexion des caméras\n- ✅ Brancher l''adaptateur Micro HDMI / HDMI sur chaque caméra\n- ✅ Connecter les câbles HDMI vers l''ATEM Mini Pro\n\n#### 3. Mise en route\n- ✅ Allumer les caméras\n- ✅ Vérifier l''alimentation (LED allumée)\n\n#### 4. Réglages techniques\n- ✅ Effectuer les réglages nécessaires :\n  - **Focus** : Netteté de l''image\n  - **Luminosité** : Exposition correcte\n  - **Mode "vidéo"** : Paramètres optimisés pour la vidéo\n  - Autres réglages selon le modèle\n\n### Points d''attention\n\n⚠️ **Caméra avec petit objectif** :\n- Stockage : Carton noir/orange\n- Usage : Plans larges, vue d''ensemble\n\n⚠️ **Caméra avec grand objectif** :\n- Stockage : Carton orange uniquement\n- Usage : Gros plans, détails\n- **IMPORTANT** : Ne pas démonter l''objectif, placer l''ensemble dans la boîte orange\n\n### Checklist d''installation\n\n- [ ] Trépieds en place\n- [ ] Batteries insérées\n- [ ] Caméras fixées sur supports\n- [ ] Adaptateurs Micro HDMI branchés\n- [ ] Câbles HDMI connectés à l''ATEM\n- [ ] Caméras allumées\n- [ ] Focus réglé\n- [ ] Luminosité ajustée\n- [ ] Mode vidéo activé\n- [ ] Test de l''image sur l''ATEM',
    'lesson',
    1,
    NOW()
  ) RETURNING id INTO v_step9_id;

  -- Étape 3.2: Rangement des caméras
  INSERT INTO learning_steps (id, path_id, title, content, type, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path3_id,
    'Rangement des caméras - Fin du culte',
    E'## Procédure de rangement des caméras\n\n### Responsabilités de l''équipe caméras\n\n#### 1. Extinction des caméras\n- ✅ Éteindre toutes les caméras\n- ✅ Vérifier que les LED sont éteintes\n\n#### 2. Déconnexion\n- ✅ Débrancher l''adaptateur Micro HDMI / HDMI de chaque caméra\n- ✅ Ranger les câbles proprement\n\n#### 3. Démontage\n- ✅ Démonter les caméras des trépieds\n- ✅ Ranger les trépieds\n\n#### 4. Gestion des batteries\n- ✅ Retirer les batteries des caméras\n- ✅ Placer les batteries dans les chargeurs dédiés pour la recharge\n- ⚠️ **Important** : Toujours recharger après utilisation\n\n#### 5. Rangement du matériel\n- ✅ Placer les batteries dans les chargeurs\n- ✅ Remettre les caméras et accessoires dans leur carton d''origine\n\n### Stockage spécifique\n\n#### Caméra avec petit objectif\n- 📦 **Carton noir/orange**\n- Contenu :\n  - Caméra\n  - Petit objectif\n  - Accessoires\n\n#### Caméra avec grand objectif\n- 📦 **Carton orange UNIQUEMENT**\n- ⚠️ **TRÈS IMPORTANT** :\n  - **NE PAS démonter l''objectif**\n  - Placer l''ensemble caméra + grand objectif dans la boîte orange\n  - Raison : Éviter la poussière et les dommages\n\n### Checklist de rangement\n\n- [ ] Caméras éteintes\n- [ ] Adaptateurs HDMI débranchés\n- [ ] Caméras démontées des trépieds\n- [ ] Batteries retirées\n- [ ] Batteries en charge\n- [ ] Caméra petit objectif → Carton noir/orange\n- [ ] Caméra grand objectif → Carton orange (avec objectif monté)\n- [ ] Trépieds rangés\n- [ ] Câbles rangés\n- [ ] Zone de travail propre\n\n### Maintenance préventive\n\n✅ **Après chaque utilisation** :\n- Vérifier l''état des batteries\n- Nettoyer les objectifs si nécessaire\n- Signaler tout problème technique\n- S''assurer que tout est dans les bonnes boîtes',
    'lesson',
    2,
    NOW()
  );

  -- QCM Parcours 3
  INSERT INTO learning_steps (id, path_id, title, content, type, order_index, created_at)
  VALUES (
    gen_random_uuid(),
    v_path3_id,
    'Quiz : Gestion des caméras',
    'Validez vos connaissances sur la manipulation des caméras',
    'qcm',
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

  -- Options pour question 1
  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Aucun réglage nécessaire', false, NOW() FROM qcm_questions WHERE question = 'Quels réglages faut-il effectuer sur les caméras après les avoir allumées ?'
  UNION ALL
  SELECT id, 'Focus, luminosité et mode vidéo', true, NOW() FROM qcm_questions WHERE question = 'Quels réglages faut-il effectuer sur les caméras après les avoir allumées ?'
  UNION ALL
  SELECT id, 'Uniquement le focus', false, NOW() FROM qcm_questions WHERE question = 'Quels réglages faut-il effectuer sur les caméras après les avoir allumées ?'
  UNION ALL
  SELECT id, 'Uniquement la luminosité', false, NOW() FROM qcm_questions WHERE question = 'Quels réglages faut-il effectuer sur les caméras après les avoir allumées ?';

  -- Options pour question 2
  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Les laisser dans les caméras', false, NOW() FROM qcm_questions WHERE question = 'Que faut-il faire avec les batteries après utilisation ?'
  UNION ALL
  SELECT id, 'Les retirer et les placer dans les chargeurs pour recharge', true, NOW() FROM qcm_questions WHERE question = 'Que faut-il faire avec les batteries après utilisation ?'
  UNION ALL
  SELECT id, 'Les jeter', false, NOW() FROM qcm_questions WHERE question = 'Que faut-il faire avec les batteries après utilisation ?'
  UNION ALL
  SELECT id, 'Les ranger sans les recharger', false, NOW() FROM qcm_questions WHERE question = 'Que faut-il faire avec les batteries après utilisation ?';

  -- Options pour question 3
  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Démonter l''objectif et ranger séparément', false, NOW() FROM qcm_questions WHERE question = 'Comment ranger la caméra avec le grand objectif ?'
  UNION ALL
  SELECT id, 'Placer l''ensemble (caméra + objectif monté) dans la boîte orange', true, NOW() FROM qcm_questions WHERE question = 'Comment ranger la caméra avec le grand objectif ?'
  UNION ALL
  SELECT id, 'Laisser la caméra sur le trépied', false, NOW() FROM qcm_questions WHERE question = 'Comment ranger la caméra avec le grand objectif ?'
  UNION ALL
  SELECT id, 'Ranger dans le carton noir', false, NOW() FROM qcm_questions WHERE question = 'Comment ranger la caméra avec le grand objectif ?';

  -- Options pour question 4
  INSERT INTO qcm_options (question_id, option_text, is_correct, created_at)
  SELECT id, 'Carton orange uniquement', false, NOW() FROM qcm_questions WHERE question = 'Quel carton utiliser pour la caméra avec le petit objectif ?'
  UNION ALL
  SELECT id, 'Carton noir/orange', true, NOW() FROM qcm_questions WHERE question = 'Quel carton utiliser pour la caméra avec le petit objectif ?'
  UNION ALL
  SELECT id, 'Carton bleu', false, NOW() FROM qcm_questions WHERE question = 'Quel carton utiliser pour la caméra avec le petit objectif ?'
  UNION ALL
  SELECT id, 'Pas de carton spécifique', false, NOW() FROM qcm_questions WHERE question = 'Quel carton utiliser pour la caméra avec le petit objectif ?';

END $$;
