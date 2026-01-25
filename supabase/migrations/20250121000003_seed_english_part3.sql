-- ============================================
-- COURS D'ANGLAIS - PARTIE 3 : GRAMMAIRE DE BASE
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
    -- PARCOURS 3 : GRAMMAIRE DE BASE
    -- ============================================
    INSERT INTO learning_paths (course_id, title, description, order_index)
    VALUES (v_course_id, 'Grammaire de Base', 'Maîtrisez le verbe TO BE, les articles et les pronoms personnels.', 3)
    RETURNING id INTO v_path_id;

    -- ÉTAPE 3.1 : Le verbe TO BE
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Le verbe TO BE (être)', 'text', '{
        "body": "# 🔵 Le Verbe TO BE\n\nLe verbe **TO BE** (être) est le verbe le plus important en anglais !\n\n## Conjugaison au Présent\n\n| Sujet | Forme complète | Forme contractée |\n|-------|---------------|------------------|\n| I | I am | I''m |\n| You | You are | You''re |\n| He | He is | He''s |\n| She | She is | She''s |\n| It | It is | It''s |\n| We | We are | We''re |\n| They | They are | They''re |\n\n## Exemples\n\n✅ **I am** a student. → **I''m** a student. (Je suis étudiant.)\n\n✅ **She is** happy. → **She''s** happy. (Elle est heureuse.)\n\n✅ **We are** French. → **We''re** French. (Nous sommes français.)\n\n---\n\n## Forme Négative\n\n| Affirmatif | Négatif complet | Négatif contracté |\n|------------|----------------|-------------------|\n| I am | I am not | I''m not |\n| You are | You are not | You aren''t / You''re not |\n| He is | He is not | He isn''t / He''s not |\n| She is | She is not | She isn''t / She''s not |\n| It is | It is not | It isn''t / It''s not |\n| We are | We are not | We aren''t / We''re not |\n| They are | They are not | They aren''t / They''re not |\n\n## Exemples négatifs\n\n❌ I''m **not** tired. (Je ne suis pas fatigué.)\n\n❌ She **isn''t** at home. (Elle n''est pas à la maison.)\n\n❌ They **aren''t** students. (Ils ne sont pas étudiants.)\n\n---\n\n## Forme Interrogative\n\nOn inverse le sujet et le verbe :\n\n| Affirmatif | Interrogatif |\n|------------|-------------|\n| You are happy. | **Are** you happy? |\n| She is French. | **Is** she French? |\n| They are here. | **Are** they here? |\n\n## Réponses courtes\n\n- **Are you tired?** → Yes, I am. / No, I''m not.\n- **Is he a doctor?** → Yes, he is. / No, he isn''t.\n- **Are they at home?** → Yes, they are. / No, they aren''t.\n\n---\n\n## 🎯 Utilisations de TO BE\n\n1. **Identité** : I am Marie.\n2. **Nationalité** : She is French.\n3. **Profession** : He is a doctor.\n4. **Âge** : I am 25 years old.\n5. **État** : We are happy/tired/hungry.\n6. **Lieu** : They are at school."
    }'::jsonb, 1, 15);

    -- ÉTAPE 3.2 : Les articles
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Les articles A, AN, THE', 'text', '{
        "body": "# 📝 Les Articles en Anglais\n\n## Articles Indéfinis : A et AN\n\nUtilisés devant un nom **singulier** et **non spécifique**.\n\n### A → devant une **consonne**\n\n- **a** book (un livre)\n- **a** car (une voiture)\n- **a** dog (un chien)\n- **a** house (une maison)\n- **a** student (un étudiant)\n\n### AN → devant une **voyelle** (A, E, I, O, U)\n\n- **an** apple (une pomme)\n- **an** egg (un œuf)\n- **an** idea (une idée)\n- **an** orange (une orange)\n- **an** umbrella (un parapluie)\n\n---\n\n## ⚠️ Exceptions Importantes !\n\nC''est le **son** qui compte, pas la lettre !\n\n### A devant un son consonne :\n- **a** university (le U se prononce \"you\")\n- **a** European (le E se prononce \"you\")\n- **a** one-way street (le O se prononce \"w\")\n\n### AN devant un son voyelle :\n- **an** hour (le H est muet → son \"a\")\n- **an** honest person (le H est muet)\n- **an** MBA (le M se prononce \"em\")\n\n---\n\n## Article Défini : THE\n\nUtilisé quand on parle de quelque chose de **spécifique**.\n\n### Quand utiliser THE :\n\n1. **Chose unique** :\n   - **The** sun (le soleil)\n   - **The** moon (la lune)\n   - **The** Earth (la Terre)\n\n2. **Déjà mentionné** :\n   - I have a cat. **The** cat is black.\n   - (J''ai un chat. Le chat est noir.)\n\n3. **Spécifique/identifié** :\n   - **The** book on the table (le livre sur la table)\n   - **The** woman in red (la femme en rouge)\n\n4. **Superlatifs** :\n   - **The** best (le meilleur)\n   - **The** most beautiful (le plus beau)\n\n---\n\n## Pas d''article (article zéro)\n\n❌ On n''utilise PAS d''article devant :\n\n- **Noms au pluriel général** : I like cats. (J''aime les chats.)\n- **Noms indénombrables** : I drink water. (Je bois de l''eau.)\n- **Pays** (généralement) : I live in France.\n- **Langues** : I speak English.\n- **Repas** : I have breakfast at 8.\n\n---\n\n## 📊 Résumé\n\n| Article | Usage | Exemple |\n|---------|-------|----------|\n| A | Consonne + singulier | a book |\n| AN | Voyelle + singulier | an apple |\n| THE | Spécifique | the book on the table |\n| Ø (rien) | Général/pluriel | I like dogs |"
    }'::jsonb, 2, 15);

    -- ÉTAPE 3.3 : Pronoms personnels
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Les pronoms personnels', 'text', '{
        "body": "# 👤 Les Pronoms Personnels\n\n## Pronoms Sujets\n\nRemplacent le sujet de la phrase.\n\n| Anglais | Français | Exemple |\n|---------|----------|----------|\n| I | Je | **I** am happy. |\n| You | Tu/Vous | **You** are nice. |\n| He | Il | **He** is tall. |\n| She | Elle | **She** is beautiful. |\n| It | Il/Elle (objet/animal) | **It** is a cat. |\n| We | Nous | **We** are friends. |\n| They | Ils/Elles | **They** are students. |\n\n⚠️ **I** prend toujours une majuscule !\n\n---\n\n## Pronoms Compléments\n\nRemplacent le complément d''objet.\n\n| Sujet | Complément | Exemple |\n|-------|-----------|----------|\n| I | me | She loves **me**. (Elle m''aime.) |\n| You | you | I see **you**. (Je te/vous vois.) |\n| He | him | Call **him**. (Appelle-le.) |\n| She | her | Help **her**. (Aide-la.) |\n| It | it | Take **it**. (Prends-le.) |\n| We | us | Join **us**. (Rejoins-nous.) |\n| They | them | Meet **them**. (Rencontre-les.) |\n\n---\n\n## Adjectifs Possessifs\n\nIndiquent à qui appartient quelque chose.\n\n| Pronom | Possessif | Exemple |\n|--------|----------|----------|\n| I | my | **My** book (mon livre) |\n| You | your | **Your** car (ta/votre voiture) |\n| He | his | **His** house (sa maison) |\n| She | her | **Her** phone (son téléphone) |\n| It | its | **Its** color (sa couleur) |\n| We | our | **Our** family (notre famille) |\n| They | their | **Their** dog (leur chien) |\n\n---\n\n## Pronoms Possessifs\n\nRemplacent \"le mien\", \"le tien\", etc.\n\n| Adjectif | Pronom | Exemple |\n|----------|--------|----------|\n| my | mine | This is **mine**. (C''est le mien.) |\n| your | yours | It''s **yours**. (C''est le tien.) |\n| his | his | That''s **his**. (C''est le sien.) |\n| her | hers | This is **hers**. (C''est le sien.) |\n| our | ours | It''s **ours**. (C''est le nôtre.) |\n| their | theirs | That''s **theirs**. (C''est le leur.) |\n\n---\n\n## 💡 Astuce : HE vs SHE vs IT\n\n- **He** → hommes, garçons\n- **She** → femmes, filles\n- **It** → objets, animaux (sauf animaux de compagnie qu''on connaît bien)\n\n## 💡 Astuce : HIS vs HER\n\n- **His** → possession d''un homme\n- **Her** → possession d''une femme\n\n*John loves **his** mother.* (John aime **sa** mère.)\n*Marie loves **her** mother.* (Marie aime **sa** mère.)"
    }'::jsonb, 3, 15);

    -- ÉTAPE 3.4 : QCM Grammaire
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Quiz : Grammaire de base', 'qcm', '{
        "instructions": "Testez vos connaissances grammaticales",
        "passingScore": 70
    }'::jsonb, 4, 15)
    RETURNING id INTO v_step_id;

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Complétez : "She ___ a teacher."', 'single', 
        'Avec He/She/It, on utilise IS.', 10, 1)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'am', false, 1),
        (v_question_id, 'is', true, 2),
        (v_question_id, 'are', false, 3),
        (v_question_id, 'be', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Complétez : "We ___ happy."', 'single', 
        'Avec We/You/They, on utilise ARE.', 10, 2)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'am', false, 1),
        (v_question_id, 'is', false, 2),
        (v_question_id, 'are', true, 3),
        (v_question_id, 'be', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Quel article utilise-t-on devant "apple" ?', 'single', 
        'On utilise AN devant un mot commençant par une voyelle.', 10, 3)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'a', false, 1),
        (v_question_id, 'an', true, 2),
        (v_question_id, 'the', false, 3),
        (v_question_id, 'pas d''article', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Quel article utilise-t-on devant "university" ?', 'single', 
        'On utilise A car university commence par le son "you" (consonne).', 10, 4)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'a', true, 1),
        (v_question_id, 'an', false, 2),
        (v_question_id, 'the', false, 3);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment dit-on "notre maison" ?', 'single', 
        'OUR est l''adjectif possessif pour WE.', 10, 5)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'we house', false, 1),
        (v_question_id, 'our house', true, 2),
        (v_question_id, 'us house', false, 3),
        (v_question_id, 'ours house', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Quelle est la forme négative de "I am happy" ?', 'single', 
        'La forme négative est I am not ou I''m not.', 10, 6)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'I no am happy', false, 1),
        (v_question_id, 'I am not happy', true, 2),
        (v_question_id, 'I amn''t happy', false, 3),
        (v_question_id, 'I not am happy', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Complétez : "Marie loves ___ mother." (la mère de Marie)', 'single', 
        'HER car Marie est une femme.', 10, 7)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'his', false, 1),
        (v_question_id, 'her', true, 2),
        (v_question_id, 'their', false, 3),
        (v_question_id, 'its', false, 4);

    INSERT INTO qcm_questions (step_id, question, question_type, explanation, points, order_index)
    VALUES (v_step_id, 'Comment forme-t-on une question avec TO BE ?', 'single', 
        'On inverse le sujet et le verbe : You are → Are you?', 10, 8)
    RETURNING id INTO v_question_id;
    INSERT INTO qcm_options (question_id, option_text, is_correct, order_index) VALUES
        (v_question_id, 'On ajoute DO', false, 1),
        (v_question_id, 'On inverse le sujet et le verbe', true, 2),
        (v_question_id, 'On ajoute un point d''interrogation seulement', false, 3),
        (v_question_id, 'On utilise WHAT', false, 4);

    -- ÉTAPE 3.5 : Exercice grammaire
    INSERT INTO learning_steps (path_id, title, step_type, content, order_index, estimated_duration)
    VALUES (v_path_id, 'Exercice : Complétez les phrases', 'exercise', '{
        "instructions": "Complétez les phrases suivantes avec la bonne forme du verbe TO BE et les bons articles/pronoms.\n\n1. I ___ a student. (am/is/are)\n2. She ___ from England. (am/is/are)\n3. They ___ not at home. (am/is/are)\n4. ___ you happy? (Am/Is/Are)\n5. I have ___ apple and ___ banana. (a/an)\n6. This is ___ book. (my/I)\n7. He loves ___ sister. (his/her)\n8. We are in ___ classroom. (we/our)\n\nÉcrivez vos réponses en numérotant chaque phrase.",
        "exerciseType": "writing",
        "minWords": 20
    }'::jsonb, 5, 15);

    RAISE NOTICE '✅ Parcours 3 créé avec succès !';

END $$;
