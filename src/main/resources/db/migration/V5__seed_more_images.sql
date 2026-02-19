-- =============================================
-- SEED: Additional demo images per product
-- Each product gets 3 more images (display_order 1, 2, 3)
-- All URLs are real mandala / geometric art photos from Unsplash
-- =============================================

INSERT INTO product_images (id, product_id, cloudinary_id, secure_url, display_order) VALUES

  -- Lotus Bloom Mandala (b1...001)
  ('c2000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'demo/lotus-bloom-2', 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=800&q=80', 1),
  ('c2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001',
   'demo/lotus-bloom-3', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', 2),
  ('c2000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001',
   'demo/lotus-bloom-4', 'https://images.unsplash.com/photo-1600685950757-7e10a3e80e5e?w=800&q=80', 3),

  -- Cosmic Spiral Mandala (b1...002)
  ('c2000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002',
   'demo/cosmic-spiral-2', 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=800&q=80', 1),
  ('c2000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002',
   'demo/cosmic-spiral-3', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', 2),
  ('c2000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000002',
   'demo/cosmic-spiral-4', 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80', 3),

  -- Sun & Moon Mandala (b1...003)
  ('c2000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000003',
   'demo/sun-moon-2', 'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=800&q=80', 1),
  ('c2000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000003',
   'demo/sun-moon-3', 'https://images.unsplash.com/photo-1609743522653-52354461eb27?w=800&q=80', 2),
  ('c2000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000003',
   'demo/sun-moon-4', 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=800&q=80', 3),

  -- Forest Glow Mandala (b1...004)
  ('c2000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000004',
   'demo/forest-glow-2', 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80', 1),
  ('c2000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000004',
   'demo/forest-glow-3', 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=800&q=80', 2),
  ('c2000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000004',
   'demo/forest-glow-4', 'https://images.unsplash.com/photo-1615639164213-aab04da021b4?w=800&q=80', 3),

  -- Sacred Rose Mandala (b1...005)
  ('c2000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000005',
   'demo/sacred-rose-2', 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=800&q=80', 1),
  ('c2000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000005',
   'demo/sacred-rose-3', 'https://images.unsplash.com/photo-1600685950757-7e10a3e80e5e?w=800&q=80', 2),
  ('c2000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000005',
   'demo/sacred-rose-4', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', 3),

  -- Ocean Tide Mandala (b1...006)
  ('c2000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000006',
   'demo/ocean-tide-2', 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80', 1),
  ('c2000000-0000-0000-0000-000000000017', 'b1000000-0000-0000-0000-000000000006',
   'demo/ocean-tide-3', 'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=800&q=80', 2),
  ('c2000000-0000-0000-0000-000000000018', 'b1000000-0000-0000-0000-000000000006',
   'demo/ocean-tide-4', 'https://images.unsplash.com/photo-1609743522653-52354461eb27?w=800&q=80', 3),

  -- Fire Chakra Mandala (b1...007)
  ('c2000000-0000-0000-0000-000000000019', 'b1000000-0000-0000-0000-000000000007',
   'demo/fire-chakra-2', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', 1),
  ('c2000000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000007',
   'demo/fire-chakra-3', 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80', 2),
  ('c2000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000007',
   'demo/fire-chakra-4', 'https://images.unsplash.com/photo-1615639164213-aab04da021b4?w=800&q=80', 3),

  -- Zen Garden Gift Set (b1...008)
  ('c2000000-0000-0000-0000-000000000022', 'b1000000-0000-0000-0000-000000000008',
   'demo/zen-gift-2', 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=800&q=80', 1),
  ('c2000000-0000-0000-0000-000000000023', 'b1000000-0000-0000-0000-000000000008',
   'demo/zen-gift-3', 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=800&q=80', 2),
  ('c2000000-0000-0000-0000-000000000024', 'b1000000-0000-0000-0000-000000000008',
   'demo/zen-gift-4', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', 3);
