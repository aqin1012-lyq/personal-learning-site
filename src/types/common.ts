export type NavItem = {
  label: string;
  href: string;
};

export type SectionHeaderProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export type SearchBoxProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export type TagFilterProps = {
  tags: string[];
  activeTag?: string;
  onTagChange?: (tag: string) => void;
};

export type CategoryFilterProps = {
  categories: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
};

export type PageHeaderProps = {
  title: string;
  description?: string;
};
