-- =============================================
-- SEED: Demo data for zen-canvas Mandala Shop
-- =============================================

-- Categories
INSERT INTO categories (id, name, slug, description) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Wall Art', 'wall-art', 'Large format mandala prints for your walls'),
  ('a1000000-0000-0000-0000-000000000002', 'Posters', 'posters', 'High quality mandala poster prints'),
  ('a1000000-0000-0000-0000-000000000003', 'Originals', 'originals', 'Hand-drawn original mandala artwork'),
  ('a1000000-0000-0000-0000-000000000004', 'Gift Sets', 'gift-sets', 'Curated mandala gift collections');

-- Products
INSERT INTO products (id, name, slug, description, category_id, published) VALUES
  ('b1000000-0000-0000-0000-000000000001',
   'Lotus Bloom Mandala',
   'lotus-bloom-mandala',
   'A stunning lotus-inspired mandala radiating balance and harmony. Printed on premium 200gsm matte paper with fade-resistant inks. Perfect centrepiece for living rooms and meditation spaces.',
   'a1000000-0000-0000-0000-000000000001', true),

  ('b1000000-0000-0000-0000-000000000002',
   'Cosmic Spiral Mandala',
   'cosmic-spiral-mandala',
   'Mesmerizing spiral patterns inspired by galaxies and sacred geometry. Deep indigo and gold tones that transform any wall into a portal of contemplation.',
   'a1000000-0000-0000-0000-000000000001', true),

  ('b1000000-0000-0000-0000-000000000003',
   'Sun & Moon Mandala',
   'sun-moon-mandala',
   'The eternal dance of sun and moon captured in intricate mandala form. Warm amber and cool silver tones bring celestial energy to your space.',
   'a1000000-0000-0000-0000-000000000002', true),

  ('b1000000-0000-0000-0000-000000000004',
   'Forest Glow Mandala',
   'forest-glow-mandala',
   'Deep emerald greens and earthy browns evoke the serenity of an ancient forest. Each line hand-designed to guide the eye inward.',
   'a1000000-0000-0000-0000-000000000002', true),

  ('b1000000-0000-0000-0000-000000000005',
   'Sacred Rose Mandala',
   'sacred-rose-mandala',
   'Original hand-drawn piece in rose gold and dusty pink. One-of-a-kind artwork signed by the artist. Arrives framed and ready to hang.',
   'a1000000-0000-0000-0000-000000000003', true),

  ('b1000000-0000-0000-0000-000000000006',
   'Ocean Tide Mandala',
   'ocean-tide-mandala',
   'Flowing ocean blues and teals rendered in concentric mandala waves. Brings a calming coastal energy to any room.',
   'a1000000-0000-0000-0000-000000000002', true),

  ('b1000000-0000-0000-0000-000000000007',
   'Fire Chakra Mandala',
   'fire-chakra-mandala',
   'Vibrant reds, oranges and golds inspired by the solar plexus chakra. Bold and energising — perfect for creative workspaces.',
   'a1000000-0000-0000-0000-000000000001', true),

  ('b1000000-0000-0000-0000-000000000008',
   'Zen Garden Gift Set',
   'zen-garden-gift-set',
   'A curated set of three A4 mandala prints — Lotus, Ocean and Forest — presented in a kraft gift box with a handwritten card. Perfect for gifting.',
   'a1000000-0000-0000-0000-000000000004', true);

-- Product Images (mandala-specific Unsplash photos)
INSERT INTO product_images (id, product_id, cloudinary_id, secure_url, display_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'demo/lotus-bloom', 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=800&q=80', 0),

  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002',
   'demo/cosmic-spiral', 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=800&q=80', 0),

  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003',
   'demo/sun-moon', 'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=800&q=80', 0),

  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004',
   'demo/forest-glow', 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80', 0),

  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000005',
   'demo/sacred-rose', 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=800&q=80', 0),

  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000006',
   'demo/ocean-tide', 'https://images.unsplash.com/photo-1609743522653-52354461eb27?w=800&q=80', 0),

  ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000007',
   'demo/fire-chakra', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', 0),

  ('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000008',
   'demo/zen-gift-set', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', 0);

-- Product Variants
INSERT INTO product_variants (id, product_id, sku, price, stock, attributes) VALUES
  -- Lotus Bloom: A3, A2, A1
  ('d1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'LOTUS-A3', 24.99, 50, '{"size": "A3 (29x42cm)"}'),
  ('d1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'LOTUS-A2', 34.99, 30, '{"size": "A2 (42x59cm)"}'),
  ('d1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'LOTUS-A1', 49.99, 20, '{"size": "A1 (59x84cm)"}'),

  -- Cosmic Spiral: A3, A2, A1
  ('d1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'COSMIC-A3', 27.99, 40, '{"size": "A3 (29x42cm)"}'),
  ('d1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002', 'COSMIC-A2', 39.99, 25, '{"size": "A2 (42x59cm)"}'),
  ('d1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000002', 'COSMIC-A1', 54.99, 15, '{"size": "A1 (59x84cm)"}'),

  -- Sun & Moon: A3, A2
  ('d1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000003', 'SUNMOON-A3', 22.99, 60, '{"size": "A3 (29x42cm)"}'),
  ('d1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000003', 'SUNMOON-A2', 32.99, 35, '{"size": "A2 (42x59cm)"}'),

  -- Forest Glow: A3, A2
  ('d1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000004', 'FOREST-A3', 22.99, 45, '{"size": "A3 (29x42cm)"}'),
  ('d1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000004', 'FOREST-A2', 32.99, 30, '{"size": "A2 (42x59cm)"}'),

  -- Sacred Rose: Original only
  ('d1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000005', 'ROSE-ORIG', 149.99, 1, '{"type": "Original", "size": "A2 (42x59cm)", "frame": "Included"}'),

  -- Ocean Tide: A3, A2, A1
  ('d1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000006', 'OCEAN-A3', 24.99, 50, '{"size": "A3 (29x42cm)"}'),
  ('d1000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000006', 'OCEAN-A2', 34.99, 30, '{"size": "A2 (42x59cm)"}'),
  ('d1000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000006', 'OCEAN-A1', 49.99, 15, '{"size": "A1 (59x84cm)"}'),

  -- Fire Chakra: A3, A2
  ('d1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000007', 'FIRE-A3', 26.99, 40, '{"size": "A3 (29x42cm)"}'),
  ('d1000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000007', 'FIRE-A2', 37.99, 25, '{"size": "A2 (42x59cm)"}'),

  -- Zen Garden Gift Set
  ('d1000000-0000-0000-0000-000000000017', 'b1000000-0000-0000-0000-000000000008', 'GIFT-SET-3', 59.99, 20, '{"includes": "3 A4 prints", "packaging": "Kraft gift box"}');
