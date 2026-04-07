import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ScriptLine {
  character: string;
  text: string;
  note?: string;
}

interface ScriptProps {
  title: string;
  lines: ScriptLine[];
}

export function Script({ title, lines }: ScriptProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden" style={{
      background: 'linear-gradient(to bottom right, rgba(35, 56, 90, 0.6), rgba(35, 56, 90, 0.8))',
      border: '1px solid rgba(177, 140, 90, 0.3)'
    }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between transition-colors"
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(35, 56, 90, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <h3 className="text-2xl" style={{ color: '#b18c5a' }}>{title}</h3>
        {isExpanded ? (
          <ChevronUp style={{ color: '#b18c5a' }} size={24} />
        ) : (
          <ChevronDown style={{ color: '#b18c5a' }} size={24} />
        )}
      </button>

      {isExpanded && (
        <div className="p-6 pt-0 max-h-[600px] overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {lines.map((line, index) => (
<div
  key={index}
  className="border-l-2 pl-4"
  style={{ borderColor: 'rgba(177, 140, 90, 0.5)' }}
>
  <div
    className="uppercase tracking-wider text-sm mb-1"
    style={{ color: '#b18c5a' }}
  >
    {line.character}
  </div>

  {/* preNote — заметка перед текстом */}
  {line.preNote && (
    <div
      className="text-sm italic mb-1"
      style={{ color: '#9bb8d3' }}
    >
      [{line.preNote}]
    </div>
  )}

  {/* основной текст */}
<div
  className="leading-relaxed script-text"
  style={{ color: '#e8f4f8' }}
  dangerouslySetInnerHTML={{ __html: line.text }}
/>

  {/* note — заметка после текста */}
{line.note && (
  <div
    className="text-sm mt-1 script-text"
    style={{ color: '#9bb8d3' }}
    dangerouslySetInnerHTML={{ __html: `[${line.note}]` }}
  />
)}
</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}