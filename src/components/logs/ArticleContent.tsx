import React from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type Block =
  | { type: 'heading'; level: HeadingLevel; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'blockquote'; content: string[] }
  | { type: 'hr' }
  | { type: 'code'; content: string; language?: string }
  | { type: 'image'; src: string; alt?: string };

function decodeHtml(value: string) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function stripHtml(value: string) {
  return decodeHtml(value.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')).trim();
}

function getAttribute(tag: string, name: string) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return match?.[1];
}

function parseHtmlBlock(block: string): Block | null {
  const trimmed = block.trim();

  if (/^<hr\s*\/?>$/i.test(trimmed)) {
    return { type: 'hr' };
  }

  const headingMatch = trimmed.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>$/i);
  if (headingMatch) {
    return {
      type: 'heading',
      level: Number(headingMatch[1]) as HeadingLevel,
      content: stripHtml(headingMatch[2]),
    };
  }

  const paragraphMatch = trimmed.match(/^<p[^>]*>([\s\S]*?)<\/p>$/i);
  if (paragraphMatch) {
    return { type: 'paragraph', content: stripHtml(paragraphMatch[1]) };
  }

  const blockquoteMatch = trimmed.match(/^<blockquote[^>]*>([\s\S]*?)<\/blockquote>$/i);
  if (blockquoteMatch) {
    const content = stripHtml(blockquoteMatch[1])
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    return { type: 'blockquote', content };
  }

  const listMatch = trimmed.match(/^<(ul|ol)[^>]*>([\s\S]*?)<\/\1>$/i);
  if (listMatch) {
    const items = [...listMatch[2].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((match) => stripHtml(match[1]))
      .filter(Boolean);

    if (items.length) {
      return { type: 'list', items, ordered: listMatch[1].toLowerCase() === 'ol' };
    }
  }

  const preMatch = trimmed.match(/^<pre[^>]*>\s*<code([^>]*)>([\s\S]*?)<\/code>\s*<\/pre>$/i);
  if (preMatch) {
    const className = getAttribute(preMatch[1], 'class');
    const language = className?.match(/language-([a-z0-9_-]+)/i)?.[1];
    return { type: 'code', content: decodeHtml(preMatch[2]).trim(), language };
  }

  const imageMatch = trimmed.match(/^<img\b[^>]*>$/i);
  if (imageMatch) {
    const src = getAttribute(trimmed, 'src');
    if (src) {
      return { type: 'image', src, alt: getAttribute(trimmed, 'alt') };
    }
  }

  return null;
}

function parseMarkdownBlocks(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const currentLine = lines[i];
    const trimmed = currentLine.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const language = trimmed.replace(/^```/, '').trim() || undefined;
      const codeLines: string[] = [];
      i += 1;

      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }

      if (i < lines.length) i += 1;
      blocks.push({ type: 'code', content: codeLines.join('\n').trimEnd(), language });
      continue;
    }

    if (/^(?:---|\*\*\*|___)$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length as HeadingLevel,
        content: headingMatch[2].trim(),
      });
      i += 1;
      continue;
    }

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      blocks.push({ type: 'image', alt: imageMatch[1], src: imageMatch[2] });
      i += 1;
      continue;
    }

    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ type: 'blockquote', content: quoteLines.filter(Boolean) });
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'list', items, ordered: true });
      continue;
    }

    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const line = lines[i];
      const text = line.trim();
      if (!text) break;
      if (
        text.startsWith('```') ||
        /^(?:---|\*\*\*|___)$/.test(text) ||
        /^(#{1,6})\s+/.test(text) ||
        /^!\[([^\]]*)\]\(([^)]+)\)$/.test(text) ||
        text.startsWith('>') ||
        /^[-*]\s+/.test(text) ||
        /^\d+\.\s+/.test(text)
      ) {
        break;
      }
      paragraphLines.push(text);
      i += 1;
    }
    blocks.push({ type: 'paragraph', content: paragraphLines.join(' ') });
  }

  return blocks;
}

function splitIntoChunks(content: string) {
  return content
    .trim()
    .split(/\n\s*\n+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

function parseContent(content: string): Block[] {
  const blocks: Block[] = [];

  for (const chunk of splitIntoChunks(content)) {
    const htmlBlock = parseHtmlBlock(chunk);
    if (htmlBlock) {
      blocks.push(htmlBlock);
      continue;
    }

    blocks.push(...parseMarkdownBlocks(chunk));
  }

  return blocks;
}

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.level}` as keyof React.JSX.IntrinsicElements;
      return <Tag key={index}>{block.content}</Tag>;
    }
    case 'paragraph':
      return <p key={index}>{block.content}</p>;
    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul';
      return React.createElement(
        ListTag,
        { key: index },
        block.items.map((item) => <li key={`${index}-${item}`}>{item}</li>),
      );
    }
    case 'blockquote':
      return (
        <blockquote key={index}>
          {block.content.map((line, lineIndex) => (
            <p key={`${index}-${lineIndex}`}>{line}</p>
          ))}
        </blockquote>
      );
    case 'hr':
      return <hr key={index} />;
    case 'code':
      return (
        <pre key={index}>
          <code className={block.language ? `language-${block.language}` : undefined}>{block.content}</code>
        </pre>
      );
    case 'image':
      return <img key={index} src={block.src} alt={block.alt || ''} loading="lazy" />;
    default:
      return null;
  }
}

export function ArticleContent({ content }: { content: string }) {
  const blocks = parseContent(content);

  return (
    <div className="section-shell reveal-surface overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative prose-custom max-w-none">
        {blocks.map((block, index) => renderBlock(block, index))}
      </div>
    </div>
  );
}
