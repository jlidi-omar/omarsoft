-- ================================================================
-- OMARSOFT — Supprime TOUS les exemples créés par catalogue-exemples.sql
--
-- Supabase > SQL Editor > New query > coller > Run
--
-- Ne supprime que les lignes encore marquées « EXEMPLE » : un produit dont vous
-- avez modifié la description, ou une image dont vous avez changé le titre,
-- est conservé. Vos vrais produits ne sont jamais touchés.
-- Ensuite, vous pouvez aussi supprimer le dossier public/examples/ du projet.
-- ================================================================
DELETE FROM products      WHERE description_fr LIKE 'EXEMPLE%';
DELETE FROM media_content WHERE title_fr       LIKE 'Exemple%';
