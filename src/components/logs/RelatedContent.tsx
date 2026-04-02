import { NoteCard } from '@/components/notes/NoteCard';
import { LogCard } from './LogCard';
import type { NoteItem } from '@/types/note';
import type { LogItem } from '@/types/log';

const buildNotesHref = (note: NoteItem) => {
  const params = new URLSearchParams();
  if (note.category) params.set('category', note.category);
  if (note.tags[0]) params.set('tag', note.tags[0]);
  const query = params.toString();
  return query ? `/notes?${query}` : '/notes';
};

const buildLogsHref = (log: LogItem) => {
  const params = new URLSearchParams();
  if (log.type) params.set('type', log.type);
  if (log.tags[0]) params.set('tag', log.tags[0]);
  const query = params.toString();
  return query ? `/logs?${query}` : '/logs';
};

export function RelatedContent({ notes, logs }: { notes?: NoteItem[]; logs?: LogItem[] }) {
  return (
    <div className="space-y-6">
      {notes?.length ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-100">相关知识</h3>
          <div className="space-y-3">
            {notes.map((note) => (
              <NoteCard key={note.id} item={note} compact href={buildNotesHref(note)} />
            ))}
          </div>
        </section>
      ) : null}
      {logs?.length ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-100">相关文章</h3>
          <div className="space-y-3">
            {logs.map((log) => (
              <LogCard key={log.id} item={log} href={buildLogsHref(log)} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
