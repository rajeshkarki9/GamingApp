/*
  # Tournament System Schema

  1. New Tables
    - `tournaments`
      - Core tournament information
      - Supports multiple game formats
      - Includes prize pool and rules
    - `matches`
      - Individual match records
      - Real-time status updates
      - Team assignments
    - `tournament_participants`
      - Teams/players in tournaments
      - Tracks registration status
    - `chat_messages`
      - Tournament-wide chat
      - Team-specific messages
      - Support for announcements

  2. Security
    - Enable RLS on all tables
    - Policies for tournament organizers
    - Participant access controls
    - Chat message permissions
*/

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  game_type text NOT NULL,
  format text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  prize_pool decimal(10,2) DEFAULT 0,
  max_participants integer NOT NULL,
  rules jsonb,
  status text NOT NULL DEFAULT 'draft',
  organizer_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  round_number integer NOT NULL,
  match_number integer NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  start_time timestamptz,
  room_code text,
  results jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tournament participants
CREATE TABLE IF NOT EXISTS tournament_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id uuid NOT NULL,
  registration_status text NOT NULL DEFAULT 'pending',
  registered_at timestamptz DEFAULT now(),
  checked_in boolean DEFAULT false,
  seed_number integer
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id uuid,
  user_id uuid REFERENCES auth.users(id),
  message text NOT NULL,
  message_type text NOT NULL DEFAULT 'chat',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Tournaments policies
CREATE POLICY "Public tournaments are viewable by everyone"
  ON tournaments
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can create tournaments"
  ON tournaments
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Tournament organizers can update their tournaments"
  ON tournaments
  FOR UPDATE
  USING (auth.uid() = organizer_id);

-- Matches policies
CREATE POLICY "Match participants can view matches"
  ON matches
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tournament_participants
      WHERE tournament_id = matches.tournament_id
      AND team_id IN (
        SELECT team_id FROM team_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Tournament participants policies
CREATE POLICY "Teams can register for tournaments"
  ON tournament_participants
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = tournament_participants.team_id
      AND user_id = auth.uid()
      AND role = 'captain'
    )
  );

-- Chat messages policies
CREATE POLICY "Users can view tournament chat"
  ON chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tournament_participants
      WHERE tournament_id = chat_messages.tournament_id
      AND team_id IN (
        SELECT team_id FROM team_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can send chat messages"
  ON chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);