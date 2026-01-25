-- ============================================
-- COURS D'ANGLAIS - PARTIE 2 : SALUTATIONS & PRÉSENTATIONS
-- ============================================

DO $$
DECLARE
    v_course_id UUID;
    v_path_id UUID;
    v_step_id UUID;
    v_question_id UUID;
BEGIN
    -- Récupérer le cours créé
    SELECT id INTO v_course_id FROM courses WHERE title LIKE '%Anglais pour Débutants%' LIMIT 1;
    IF v_course_id IS NULL THEN RAISE EXCEPTION 'Cours non trouvé'; END IF;

    -- ============================================
    -- PARCOURS 2 : SALUTATIONS ET PRÉSENTATIONS
    -- ============================================
    INSERT INTO learning_paths (course_id, title, description, order_index)
    VALUES (v_course_id, 'Salutations et Présentations', 'Apprenez à saluer, vous présenter et engager une conversation simple.', 2)
    RETURNING id INTO v_path_id;

    -- ÉTAPE 2.1 : Les salutations
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Les salutations en anglais', 'text', '{
        "body": "# 👋 Les Salutations en Anglais\n\n## Salutations Formelles\n\nUtilisez-les dans un contexte professionnel ou avec des inconnus.\n\n| Anglais | Français | Quand l''utiliser |\n|---------|----------|-------------------|\n| Good morning | Bonjour | Matin (jusqu''à 12h) |\n| Good afternoon | Bonjour | Après-midi (12h-18h) |\n| Good evening | Bonsoir | Soir (après 18h) |\n| Good night | Bonne nuit | Pour dire au revoir le soir |\n\n### Exemples :\n- *Good morning, Mr. Smith.* (Bonjour, M. Smith.)\n- *Good afternoon, how are you?* (Bonjour, comment allez-vous ?)\n\n---\n\n## Salutations Informelles\n\nAvec des amis, la famille, des collègues proches.\n\n| Anglais | Français | Niveau |\n|---------|----------|--------|\n| Hello | Bonjour/Salut | Neutre |\n| Hi | Salut | Informel |\n| Hey | Salut/Hé | Très informel |\n| What''s up? | Quoi de neuf ? | Familier |\n| How''s it going? | Comment ça va ? | Familier |\n\n---\n\n## Dire Au Revoir\n\n| Anglais | Français |\n|---------|----------|\n| Goodbye | Au revoir |\n| Bye | Salut |\n| See you | À plus |\n| See you later | À plus tard |\n| See you soon | À bientôt |\n| See you tomorrow | À demain |\n| Take care | Prends soin de toi |\n| Have a nice day | Bonne journée |\n\n---\n\n## 💡 Astuce Culturelle\n\nLes Anglo-saxons demandent souvent \"How are you?\" comme simple salutation. La réponse attendue est courte :\n- *I''m fine, thank you. And you?*\n- *Good, thanks!*\n- *Not bad, you?*\n\nCe n''est pas une vraie question sur votre santé !"
    }'::jsonb, 1, 10);

    -- ÉTAPE 2.2 : Se présenter
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Se présenter en anglais', 'text', '{
        "body": "# 🙋 Se Présenter en Anglais\n\n## Dire son nom\n\n### Formel :\n- **My name is** Marie. (Mon nom est Marie.)\n- **I am** Marie Dupont. (Je suis Marie Dupont.)\n\n### Informel :\n- **I''m** Marie. (Je suis Marie.)\n- Hi, **I''m** Marie! (Salut, je suis Marie !)\n\n### Demander le nom :\n- **What''s your name?** (Comment vous appelez-vous ?)\n- **What is your name?** (Formel)\n- **And you?** (Et vous/toi ?)\n\n---\n\n## Dire d''où l''on vient\n\n### Structure :\n**I''m from** + [pays/ville]\n\n### Exemples :\n- I''m from **France**. (Je viens de France.)\n- I''m from **Paris**. (Je viens de Paris.)\n- I''m **French**. (Je suis français(e).)\n\n### Demander :\n- **Where are you from?** (D''où venez-vous ?)\n- **Where do you come from?** (D''où venez-vous ?)\n\n---\n\n## Dire son âge\n\n### Structure :\n**I am** + [nombre] + **years old**\n\n### Exemples :\n- I am **25 years old**. (J''ai 25 ans.)\n- I''m **thirty**. (J''ai 30 ans.)\n\n### Demander :\n- **How old are you?** (Quel âge avez-vous ?)\n\n⚠️ Note : En anglais on dit \"Je suis 25 ans\" et non \"J''ai 25 ans\" !\n\n---\n\n## Parler de son travail/études\n\n### Structure :\n**I am a** + [profession]\n**I work as a** + [profession]\n**I study** + [matière]\n\n### Exemples :\n- I''m a **teacher**. (Je suis professeur.)\n- I''m a **student**. (Je suis étudiant(e).)\n- I work as a **doctor**. (Je travaille comme médecin.)\n- I study **English**. (J''étudie l''anglais.)\n\n### Demander :\n- **What do you do?** (Que faites-vous dans la vie ?)\n- **What''s your job?** (Quel est votre métier ?)\n\n---\n\n## 📝 Exemple de présentation complète\n\n*Hello! My name is Marie Dupont. I''m from Paris, France. I''m 28 years old. I''m a nurse and I work at a hospital. Nice to meet you!*\n\n(Bonjour ! Je m''appelle Marie Dupont. Je viens de Paris, en France. J''ai 28 ans. Je suis infirmière et je travaille dans un hôpital. Enchanté(e) !)"
    }'::jsonb, 2, 15);

    -- ÉTAPE 2.3 : Dialogue
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Dialogue : Première rencontre', 'text', '{
        "body": "# 🗣️ Dialogue : Première Rencontre\n\nÉtudiez ce dialogue typique d''une première rencontre.\n\n---\n\n## La Scène\n*Marie rencontre John lors d''une conférence*\n\n---\n\n**John:** Hello! My name is John. What''s your name?\n\n**Marie:** Hi John! I''m Marie. Nice to meet you!\n\n**John:** Nice to meet you too, Marie. Where are you from?\n\n**Marie:** I''m from France, from Paris. And you?\n\n**John:** I''m from London, England. What do you do?\n\n**Marie:** I''m a teacher. I teach French. And you, what''s your job?\n\n**John:** I''m a software engineer. I work for a tech company.\n\n**Marie:** That''s interesting! How old are you, if I may ask?\n\n**John:** I''m 32 years old. And you?\n\n**Marie:** I''m 29. Well, it was nice meeting you, John!\n\n**John:** You too, Marie! See you later!\n\n**Marie:** Bye! Have a nice day!\n\n---\n\n## 📖 Traduction\n\n**John:** Bonjour ! Je m''appelle John. Comment vous appelez-vous ?\n\n**Marie:** Salut John ! Je suis Marie. Enchantée !\n\n**John:** Enchanté aussi, Marie. D''où venez-vous ?\n\n**Marie:** Je viens de France, de Paris. Et vous ?\n\n**John:** Je viens de Londres, en Angleterre. Que faites-vous ?\n\n**Marie:** Je suis professeur. J''enseigne le français. Et vous, quel est votre métier ?\n\n**John:** Je suis ingénieur logiciel. Je travaille pour une entreprise tech.\n\n**Marie:** C''est intéressant ! Quel âge avez-vous, si je puis me permettre ?\n\n**John:** J''ai 32 ans. Et vous ?\n\n**Marie:** J''ai 29 ans. Bon, c''était un plaisir de vous rencontrer, John !\n\n**John:** Vous aussi, Marie ! À plus tard !\n\n**Marie:** Au revoir ! Bonne journée !\n\n---\n\n## 🎯 Expressions Clés\n\n- **Nice to meet you!** = Enchanté(e) !\n- **Nice to meet you too!** = Enchanté(e) également !\n- **If I may ask** = Si je puis me permettre\n- **It was nice meeting you** = C''était un plaisir de vous rencontrer"
    }'::jsonb, 3, 10);

    -- ÉTAPE 2.4 : QCM Salutations
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Quiz : Salutations et présentations', 'qcm', '{
        "instructions": "Testez vos connaissances sur les salutations et présentations",
        "passingScore": 70
    }'::jsonb, 4, 10)
    RETURNING id INTO v_step_id;

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment dit-on "Bonjour" le matin en anglais formel ?', 'single', 
        'Good morning s''utilise le matin jusqu''à midi.', 10, 1)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Good night', false, 1),
        (v_question_id, 'Good morning', true, 2),
        (v_question_id, 'Good evening', false, 3),
        (v_question_id, 'Good afternoon', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Quelle est la meilleure réponse à "How are you?" ?', 'single', 
        '"I''m fine, thank you" est la réponse standard et polie.', 10, 2)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'My name is Marie', false, 1),
        (v_question_id, 'I''m fine, thank you', true, 2),
        (v_question_id, 'I''m from France', false, 3),
        (v_question_id, 'Yes, I am', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment demander l''âge de quelqu''un ?', 'single', 
        '"How old are you?" est la façon correcte de demander l''âge.', 10, 3)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'What is your age?', false, 1),
        (v_question_id, 'How many years you have?', false, 2),
        (v_question_id, 'How old are you?', true, 3),
        (v_question_id, 'What years are you?', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment dire "J''ai 25 ans" en anglais ?', 'single', 
        'En anglais on utilise le verbe "être" (to be) et non "avoir" pour l''âge.', 10, 4)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'I have 25 years', false, 1),
        (v_question_id, 'I am 25 years old', true, 2),
        (v_question_id, 'I have 25 years old', false, 3),
        (v_question_id, 'I am 25 years', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Que signifie "Nice to meet you" ?', 'single', 
        '"Nice to meet you" signifie "Enchanté(e)" ou "Ravi(e) de vous rencontrer".', 10, 5)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Au revoir', false, 1),
        (v_question_id, 'Comment allez-vous ?', false, 2),
        (v_question_id, 'Enchanté(e)', true, 3),
        (v_question_id, 'Bonne journée', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment demander à quelqu''un d''où il vient ?', 'single', 
        '"Where are you from?" est la façon standard de demander l''origine.', 10, 6)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Where do you live?', false, 1),
        (v_question_id, 'Where are you from?', true, 2),
        (v_question_id, 'Where you come?', false, 3),
        (v_question_id, 'From where you are?', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Quelles expressions signifient "Au revoir" ? (plusieurs réponses)', 'multiple', 
        'Goodbye, Bye, See you later et Take care sont toutes des façons de dire au revoir.', 15, 7)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'Goodbye', true, 1),
        (v_question_id, 'Hello', false, 2),
        (v_question_id, 'See you later', true, 3),
        (v_question_id, 'How are you', false, 4),
        (v_question_id, 'Take care', true, 5),
        (v_question_id, 'Bye', true, 6);

    -- ÉTAPE 2.5 : Exercice présentation
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Exercice : Présentez-vous', 'exercise', '{
        "instructions": "Rédigez votre présentation personnelle en anglais.\n\nIncluez les informations suivantes :\n1. Votre nom\n2. D''où vous venez\n3. Votre âge\n4. Votre métier ou études\n5. Un hobby ou intérêt\n\nExemple :\nHello! My name is Pierre Martin. I''m from Lyon, France. I''m 35 years old. I''m a doctor and I work at a hospital. I like playing tennis and reading books. Nice to meet you!\n\nÉcrivez au minimum 5 phrases.",
        "exerciseType": "writing",
        "minWords": 40
    }'::jsonb, 5, 15);

    RAISE NOTICE '✅ Parcours 2 créé avec succès !';

END $$;
