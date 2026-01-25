-- ============================================
-- COURS D'ANGLAIS - PARTIE 4 : VOCABULAIRE DU QUOTIDIEN
-- ============================================

DO $$
DECLARE
    v_course_id UUID;
    v_path_id UUID;
    v_step_id UUID;
    v_question_id UUID;
BEGIN
    SELECT id INTO v_course_id FROM courses WHERE title LIKE '%Anglais pour Débutants%' LIMIT 1;
    IF v_course_id IS NULL THEN RAISE EXCEPTION 'Cours non trouvé'; END IF;

    -- ============================================
    -- PARCOURS 4 : VOCABULAIRE DU QUOTIDIEN
    -- ============================================
    INSERT INTO learning_paths (course_id, title, description, order_index)
    VALUES (v_course_id, 'Vocabulaire du Quotidien', 'Les nombres, couleurs, jours de la semaine et mois de l''année.', 4)
    RETURNING id INTO v_path_id;

    -- ÉTAPE 4.1 : Les nombres
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Les nombres de 1 à 100', 'text', '{
        "body": "# 🔢 Les Nombres en Anglais\n\n## Les Nombres de 1 à 20\n\n| Nombre | Anglais | Prononciation |\n|--------|---------|---------------|\n| 1 | one | weunn |\n| 2 | two | tou |\n| 3 | three | sri |\n| 4 | four | for |\n| 5 | five | faïv |\n| 6 | six | siks |\n| 7 | seven | sèveunn |\n| 8 | eight | éït |\n| 9 | nine | naïn |\n| 10 | ten | tènn |\n| 11 | eleven | ilèveunn |\n| 12 | twelve | touèlv |\n| 13 | thirteen | seurtin |\n| 14 | fourteen | fortin |\n| 15 | fifteen | fiftin |\n| 16 | sixteen | sikstin |\n| 17 | seventeen | sèveunntin |\n| 18 | eighteen | éïtin |\n| 19 | nineteen | naïntin |\n| 20 | twenty | touènnti |\n\n---\n\n## Les Dizaines (20-100)\n\n| Nombre | Anglais | Astuce |\n|--------|---------|--------|\n| 20 | twenty | two → twen |\n| 30 | thirty | three → thir |\n| 40 | forty | ⚠️ PAS fourty ! |\n| 50 | fifty | five → fif |\n| 60 | sixty | six → six |\n| 70 | seventy | seven → seven |\n| 80 | eighty | eight → eigh |\n| 90 | ninety | nine → nine |\n| 100 | one hundred | |\n\n---\n\n## Les Nombres Composés (21-99)\n\nFormule : **dizaine + tiret + unité**\n\n| Nombre | Anglais |\n|--------|----------|\n| 21 | twenty-one |\n| 32 | thirty-two |\n| 43 | forty-three |\n| 54 | fifty-four |\n| 65 | sixty-five |\n| 76 | seventy-six |\n| 87 | eighty-seven |\n| 98 | ninety-eight |\n| 99 | ninety-nine |\n\n---\n\n## 💡 Erreurs Courantes\n\n❌ **Fourty** → ✅ **Forty** (pas de U !)\n\n❌ **Fiveteen** → ✅ **Fifteen**\n\n❌ **Ninty** → ✅ **Ninety**\n\n---\n\n## 🎯 Pour pratiquer\n\nDites à voix haute :\n- Votre numéro de téléphone\n- Votre adresse\n- Votre année de naissance\n- Les prix quand vous faites les courses"
    }'::jsonb, 1, 15);

    -- ÉTAPE 4.2 : Les couleurs
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Les couleurs', 'text', '{
        "body": "# 🎨 Les Couleurs en Anglais\n\n## Couleurs de Base\n\n| Français | Anglais | Prononciation |\n|----------|---------|---------------|\n| 🔴 Rouge | red | rèd |\n| 🔵 Bleu | blue | blou |\n| 🟢 Vert | green | grin |\n| 🟡 Jaune | yellow | yèlo |\n| 🟠 Orange | orange | orindj |\n| 🟣 Violet | purple | peurepeul |\n| 💗 Rose | pink | pink |\n| 🟤 Marron | brown | braoun |\n| ⚫ Noir | black | blak |\n| ⚪ Blanc | white | waït |\n| 🩶 Gris | grey/gray | gréï |\n\n---\n\n## Nuances\n\n### Clair et Foncé\n- **light** + couleur = clair\n- **dark** + couleur = foncé\n\n| Français | Anglais |\n|----------|----------|\n| Bleu clair | light blue |\n| Bleu foncé | dark blue |\n| Vert clair | light green |\n| Vert foncé | dark green |\n\n### Couleurs Vives\n- **bright** red = rouge vif\n- **pale** pink = rose pâle\n\n---\n\n## Position dans la Phrase\n\n⚠️ En anglais, l''adjectif de couleur vient **AVANT** le nom !\n\n| Français | Anglais |\n|----------|----------|\n| Une voiture rouge | a **red** car |\n| Un chat noir | a **black** cat |\n| Une robe bleue | a **blue** dress |\n| Des yeux verts | **green** eyes |\n\n---\n\n## 🗣️ Phrases Utiles\n\n- **What color is it?** = De quelle couleur est-ce ?\n- **It''s blue.** = C''est bleu.\n- **My favorite color is...** = Ma couleur préférée est...\n- **The sky is blue.** = Le ciel est bleu.\n- **I like the red one.** = J''aime le rouge.\n\n---\n\n## 💡 Grey vs Gray\n\n- **Grey** = orthographe britannique 🇬🇧\n- **Gray** = orthographe américaine 🇺🇸\n\nLes deux sont correctes !"
    }'::jsonb, 2, 10);

    -- ÉTAPE 4.3 : Jours et mois
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Les jours et les mois', 'text', '{
        "body": "# 📅 Les Jours et les Mois\n\n## Les 7 Jours de la Semaine\n\n| Français | Anglais | Abréviation |\n|----------|---------|-------------|\n| Lundi | Monday | Mon |\n| Mardi | Tuesday | Tue |\n| Mercredi | Wednesday | Wed |\n| Jeudi | Thursday | Thu |\n| Vendredi | Friday | Fri |\n| Samedi | Saturday | Sat |\n| Dimanche | Sunday | Sun |\n\n⚠️ Les jours prennent une **majuscule** en anglais !\n\n---\n\n## Les 12 Mois de l''Année\n\n| Français | Anglais | Abréviation |\n|----------|---------|-------------|\n| Janvier | January | Jan |\n| Février | February | Feb |\n| Mars | March | Mar |\n| Avril | April | Apr |\n| Mai | May | May |\n| Juin | June | Jun |\n| Juillet | July | Jul |\n| Août | August | Aug |\n| Septembre | September | Sep |\n| Octobre | October | Oct |\n| Novembre | November | Nov |\n| Décembre | December | Dec |\n\n⚠️ Les mois prennent aussi une **majuscule** !\n\n---\n\n## Les Prépositions de Temps\n\n### ON + jour\n- **on** Monday (lundi)\n- **on** Friday (vendredi)\n- **on** my birthday (le jour de mon anniversaire)\n\n### IN + mois / saison / année\n- **in** January (en janvier)\n- **in** summer (en été)\n- **in** 2024 (en 2024)\n- **in** the morning (le matin)\n\n### AT + heure / moment précis\n- **at** 5 o''clock (à 5 heures)\n- **at** noon (à midi)\n- **at** night (la nuit)\n- **at** the weekend (le week-end) 🇬🇧\n\n---\n\n## 🗣️ Phrases Utiles\n\n- **What day is it today?** = Quel jour sommes-nous ?\n- **Today is Monday.** = Aujourd''hui, c''est lundi.\n- **What''s the date?** = Quelle est la date ?\n- **It''s January 15th.** = C''est le 15 janvier.\n- **I was born in July.** = Je suis né(e) en juillet.\n- **See you on Friday!** = À vendredi !\n\n---\n\n## 📝 Les Dates\n\n### Format américain 🇺🇸\nMois / Jour / Année\n- January 15, 2024\n- 01/15/2024\n\n### Format britannique 🇬🇧\nJour / Mois / Année\n- 15 January 2024\n- 15/01/2024\n\n### Les ordinaux pour les dates\n- 1st (first)\n- 2nd (second)\n- 3rd (third)\n- 4th, 5th, 6th... (fourth, fifth, sixth...)"
    }'::jsonb, 3, 15);

    -- ÉTAPE 4.4 : L'heure
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Dire l''heure', 'text', '{
        "body": "# ⏰ Dire l''Heure en Anglais\n\n## Structure de Base\n\n**It''s** + [heure]\n\n## Les Heures Pile\n\n| Heure | Anglais |\n|-------|----------|\n| 1:00 | It''s one o''clock |\n| 2:00 | It''s two o''clock |\n| 12:00 | It''s twelve o''clock / noon |\n| 00:00 | It''s midnight |\n\n---\n\n## Les Minutes\n\n### Après l''heure (1-30 min) : PAST\n\n| Heure | Anglais |\n|-------|----------|\n| 3:05 | It''s five **past** three |\n| 3:10 | It''s ten **past** three |\n| 3:15 | It''s **quarter past** three |\n| 3:20 | It''s twenty **past** three |\n| 3:30 | It''s **half past** three |\n\n### Avant l''heure (31-59 min) : TO\n\n| Heure | Anglais |\n|-------|----------|\n| 3:35 | It''s twenty-five **to** four |\n| 3:40 | It''s twenty **to** four |\n| 3:45 | It''s **quarter to** four |\n| 3:50 | It''s ten **to** four |\n| 3:55 | It''s five **to** four |\n\n---\n\n## Vocabulaire Clé\n\n- **quarter** = quart (15 min)\n- **half** = demi (30 min)\n- **past** = après\n- **to** = avant\n- **o''clock** = heure pile\n\n---\n\n## Format Digital (plus simple)\n\nOn peut aussi dire directement :\n- 3:15 → three fifteen\n- 3:45 → three forty-five\n- 10:30 → ten thirty\n\n---\n\n## AM et PM\n\n- **AM** (ante meridiem) = matin (0h-12h)\n- **PM** (post meridiem) = après-midi/soir (12h-24h)\n\n| Heure | Anglais |\n|-------|----------|\n| 9h du matin | 9 AM |\n| 3h de l''après-midi | 3 PM |\n| 21h | 9 PM |\n\n---\n\n## 🗣️ Phrases Utiles\n\n- **What time is it?** = Quelle heure est-il ?\n- **What''s the time?** = Quelle heure est-il ?\n- **It''s 3 o''clock.** = Il est 3 heures.\n- **The meeting is at 2 PM.** = La réunion est à 14h.\n- **I wake up at 7 AM.** = Je me réveille à 7h."
    }'::jsonb, 4, 15);

    -- ÉTAPE 4.5 : QCM Vocabulaire
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Quiz : Vocabulaire du quotidien', 'qcm', '{
        "instructions": "Testez vos connaissances sur le vocabulaire courant",
        "passingScore": 70
    }'::jsonb, 5, 15)
    RETURNING id INTO v_step_id;

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment dit-on 15 en anglais ?', 'single', 
        'Fifteen, pas fiveteen !', 10, 1)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Fiveteen', false, 1),
        (v_question_id, 'Fifteen', true, 2),
        (v_question_id, 'Fifty', false, 3),
        (v_question_id, 'Five-ten', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment dit-on 40 en anglais ?', 'single', 
        'Forty s''écrit SANS U ! Pas fourty.', 10, 2)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Fourty', false, 1),
        (v_question_id, 'Forty', true, 2),
        (v_question_id, 'Forteen', false, 3),
        (v_question_id, 'Faurty', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment écrit-on 73 en anglais ?', 'single', 
        'Dizaine + tiret + unité : seventy-three', 10, 3)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Seventy three', false, 1),
        (v_question_id, 'Seventy-three', true, 2),
        (v_question_id, 'Seventeen-three', false, 3),
        (v_question_id, 'Seven-three', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Quel jour vient après Wednesday ?', 'single', 
        'L''ordre est : Monday, Tuesday, Wednesday, Thursday...', 10, 4)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Tuesday', false, 1),
        (v_question_id, 'Thursday', true, 2),
        (v_question_id, 'Friday', false, 3),
        (v_question_id, 'Monday', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Quelle préposition utilise-t-on avec les jours ?', 'single', 
        'ON + jour : on Monday, on Friday...', 10, 5)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'In', false, 1),
        (v_question_id, 'On', true, 2),
        (v_question_id, 'At', false, 3),
        (v_question_id, 'To', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Quelle préposition utilise-t-on avec les mois ?', 'single', 
        'IN + mois : in January, in December...', 10, 6)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'In', true, 1),
        (v_question_id, 'On', false, 2),
        (v_question_id, 'At', false, 3),
        (v_question_id, 'By', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment dit-on "une voiture rouge" ?', 'single', 
        'En anglais, l''adjectif vient AVANT le nom : a red car', 10, 7)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'A car red', false, 1),
        (v_question_id, 'A red car', true, 2),
        (v_question_id, 'Red a car', false, 3),
        (v_question_id, 'Car red a', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment dit-on 3h15 ?', 'single', 
        'Quarter past = et quart (15 minutes après)', 10, 8)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Quarter to three', false, 1),
        (v_question_id, 'Quarter past three', true, 2),
        (v_question_id, 'Half past three', false, 3),
        (v_question_id, 'Three quarter', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Quelles couleurs sont correctement orthographiées ? (plusieurs réponses)', 'multiple', 
        'Purple (violet), Yellow (jaune), et Orange sont correctement orthographiés.', 15, 9)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Purpel', false, 1),
        (v_question_id, 'Purple', true, 2),
        (v_question_id, 'Yelow', false, 3),
        (v_question_id, 'Yellow', true, 4),
        (v_question_id, 'Orenge', false, 5),
        (v_question_id, 'Orange', true, 6);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Que signifie "half past ten" ?', 'single', 
        'Half past = et demie. Half past ten = 10h30.', 10, 10)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, '10h15', false, 1),
        (v_question_id, '10h30', true, 2),
        (v_question_id, '10h45', false, 3),
        (v_question_id, '9h30', false, 4);

    -- ÉTAPE 4.6 : Exercice final
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Exercice Final : Décrivez votre journée', 'exercise', '{
        "instructions": "Rédigez un paragraphe décrivant une journée typique de votre vie.\n\nUtilisez :\n- Les jours de la semaine\n- Les heures (avec AM/PM ou past/to)\n- Les nombres\n- Les couleurs (pour décrire des objets)\n\nExemple :\nOn Monday, I wake up at 7 AM. I have breakfast at half past seven. I wear my blue shirt and black pants. I work from 9 AM to 5 PM. At 6 o''clock, I go to the gym. I have dinner at 8 PM. I read a book for thirty minutes. I go to bed at 10:30 PM.\n\nÉcrivez au minimum 8 phrases.",
        "exerciseType": "writing",
        "minWords": 60
    }'::jsonb, 6, 20);

    RAISE NOTICE '✅ Parcours 4 créé avec succès !';
    RAISE NOTICE '🎉 COURS D''ANGLAIS COMPLET !';

END $$;
