# Supabase Database Setup Instructions

Follow these steps to set up your Supabase database for the ThoughtBox app:

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Create a new project
3. Choose a name for your project (e.g., "ThoughtBox")
4. Set a secure database password
5. Choose the region closest to you
6. Click "Create new project"

## 2. Set Up Database Schema

1. Once your project is created, go to the SQL Editor in the Supabase dashboard
2. Create a new query
3. Copy and paste the following SQL code:

```sql
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
```

4. Click "Run" to execute the SQL and create your database schema

## 3. Get Your API Keys

1. In the Supabase dashboard, go to Project Settings > API
2. Copy the "URL" and "anon public" key
3. Update your `.env.local` file with these values:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Test Your Connection

1. Run your app with `npm run dev`
2. Try creating a new note
3. Check the Supabase Table Editor to see if your note was saved

## Troubleshooting

If you encounter any issues:

1. Check the browser console for errors
2. Verify your API keys are correct in `.env.local`
3. Make sure the SQL schema was executed successfully
4. Check the Supabase logs for any errors
