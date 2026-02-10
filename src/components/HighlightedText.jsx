import { DETAIL_TYPES } from '../constants';

export default function HighlightedText({ text, highlights }) {
  if (!text || !highlights) return null;

  const sorted = [...highlights].sort((a, b) => {
    const posA = text.indexOf(a.text);
    const posB = text.indexOf(b.text);
    return posA - posB;
  });

  const parts = [];
  let lastIndex = 0;

  sorted.forEach((highlight, i) => {
    const startIndex = text.indexOf(highlight.text, lastIndex);
    if (startIndex === -1) return;

    if (startIndex > lastIndex) {
      parts.push({
        type: 'normal',
        text: text.slice(lastIndex, startIndex),
        key: `normal-${i}`,
      });
    }

    parts.push({
      type: highlight.type,
      text: highlight.text,
      key: `highlight-${i}`,
    });

    lastIndex = startIndex + highlight.text.length;
  });

  if (lastIndex < text.length) {
    parts.push({
      type: 'normal',
      text: text.slice(lastIndex),
      key: 'normal-end',
    });
  }

  return (
    <div className="leading-relaxed text-lg">
      {parts.map((part) => {
        if (part.type === 'normal') {
          return <span key={part.key}>{part.text}</span>;
        }
        const detail = DETAIL_TYPES[part.type];
        if (!detail) return <span key={part.key}>{part.text}</span>;
        return (
          <span
            key={part.key}
            className="px-1 py-0.5 rounded mx-0.5 cursor-help transition-all hover:scale-105 inline-block"
            style={{
              backgroundColor: detail.bgColor,
              borderBottom: `2px solid ${detail.color}`,
              color: detail.color,
            }}
            title={`${detail.label}: ${detail.description}`}
          >
            {part.text}
          </span>
        );
      })}
    </div>
  );
}
