'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ChatMessage } from '../interfaces/gym-ai.interface';

const MAX_ROWS = 10;

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function DataTable({ rows }: { rows: Record<string, unknown>[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const columns = Object.keys(rows[0] ?? {});

  if (columns.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 text-[11px] font-medium text-brand-main hover:text-brand-hover transition-colors cursor-pointer"
      >
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {isOpen ? 'Ocultar datos' : `Ver datos (${rows.length})`}
      </button>

      {isOpen && (
        <div className="mt-2 max-h-48 overflow-auto rounded border border-border-primary">
          <table className="w-full text-[11px]">
            <thead className="bg-surface-hover sticky top-0">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-2 py-1.5 text-left font-bold text-text-muted uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, MAX_ROWS).map((row, i) => (
                <tr key={i} className="border-t border-border-primary">
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-2 py-1.5 text-text-main whitespace-nowrap"
                    >
                      {formatCell(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > MAX_ROWS && (
            <p className="px-2 py-1.5 text-[10px] text-text-muted border-t border-border-primary">
              Mostrando {MAX_ROWS} de {rows.length} filas
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? 'bg-brand-main text-white rounded-br-sm'
            : message.isError
              ? 'bg-danger-surface text-danger-main border border-danger-main/30 rounded-bl-sm'
              : 'bg-surface text-text-main border border-border-primary rounded-bl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap wrap-break-word">
          {isUser ? message.content : renderInline(message.content)}
        </p>
        {!isUser && message.data && message.data.length > 0 && (
          <DataTable rows={message.data} />
        )}
      </div>
    </div>
  );
}
