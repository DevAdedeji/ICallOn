-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- 1. Users Table Policies
-- Allow anyone to read user profiles (necessary for game lobby/UI to show host names)
CREATE POLICY "Public profiles are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id::uuid);

-- 2. Rooms Table Policies
-- Allow anyone to read rooms (for joining games)
CREATE POLICY "Rooms are viewable by everyone" ON rooms
  FOR SELECT USING (true);

-- Allow authenticated users to create rooms
CREATE POLICY "Authenticated users can insert rooms" ON rooms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow hosts to update their own rooms
CREATE POLICY "Hosts can update own rooms" ON rooms
  FOR UPDATE USING (auth.uid() = host_id::uuid);

-- Allow hosts to delete their own rooms
CREATE POLICY "Hosts can delete own rooms" ON rooms
  FOR DELETE USING (auth.uid() = host_id::uuid);


-- 3. Players Table Policies
-- Ideally we'd restrict this more, but without Anonymous Auth, we need Public Access for guests.
-- Allow everything for now to support Guest players.
CREATE POLICY "Public access to players" ON players
  FOR ALL USING (true);

-- 4. Rounds Table Policies
-- Everyone needs to see rounds for the game to work.
CREATE POLICY "Rounds are viewable by everyone" ON rounds
  FOR SELECT USING (true);

-- Only Hosts can insert/update rounds (game flow control).
-- We check if the user is the host of the associated room.
CREATE POLICY "Hosts can insert rounds" ON rounds
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = rounds.room_id
      AND rooms.host_id::uuid = auth.uid()
    )
  );

CREATE POLICY "Hosts can update rounds" ON rounds
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = rounds.room_id
      AND rooms.host_id::uuid = auth.uid()
    )
  );


-- 5. Answers Table Policies
-- Similar to players, we need permissive access for guest gameplay.
-- Everyone can read answers (needed for Review phase).
-- Everyone can insert/update (needed for Guest submissions).
CREATE POLICY "Public access to answers" ON answers
  FOR ALL USING (true);
