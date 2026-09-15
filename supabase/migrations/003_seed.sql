-- ============================================================
-- Lotosphere Seed Data
-- Migration 003: Categories + Products
-- ============================================================

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO public.categories (id, name, slug, description, image_url) VALUES
(
  'c1000000-0000-0000-0000-000000000001',
  'Indoor Plants',
  'indoor-plants',
  'Beautiful plants that thrive indoors with minimal care',
  'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'
),
(
  'c2000000-0000-0000-0000-000000000002',
  'Tropical',
  'tropical',
  'Lush tropical specimens that bring the jungle home',
  'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=800&q=80'
),
(
  'c3000000-0000-0000-0000-000000000003',
  'Succulents & Cacti',
  'succulents-cacti',
  'Low-maintenance beauties for busy plant parents',
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80'
),
(
  'c4000000-0000-0000-0000-000000000004',
  'Air Purifying',
  'air-purifying',
  'Plants that actively clean and purify the air in your home',
  'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80'
),
(
  'c5000000-0000-0000-0000-000000000005',
  'Pet Friendly',
  'pet-friendly',
  'Safe, beautiful plants that won''t harm your furry friends',
  'https://images.unsplash.com/photo-1603912699214-92627f304eb6?w=800&q=80'
),
(
  'c6000000-0000-0000-0000-000000000006',
  'Statement Plants',
  'statement-plants',
  'Bold, dramatic specimens that anchor a room''s design',
  'https://images.unsplash.com/photo-1616046460442-bc3d59c14a52?w=800&q=80'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PRODUCTS
-- ============================================================
INSERT INTO public.products (
  id, name, slug, description, price, sale_price,
  category_id, image_url, additional_images,
  stock, featured, care_level, light_requirement, water_requirement,
  pet_friendly, air_purifying
) VALUES

-- 1. Monstera Deliciosa
(
  'p1000000-0000-0000-0000-000000000001',
  'Monstera Deliciosa',
  'monstera-deliciosa',
  'The iconic Swiss Cheese Plant, beloved for its dramatic split leaves and effortless tropical energy. A statement-maker in any living space, the Monstera rewards minimal care with spectacular growth and architectural form.',
  2499.00, NULL,
  'c2000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1597305877032-0668b3c6413a?w=800&q=80',
    'https://images.unsplash.com/photo-1620127252536-03bdfbda2438?w=800&q=80'
  ],
  45, TRUE, 'Easy', 'Bright Indirect', 'Moderate',
  FALSE, FALSE
),

-- 2. Snake Plant
(
  'p2000000-0000-0000-0000-000000000002',
  'Snake Plant',
  'snake-plant',
  'The Snake Plant (Sansevieria) is the ultimate resilient houseplant. Its striking upright sword-like leaves in deep green with golden edges bring a graphic, sculptural quality to any space. One of the best air purifiers available.',
  1299.00, 999.00,
  'c4000000-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&q=80',
    'https://images.unsplash.com/photo-1574577457897-6d80ece9d4f9?w=800&q=80'
  ],
  78, TRUE, 'Easy', 'Low', 'Low',
  FALSE, TRUE
),

-- 3. Fiddle Leaf Fig
(
  'p3000000-0000-0000-0000-000000000003',
  'Fiddle Leaf Fig',
  'fiddle-leaf-fig',
  'The Fiddle Leaf Fig is the undisputed king of interior design. Its large, glossy violin-shaped leaves create an instant focal point and bring a lush, editorial quality to any room. A true design icon.',
  3499.00, NULL,
  'c6000000-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80'
  ],
  23, TRUE, 'Expert', 'Bright Indirect', 'Moderate',
  FALSE, FALSE
),

-- 4. Peace Lily
(
  'p4000000-0000-0000-0000-000000000004',
  'Peace Lily',
  'peace-lily',
  'Graceful white blooms rise above deep green foliage in the Peace Lily — one of the few flowering plants that thrives in lower light. A symbol of tranquility and one of NASA''s top air-purifying plants.',
  899.00, 749.00,
  'c4000000-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1598134493179-51932a4b7dfa?w=800&q=80'
  ],
  60, TRUE, 'Easy', 'Low', 'Moderate',
  FALSE, TRUE
),

-- 5. ZZ Plant
(
  'p5000000-0000-0000-0000-000000000005',
  'ZZ Plant',
  'zz-plant',
  'The Zamioculcas zamiifolia is practically indestructible. With its waxy, deep-green leaves and architectural upright form, the ZZ thrives on neglect — perfect for frequent travelers or low-light spaces.',
  1599.00, NULL,
  'c1000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1632759145354-f8e4c9afe2cf?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1620127252536-03bdfbda2438?w=800&q=80'
  ],
  55, FALSE, 'Easy', 'Low', 'Low',
  FALSE, FALSE
),

-- 6. Areca Palm
(
  'p6000000-0000-0000-0000-000000000006',
  'Areca Palm',
  'areca-palm',
  'Bring the tropics home with the elegant Areca Palm. Its feathery, arching fronds create movement and natural humidity, transforming any corner into a lush tropical retreat. One of the most effective natural air humidifiers.',
  2799.00, NULL,
  'c2000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1590586767911-c0f69cbc1f0f?w=800&q=80'
  ],
  30, TRUE, 'Moderate', 'Bright Indirect', 'High',
  TRUE, TRUE
),

-- 7. Philodendron Heartleaf
(
  'p7000000-0000-0000-0000-000000000007',
  'Philodendron Heartleaf',
  'philodendron-heartleaf',
  'The Heartleaf Philodendron is a natural born cascader with lush heart-shaped leaves that trail beautifully from shelves and hanging planters. Fast-growing, forgiving, and endlessly charming — a perfect companion plant.',
  799.00, 599.00,
  'c1000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1611048268330-53de574cae3b?w=800&q=80'
  ],
  90, FALSE, 'Easy', 'Medium', 'Moderate',
  FALSE, FALSE
),

-- 8. Calathea Orbifolia
(
  'p8000000-0000-0000-0000-000000000008',
  'Calathea Orbifolia',
  'calathea-orbifolia',
  'The Calathea Orbifolia is one of the most spectacular foliage plants in existence. Its large, silvery-green leaves with elegant dark stripes are works of art. Known to move its leaves throughout the day — truly a living sculpture.',
  1899.00, NULL,
  'c2000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1620231109736-e5ee28e22c43?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1598880940942-4584dae8fcf8?w=800&q=80'
  ],
  35, TRUE, 'Moderate', 'Medium', 'High',
  TRUE, FALSE
),

-- 9. Pothos Golden
(
  'p9000000-0000-0000-0000-000000000009',
  'Golden Pothos',
  'golden-pothos',
  'The Golden Pothos is the perfect starter plant — virtually indestructible with gorgeous golden-variegated heart-shaped leaves. Trails magnificently from high shelves or climbs a moss pole. The world''s most popular houseplant for good reason.',
  499.00, NULL,
  'c5000000-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1624861978932-59879e3a97b4?w=800&q=80'
  ],
  120, FALSE, 'Easy', 'Medium', 'Moderate',
  FALSE, TRUE
),

-- 10. Echeveria Succulent
(
  'p1000000-0000-0000-0000-000000000010',
  'Echeveria Elegans',
  'echeveria-elegans',
  'The Echeveria Elegans is a jewel-like succulent with perfect rosette form in soft blue-green with pink-tipped leaves. Requires almost no water and thrives on bright sun — stunning in clusters or as a single sculptural accent.',
  299.00, NULL,
  'c3000000-0000-0000-0000-000000000003',
  'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80'
  ],
  200, FALSE, 'Easy', 'Full Sun', 'Low',
  TRUE, FALSE
),

-- 11. Bird of Paradise
(
  'p1100000-0000-0000-0000-000000000011',
  'Bird of Paradise',
  'bird-of-paradise',
  'The Bird of Paradise is nature''s own sculpture — towering paddle-shaped leaves on long elegant stems create a dramatic silhouette that commands attention. The signature statement plant of the contemporary interior.',
  4999.00, 3999.00,
  'c6000000-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1622195856-67eed1e97534?w=800&q=80'
  ],
  12, TRUE, 'Moderate', 'Bright Indirect', 'Moderate',
  TRUE, FALSE
),

-- 12. Spider Plant
(
  'p1200000-0000-0000-0000-000000000012',
  'Spider Plant',
  'spider-plant',
  'Cheerful, fast-growing and practically indestructible, the Spider Plant is beloved for its arching striped foliage and cascading baby plantlets. One of the most effective air purifiers and completely safe for pets and children.',
  599.00, NULL,
  'c5000000-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=800&q=80'
  ],
  85, FALSE, 'Easy', 'Medium', 'Moderate',
  TRUE, TRUE
)

ON CONFLICT (slug) DO NOTHING;
