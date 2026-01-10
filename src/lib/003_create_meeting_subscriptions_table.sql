-- Create meeting_subscriptions table for push notification subscriptions
CREATE TABLE IF NOT EXISTS meeting_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meeting_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only subscribe once per meeting
  UNIQUE(user_id, meeting_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_meeting_subscriptions_user_id ON meeting_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_subscriptions_meeting_id ON meeting_subscriptions(meeting_id);

-- Enable RLS (Row Level Security)
ALTER TABLE meeting_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own subscriptions" ON meeting_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON meeting_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" ON meeting_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_meeting_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_meeting_subscriptions_updated_at
  BEFORE UPDATE ON meeting_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_meeting_subscriptions_updated_at();
