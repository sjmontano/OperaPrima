-- ============================================================
-- Opera Prima — Schema inicial
-- ============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Membresía enum ──────────────────────────────────────────
CREATE TYPE membership_tier AS ENUM ('free', 'premium');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- ─── Perfiles de usuario ─────────────────────────────────────
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name     TEXT,
  avatar_url    TEXT,
  membership    membership_tier NOT NULL DEFAULT 'free',
  bio           TEXT,
  discipline    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Crea el perfil automáticamente al registrarse el usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Mentores ────────────────────────────────────────────────
CREATE TABLE mentors (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT UNIQUE NOT NULL,
  name              TEXT NOT NULL,
  bio               TEXT NOT NULL,
  specialty         TEXT NOT NULL,
  avatar_url        TEXT,
  price_per_session INTEGER NOT NULL, -- en centavos COP
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Disponibilidad de mentores ───────────────────────────────
CREATE TABLE availabilities (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id   UUID NOT NULL REFERENCES mentors ON DELETE CASCADE,
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ NOT NULL,
  is_booked   BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT no_overlap EXCLUDE USING gist (
    mentor_id WITH =,
    tstzrange(starts_at, ends_at) WITH &&
  )
);

-- ─── Reservas ─────────────────────────────────────────────────
CREATE TABLE bookings (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
  mentor_id                 UUID NOT NULL REFERENCES mentors ON DELETE RESTRICT,
  availability_id           UUID REFERENCES availabilities ON DELETE SET NULL,
  starts_at                 TIMESTAMPTZ NOT NULL,
  ends_at                   TIMESTAMPTZ NOT NULL,
  status                    booking_status NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id  TEXT,
  price                     INTEGER NOT NULL, -- en centavos COP
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Eventos ──────────────────────────────────────────────────
CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ NOT NULL,
  location    TEXT,
  is_online   BOOLEAN NOT NULL DEFAULT FALSE,
  image_url   TEXT,
  is_free     BOOLEAN NOT NULL DEFAULT TRUE,
  price       INTEGER, -- null si is_free = true
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Oportunidades ────────────────────────────────────────────
CREATE TABLE opportunities (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  discipline  TEXT NOT NULL,
  country     TEXT NOT NULL DEFAULT 'Colombia',
  deadline    DATE,
  posted_by   UUID NOT NULL REFERENCES profiles ON DELETE CASCADE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Row Level Security ───────────────────────────────────────

ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Perfiles: el usuario solo ve/edita el propio
CREATE POLICY "profiles: select own"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles: update own"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Reservas: el usuario solo ve las propias
CREATE POLICY "bookings: select own"
  ON bookings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "bookings: insert own"
  ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Oportunidades: todos leen, autenticados publican
CREATE POLICY "opportunities: select all"
  ON opportunities FOR SELECT USING (is_active = TRUE);

CREATE POLICY "opportunities: insert authenticated"
  ON opportunities FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "opportunities: update own"
  ON opportunities FOR UPDATE USING (auth.uid() = posted_by);

-- Mentores y Eventos son públicos (solo lectura, admin escribe)
CREATE POLICY "mentors: select all"
  ON mentors FOR SELECT USING (is_active = TRUE);
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events: select all"
  ON events FOR SELECT USING (TRUE);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
