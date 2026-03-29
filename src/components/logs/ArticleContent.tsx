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
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
      <div className="prose-custom max-w-none">
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
