-- Create a notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'Untitled Note',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID,
  tags TEXT[] DEFAULT '{}',
  color TEXT,
  is_pinned BOOLEAN DEFAULT FALSE
);

-- Create RLS (Row Level Security) policies
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- In a real app, you'd restrict operations to the authenticated user
CREATE POLICY "Anyone can read notes" ON notes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set updated_at on update
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 