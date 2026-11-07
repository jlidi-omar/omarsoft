-- ================================================================
-- OMARSOFT — EXEMPLES de catalogue et de galerie (à remplacer plus tard)
--
-- Supabase > SQL Editor > New query > coller ce fichier > Run
-- Peut être exécuté plusieurs fois : aucun doublon n'est créé.
--
-- ⚠️  Les noms, caractéristiques, PRIX et STOCKS ci-dessous sont des EXEMPLES
--     inventés. Ne les laissez pas en ligne tels quels : modifiez-les dans
--     Admin > Produits et Admin > Galerie, ou supprimez-les tous avec
--     supprimer-exemples.sql.
--
-- Prérequis : le dossier public/examples/ du projet doit être envoyé sur GitHub
-- (les images s'y trouvent), puis le site redéployé.
-- ================================================================

-- ────────────────────────────────────────────────
-- CATALOGUE : 8 produits d'exemple
-- ────────────────────────────────────────────────
INSERT INTO products (name_fr, name_ar, name_en, description_fr, description_ar, description_en,
                      price_tnd, category, image_url, stock_quantity, is_visible)
SELECT * FROM (VALUES
  ('Ordinateur portable 15,6″', 'حاسوب محمول 15.6 بوصة', '15.6″ Laptop',
   'EXEMPLE – à modifier. Processeur Core i5, 8 Go de RAM, SSD 512 Go.', 'مثال – للتعديل. معالج Core i5، ذاكرة 8 غ.ب، قرص SSD سعة 512 غ.ب.', 'EXAMPLE – edit me. Core i5 processor, 8 GB RAM, 512 GB SSD.',
   1900.00::numeric, 'ordinateurs', '/examples/products/laptop.png', 3, true),
  ('Ordinateur de bureau complet', 'حاسوب مكتبي كامل', 'Complete desktop computer',
   'EXEMPLE – à modifier. Unité centrale Core i3, 8 Go de RAM, SSD 256 Go, écran inclus.', 'مثال – للتعديل. وحدة مركزية Core i3، ذاكرة 8 غ.ب، قرص SSD سعة 256 غ.ب، شاشة مرفقة.', 'EXAMPLE – edit me. Core i3 tower, 8 GB RAM, 256 GB SSD, monitor included.',
   1400.00, 'ordinateurs', '/examples/products/desktop.png', 2, true),
  ('Routeur Wi-Fi double bande', 'راوتر واي فاي ثنائي النطاق', 'Dual-band Wi-Fi router',
   'EXEMPLE – à modifier. Wi-Fi double bande, 4 ports réseau.', 'مثال – للتعديل. واي فاي ثنائي النطاق، 4 منافذ شبكة.', 'EXAMPLE – edit me. Dual-band Wi-Fi, 4 network ports.',
   120.00, 'reseaux', '/examples/products/router.png', 8, true),
  ('Switch Gigabit 8 ports', 'سويتش جيجابت 8 منافذ', '8-port Gigabit switch',
   'EXEMPLE – à modifier. 8 ports Gigabit, boîtier métal.', 'مثال – للتعديل. 8 منافذ جيجابت، هيكل معدني.', 'EXAMPLE – edit me. 8 Gigabit ports, metal case.',
   90.00, 'reseaux', '/examples/products/switch.png', 6, true),
  ('Imprimante multifonction', 'طابعة متعددة الوظائف', 'Multifunction printer',
   'EXEMPLE – à modifier. Impression, copie et numérisation.', 'مثال – للتعديل. طباعة ونسخ ومسح ضوئي.', 'EXAMPLE – edit me. Print, copy and scan.',
   350.00, 'imprimantes', '/examples/products/printer.png', 4, true),
  ('Caméra IP PoE 2 MP', 'كاميرا مراقبة IP بدقة 2 ميغابيكسل', '2 MP PoE IP camera',
   'EXEMPLE – à modifier. Caméra de surveillance IP, alimentation PoE.', 'مثال – للتعديل. كاميرا مراقبة IP بتغذية PoE.', 'EXAMPLE – edit me. IP surveillance camera, PoE powered.',
   140.00, 'surveillance', '/examples/products/camera.png', 10, true),
  ('Disque SSD 512 Go', 'قرص SSD سعة 512 غ.ب', '512 GB SSD',
   'EXEMPLE – à modifier. Disque SSD 512 Go pour ordinateur.', 'مثال – للتعديل. قرص SSD سعة 512 غ.ب للحاسوب.', 'EXAMPLE – edit me. 512 GB SSD for computers.',
   150.00, 'composants', '/examples/products/ssd.png', 12, true),
  ('Pack clavier et souris sans fil', 'حزمة لوحة مفاتيح وفأرة لاسلكية', 'Wireless keyboard and mouse pack',
   'EXEMPLE – à modifier. Clavier et souris sans fil.', 'مثال – للتعديل. لوحة مفاتيح وفأرة لاسلكية.', 'EXAMPLE – edit me. Wireless keyboard and mouse.',
   55.00, 'accessoires', '/examples/products/keyboard-mouse.png', 20, true)
) AS v(name_fr, name_ar, name_en, description_fr, description_ar, description_en,
       price_tnd, category, image_url, stock_quantity, is_visible)
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.name_fr = v.name_fr);

-- ────────────────────────────────────────────────
-- GALERIE ET RÉALISATIONS : 6 images d'exemple (illustrations, pas de vrais chantiers)
-- ────────────────────────────────────────────────
INSERT INTO media_content (title_fr, title_ar, title_en, description_fr, file_url, file_type, category, sort_order, is_visible)
SELECT * FROM (VALUES
  ('Exemple – Installation réseau Wi-Fi', 'مثال – تركيب شبكة واي فاي', 'Example – Wi-Fi network installation',
   'EXEMPLE – remplacez cette illustration par une vraie photo de vos réalisations.', '/examples/gallery/wifi.png', 'image', 'realisation', 1, true),
  ('Exemple – Système de vidéosurveillance', 'مثال – نظام مراقبة بالفيديو', 'Example – Video surveillance system',
   'EXEMPLE – remplacez cette illustration par une vraie photo de vos réalisations.', '/examples/gallery/surveillance.png', 'image', 'realisation', 2, true),
  ('Exemple – Atelier de réparation', 'مثال – ورشة الإصلاح', 'Example – Repair workshop',
   'EXEMPLE – remplacez cette illustration par une vraie photo de vos réalisations.', '/examples/gallery/atelier.png', 'image', 'realisation', 3, true),
  ('Exemple – Formation bureautique', 'مثال – تكوين في المكتبية', 'Example – Office software training',
   'EXEMPLE – remplacez cette illustration par une vraie photo de vos formations.', '/examples/gallery/formation.png', 'image', 'formation', 4, true),
  ('Exemple – Création de contenu', 'مثال – إنتاج المحتوى', 'Example – Content creation',
   'EXEMPLE – remplacez cette illustration par une vraie photo de vos réalisations.', '/examples/gallery/contenu.png', 'image', 'realisation', 5, true),
  ('Exemple – Campagne Meta Ads', 'مثال – حملة إعلانات ميتا', 'Example – Meta Ads campaign',
   'EXEMPLE – remplacez cette illustration par une vraie capture de vos résultats.', '/examples/gallery/meta-ads.png', 'image', 'realisation', 6, true)
) AS v(title_fr, title_ar, title_en, description_fr, file_url, file_type, category, sort_order, is_visible)
WHERE NOT EXISTS (SELECT 1 FROM media_content m WHERE m.title_fr = v.title_fr);

-- Vérification (facultatif) :
-- SELECT name_fr, price_tnd, stock_quantity FROM products WHERE description_fr LIKE 'EXEMPLE%';
-- SELECT title_fr FROM media_content WHERE title_fr LIKE 'Exemple%';
