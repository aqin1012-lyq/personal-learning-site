type Block =
  | { type: 'h2'; content: string }
  | { type: 'p'; content: string }
  | { type: 'ul'; items: string[] };

function parseContent(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length) {
      blocks.push({ type: 'p', content: paragraphBuffer.join(' ') });
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push({ type: 'ul', items: [...listBuffer] });
      listBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h2', content: line.replace(/^##\s+/, '') });
      continue;
    }

    if (line.startsWith('- ')) {
      flushParagraph();
      listBuffer.push(line.replace(/^-\s+/, ''));
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

export function ArticleContent({ content }: { content: string }) {
  const blocks = parseContent(content);

  return (
    <div className="section-shell reveal-surface overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative prose-custom max-w-none">
        {blocks.map((block, index) => {
          if (block.type === 'h2') return <h2 key={index}>{block.content}</h2>;
          if (block.type === 'p') return <p key={index}>{block.content}</p>;
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        })}
      </div>
    </div>
  );
}
