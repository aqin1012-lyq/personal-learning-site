import { NoteCard } from '@/components/notes/NoteCard';
import { LogCard } from './LogCard';
import type { NoteItem } from '@/types/note';
import type { LogItem } from '@/types/log';

export function RelatedContent({ notes, logs }: { notes?: NoteItem[]; logs?: LogItem[] }) {
  return (
    <div className="space-y-6">
      {notes?.length ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-900">相关知识</h3>
          <div className="space-y-3">
            {notes.map((note) => (
              <NoteCard key={note.id} item={note} compact />
            ))}
          </div>
        </section>
      ) : null}
      {logs?.length ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-900">相关文章</h3>
          <div className="space-y-3">
            {logs.map((log) => (
              <LogCard key={log.id} item={log} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
