export type ProjectItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: 'planning' | 'in-progress' | 'completed' | 'paused' | string;
  tags: string[];
  period?: string;
  href?: string;
  content?: string;
  outcomes?: string[];
  lessons?: string[];
  nextSteps?: string[];
};
