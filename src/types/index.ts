export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  tags?: string[];
  color?: string;
  is_pinned?: boolean;
}
