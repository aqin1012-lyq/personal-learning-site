export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDuration(minutes?: number) {
  if (!minutes) return '未记录时长';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} 分钟`;
  if (mins === 0) return `${hours} 小时`;
  return `${hours} 小时 ${mins} 分钟`;
}
