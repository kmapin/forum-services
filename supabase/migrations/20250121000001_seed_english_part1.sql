-- ============================================
-- COURS D'ANGLAIS - PARTIE 1 : INTRODUCTION & ALPHABET
-- ============================================

DO $$
DECLARE
    v_teacher_id UUID;
    v_course_id UUID;
    v_path_id UUID;
    v_step_id UUID;
    v_question_id UUID;
BEGIN
    -- Récupérer un enseignant
    SELECT id INTO v_teacher_id FROM profiles WHERE role IN ('admin', 'teacher', 'pastor') LIMIT 1;
    IF v_teacher_id IS NULL THEN
        SELECT id INTO v_teacher_id FROM profiles LIMIT 1;
    END IF;

    -- ============================================
    -- CRÉATION DU COURS
    -- ============================================
    INSERT INTO courses (title, description, category, difficulty_level, teacher_id, is_published, image_url, estimated_duration)
    VALUES (
        'Anglais pour Débutants - Niveau A1',
        'Maîtrisez les bases de l''anglais : alphabet, salutations, grammaire essentielle et vocabulaire du quotidien. Ce cours interactif vous permettra de tenir vos premières conversations en anglais.',
        'languages', 'beginner', v_teacher_id, true,
        'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', 300
    ) RETURNING id INTO v_course_id;

    -- ============================================
    -- PARCOURS 1 : INTRODUCTION ET ALPHABET
    -- ============================================
    INSERT INTO learning_paths (course_id, title, description, order_index)
    VALUES (v_course_id, 'Introduction et Alphabet', 'Découvrez l''alphabet anglais, sa prononciation et les sons fondamentaux.', 1)
    RETURNING id INTO v_path_id;

    -- ÉTAPE 1.1 : Bienvenue
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Bienvenue dans ce cours', 'text', '{
        "body": "# 🎉 Bienvenue dans votre cours d''anglais !\n\n## Pourquoi apprendre l''anglais ?\n\nL''anglais est parlé par plus de **1,5 milliard de personnes** dans le monde. C''est la langue :\n- 🌐 D''internet et des affaires internationales\n- ✈️ Du voyage et du tourisme\n- 🎬 Du cinéma et de la musique\n- 📚 De la science et de la technologie\n\n## Ce que vous allez apprendre\n\n### Module 1 : Les Bases\n- L''alphabet et la prononciation\n- Les salutations et présentations\n\n### Module 2 : Grammaire Essentielle\n- Le verbe TO BE\n- Les articles (a, an, the)\n- Les pronoms personnels\n\n### Module 3 : Vocabulaire Pratique\n- Les nombres de 1 à 100\n- Les couleurs\n- Les jours et les mois\n\n## 💡 Conseils pour réussir\n\n1. **Pratiquez chaque jour** - Même 15 minutes suffisent\n2. **Répétez à voix haute** - La prononciation s''améliore en parlant\n3. **N''ayez pas peur des erreurs** - Elles font partie de l''apprentissage\n4. **Regardez des vidéos en anglais** - Avec sous-titres au début\n\n---\n\n*Ready to start? Let''s go! 🚀*"
    }'::jsonb, 1, 5);

    -- ÉTAPE 1.2 : L'alphabet
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'L''alphabet anglais', 'text', '{
        "body": "# 🔤 L''Alphabet Anglais\n\nL''alphabet anglais comprend **26 lettres**, comme en français, mais leur prononciation est différente.\n\n## Les 26 Lettres\n\n| Lettre | Prononciation | Exemple |\n|--------|---------------|----------|\n| A | /eɪ/ (éï) | **A**pple (pomme) |\n| B | /biː/ (bi) | **B**ook (livre) |\n| C | /siː/ (si) | **C**at (chat) |\n| D | /diː/ (di) | **D**og (chien) |\n| E | /iː/ (i) | **E**gg (œuf) |\n| F | /ɛf/ (èf) | **F**ish (poisson) |\n| G | /dʒiː/ (dji) | **G**irl (fille) |\n| H | /eɪtʃ/ (éïtch) | **H**ouse (maison) |\n| I | /aɪ/ (aï) | **I**ce (glace) |\n| J | /dʒeɪ/ (djéï) | **J**uice (jus) |\n| K | /keɪ/ (kéï) | **K**ey (clé) |\n| L | /ɛl/ (èl) | **L**ion (lion) |\n| M | /ɛm/ (èm) | **M**oon (lune) |\n| N | /ɛn/ (èn) | **N**ight (nuit) |\n| O | /oʊ/ (o-ou) | **O**range |\n| P | /piː/ (pi) | **P**en (stylo) |\n| Q | /kjuː/ (kiou) | **Q**ueen (reine) |\n| R | /ɑːr/ (ar) | **R**ed (rouge) |\n| S | /ɛs/ (ès) | **S**un (soleil) |\n| T | /tiː/ (ti) | **T**ree (arbre) |\n| U | /juː/ (you) | **U**mbrella (parapluie) |\n| V | /viː/ (vi) | **V**an (camionnette) |\n| W | /ˈdʌbəljuː/ (deubeuliou) | **W**ater (eau) |\n| X | /ɛks/ (èks) | Bo**x** (boîte) |\n| Y | /waɪ/ (ouaï) | **Y**ellow (jaune) |\n| Z | /ziː/ (zi) | **Z**ebra (zèbre) |\n\n## 🎵 Les Voyelles\n\nLes 5 voyelles sont : **A, E, I, O, U**\n\n⚠️ Attention : En anglais, les voyelles ont souvent plusieurs sons différents !\n\n## 💡 Astuce\n\nÉcoutez la chanson de l''alphabet (ABC Song) pour mémoriser la prononciation !"
    }'::jsonb, 2, 10);

    -- ÉTAPE 1.3 : Vidéo alphabet
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Vidéo : La chanson de l''alphabet', 'video', '{
        "videoUrl": "https://www.youtube.com/watch?v=75p-N9YKqNo",
        "description": "Regardez cette vidéo et répétez chaque lettre à voix haute. La répétition est la clé !"
    }'::jsonb, 3, 5);

    -- ÉTAPE 1.4 : Prononciation difficile
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Les sons difficiles en anglais', 'text', '{
        "body": "# 🗣️ Les Sons Difficiles pour les Francophones\n\n## Le son TH /θ/ et /ð/\n\nC''est LE son le plus difficile ! Il n''existe pas en français.\n\n### Comment le prononcer :\n1. Placez le bout de la langue **entre les dents**\n2. Soufflez doucement\n\n### Exemples :\n- **TH**ink (penser) - /θ/ son sourd\n- **TH**is (ceci) - /ð/ son sonore\n- **TH**ank you (merci)\n- **TH**e (le, la, les)\n\n---\n\n## Le H aspiré\n\nEn anglais, le H se prononce **toujours** (sauf exceptions).\n\n### Comment le prononcer :\nFaites comme si vous souffliez sur une vitre pour faire de la buée.\n\n### Exemples :\n- **H**ello (bonjour) ≠ \"ello\"\n- **H**ouse (maison) ≠ \"ouse\"\n- **H**appy (heureux)\n- **H**elp (aide)\n\n---\n\n## Le son R /r/\n\nLe R anglais est très différent du R français.\n\n### Comment le prononcer :\n- La langue ne touche pas le palais\n- Le son vient du fond de la gorge\n- C''est un son plus \"doux\"\n\n### Exemples :\n- **R**ed (rouge)\n- **R**ight (droite/correct)\n- Ca**r** (voiture)\n\n---\n\n## Le son W /w/\n\nNe confondez pas avec le V français !\n\n### Comment le prononcer :\nArrondissez les lèvres comme pour dire \"ou\"\n\n### Exemples :\n- **W**ater (eau) ≠ \"vater\"\n- **W**hy (pourquoi)\n- **W**ork (travail)\n\n---\n\n## 🎯 Exercice\n\nRépétez 5 fois chaque mot :\n1. Think - This - That\n2. Hello - Happy - House\n3. Red - Right - Wrong\n4. Water - Why - What"
    }'::jsonb, 4, 15);

    -- ÉTAPE 1.5 : QCM Alphabet
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Quiz : L''alphabet anglais', 'qcm', '{
        "instructions": "Testez vos connaissances sur l''alphabet anglais",
        "passingScore": 70
    }'::jsonb, 5, 10)
    RETURNING id INTO v_step_id;

    -- Questions du QCM
    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Combien de lettres y a-t-il dans l''alphabet anglais ?', 'single', 
        'L''alphabet anglais contient exactement 26 lettres, comme l''alphabet français.', 10, 1)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, '24 lettres', false, 1),
        (v_question_id, '26 lettres', true, 2),
        (v_question_id, '28 lettres', false, 3),
        (v_question_id, '25 lettres', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment prononce-t-on la lettre W en anglais ?', 'single', 
        'W se prononce "double-you" (deubeuliou), pas "double-vé" comme en français.', 10, 2)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Double-vé', false, 1),
        (v_question_id, 'Double-you', true, 2),
        (v_question_id, 'Wé', false, 3),
        (v_question_id, 'Vé', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Quelle lettre vient après M dans l''alphabet ?', 'single', 
        'L''ordre est : K, L, M, N, O, P...', 10, 3)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'L', false, 1),
        (v_question_id, 'N', true, 2),
        (v_question_id, 'O', false, 3),
        (v_question_id, 'P', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Quelles sont les voyelles en anglais ? (plusieurs réponses)', 'multiple', 
        'Les 5 voyelles anglaises sont A, E, I, O, U - comme en français !', 15, 4)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'A', true, 1),
        (v_question_id, 'B', false, 2),
        (v_question_id, 'E', true, 3),
        (v_question_id, 'I', true, 4),
        (v_question_id, 'O', true, 5),
        (v_question_id, 'U', true, 6),
        (v_question_id, 'Y', false, 7);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Pour prononcer le son TH, où doit-on placer la langue ?', 'single', 
        'Le son TH se prononce en plaçant le bout de la langue entre les dents supérieures et inférieures.', 10, 5)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Contre le palais', false, 1),
        (v_question_id, 'Entre les dents', true, 2),
        (v_question_id, 'Derrière les dents du bas', false, 3),
        (v_question_id, 'Au fond de la bouche', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Le H se prononce-t-il en anglais dans le mot "Hello" ?', 'single', 
        'En anglais, le H est presque toujours prononcé (aspiré). On dit "Hello" et non "Ello".', 10, 6)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Oui, toujours', true, 1),
        (v_question_id, 'Non, jamais', false, 2),
        (v_question_id, 'Parfois', false, 3);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment prononce-t-on la lettre I en anglais ?', 'single', 
        'La lettre I se prononce /aɪ/ comme "aï" en français.', 10, 7)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'i (comme en français)', false, 1),
        (v_question_id, 'aï', true, 2),
        (v_question_id, 'é', false, 3),
        (v_question_id, 'ou', false, 4);

    -- ÉTAPE 1.6 : Exercice épellation
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Exercice : Épelez votre prénom', 'exercise', '{
        "instructions": "Épelez votre prénom en anglais, lettre par lettre.\n\nExemple : MARIE → M-A-R-I-E (èm-éï-ar-aï-i)\n\n1. Écrivez votre prénom\n2. Écrivez la prononciation de chaque lettre entre parenthèses\n\nBonus : Épelez aussi votre nom de famille !",
        "exerciseType": "writing",
        "minWords": 5
    }'::jsonb, 6, 10);

    RAISE NOTICE '✅ Parcours 1 créé avec succès !';
    RAISE NOTICE 'Course ID: %', v_course_id;

END $$;
