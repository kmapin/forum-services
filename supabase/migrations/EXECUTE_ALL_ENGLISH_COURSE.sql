-- ============================================
-- EXÉCUTER TOUTES LES MIGRATIONS DU COURS D'ANGLAIS
-- Copiez et collez ce fichier dans le SQL Editor de Supabase
-- ============================================

-- ÉTAPE 1 : Créer le cours de base
DO $$
DECLARE
    v_teacher_id UUID;
    v_course_id UUID;
BEGIN
    SELECT id INTO v_teacher_id FROM profiles WHERE role = 'teacher' LIMIT 1;
    
    IF v_teacher_id IS NULL THEN
        SELECT id INTO v_teacher_id FROM profiles WHERE role = 'admin' LIMIT 1;
    END IF;
    
    IF v_teacher_id IS NULL THEN
        SELECT id INTO v_teacher_id FROM profiles LIMIT 1;
    END IF;
    
    IF v_teacher_id IS NULL THEN
        RAISE EXCEPTION 'Aucun utilisateur trouvé pour créer le cours';
    END IF;

    SELECT id INTO v_course_id FROM courses WHERE title LIKE '%Anglais pour Débutants%' LIMIT 1;
    
    IF v_course_id IS NOT NULL THEN
        RAISE NOTICE 'Le cours existe déjà avec ID: %', v_course_id;
        RETURN;
    END IF;

    INSERT INTO courses (
        title,
        description,
        category,
        difficulty_level,
        teacher_id,
        image_url,
        estimated_duration,
        is_published
    ) VALUES (
        'Anglais pour Débutants - Niveau A1',
        'Cours complet d''anglais pour débutants. Apprenez les bases de la langue anglaise : alphabet, prononciation, salutations, grammaire fondamentale et vocabulaire essentiel du quotidien. Ce cours vous permettra de communiquer dans des situations simples de la vie courante.',
        'langues',
        'beginner',
        v_teacher_id,
        'https://images.unsplash.com/photo-1543109740-4bdb38fda756?w=800',
        480,
        true
    );

    RAISE NOTICE '✅ Cours créé avec succès !';

END $$;
