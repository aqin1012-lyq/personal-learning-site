export type NoteItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  updatedAt: string;
  featured?: boolean;
  content?: string;
};
