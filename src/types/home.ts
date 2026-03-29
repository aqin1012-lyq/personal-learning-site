export type HeroData = {
  title: string;
  subtitle: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};

export type CurrentLearningItem = {
  id: string;
  title: string;
  summary: string;
  status: string;
  progressText?: string;
  tags: string[];
  href?: string;
};
