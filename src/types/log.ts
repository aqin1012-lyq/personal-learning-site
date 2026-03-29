export type LogType = 'reading' | 'practice' | 'project' | 'review' | 'writing';

export type LogTimelineItem = {
  time: string;
  title: string;
  description?: string;
  type?: string;
};

export type LogItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  summary: string;
  durationMinutes?: number;
  type: LogType;
  tags: string[];
  featured?: boolean;
  highlights?: string[];
  problems?: string[];
  nextActions?: string[];
  timeline?: LogTimelineItem[];
  content: string;
};
