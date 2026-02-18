-- Cart (server-side cart items per user session or user account)
CREATE TABLE cart_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  VARCHAR(255),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    variant_id  UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity    INT NOT NULL DEFAULT 1,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT cart_item_owner CHECK (session_id IS NOT NULL OR user_id IS NOT NULL),
    UNIQUE (session_id, variant_id),
    UNIQUE (user_id, variant_id)
);

CREATE INDEX idx_cart_items_session ON cart_items(session_id);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
