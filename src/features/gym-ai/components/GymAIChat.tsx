'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, Trash2, X } from 'lucide-react';
import {
  useAskGymAI,
  useClearGymAIHistory,
  useGymAIExamples,
} from '../hooks/useGymAI';
import { useGymAIStore } from '../store/gym-ai.store';
import { ChatMessageBubble } from './ChatMessageBubble';

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function GymAIChat() {
  const isOpen = useGymAIStore((state) => state.isOpen);
  const setOpen = useGymAIStore((state) => state.setOpen);
  const toggleOpen = useGymAIStore((state) => state.toggleOpen);
  const messages = useGymAIStore((state) => state.messages);
  const addMessage = useGymAIStore((state) => state.addMessage);
  const clearMessages = useGymAIStore((state) => state.clearMessages);

  const [input, setInput] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: examplesData } = useGymAIExamples(isOpen);
  const { mutate: ask, isPending } = useAskGymAI();
  const { mutate: clearHistory } = useClearGymAIHistory();

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isPending]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || isPending) return;

    addMessage({ id: createId(), role: 'user', content: trimmed });
    setInput('');

    ask(trimmed, {
      onSuccess: (res) => {
        addMessage({
          id: createId(),
          role: 'assistant',
          content: res.answer,
          data: res.data,
          isError: !res.success,
        });
      },
      onError: () => {
        addMessage({
          id: createId(),
          role: 'assistant',
          content:
            'No pude procesar tu consulta en este momento. Intentá de nuevo en unos segundos.',
          isError: true,
        });
      },
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuery(input);
    }
  };

  const handleClear = () => {
    clearMessages();
    clearHistory();
  };

  const DEFAULT_EXAMPLES = [
    '¿Cuántos socios activos tengo?',
    '¿Cuáles fueron los ingresos de este mes?',
    '¿Qué socios tienen la cuota por vencer esta semana?',
    '¿En qué medio de pago cobré más este mes?',
    '¿Cuántas suscripciones expiraron esta semana?',
    '¿Cuál es el plan más popular?',
  ];

  const rawExamples = examplesData?.examples ?? DEFAULT_EXAMPLES;
  const examples = rawExamples.filter(
    (ex) => !ex.toLowerCase().includes('producto') && !ex.toLowerCase().includes('venta')
  );

  return (
    <>
      <div
        className={`fixed z-40 bottom-0 right-0 sm:bottom-24 sm:right-6 w-full sm:w-95 h-[85vh] sm:h-140 max-h-[calc(100vh-7rem)] flex flex-col bg-background border border-border-primary sm:rounded-lg rounded-t-lg shadow-2xl overflow-hidden transition-all duration-200 origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 visible'
            : 'opacity-0 scale-95 invisible pointer-events-none'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border-primary bg-sidebar shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-brand-surface flex items-center justify-center">
              <Bot size={18} className="text-brand-main" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-main">
                Asistente del gimnasio
              </span>
              <span className="text-[9px] text-text-muted font-bold tracking-widest">
                CONSULTAS ESTADÍSTICAS
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              disabled={messages.length === 0 || isPending}
              className="p-2 rounded text-text-muted hover:text-danger-main hover:bg-danger-surface transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-muted"
              title="Limpiar conversación"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="h-12 w-12 rounded-full bg-brand-surface flex items-center justify-center mb-3">
                  <Sparkles size={22} className="text-brand-main" />
                </div>
                <p className="text-sm font-semibold text-text-main">
                  ¿Qué querés saber de tu gimnasio?
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Preguntá por socios, planes, pagos o vencimientos.
                </p>
              </div>
              {examples.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-text-muted tracking-wider uppercase">
                    Ejemplos
                  </span>
                  {examples.map((example) => (
                    <button
                      key={example}
                      onClick={() => sendQuery(example)}
                      className="text-left text-xs px-3 py-2 rounded border border-border-primary bg-surface text-text-main hover:border-brand-main hover:bg-brand-surface transition-colors cursor-pointer"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} />
            ))
          )}

          {isPending && (
            <div className="flex justify-start">
              <div className="bg-surface border border-border-primary rounded-lg rounded-bl-sm px-3 py-3 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" />
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-border-primary bg-sidebar shrink-0"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí tu consulta..."
              rows={1}
              maxLength={500}
              className="flex-1 resize-none max-h-28 px-3 py-2 text-sm bg-surface text-text-main placeholder:text-text-muted border border-border-primary rounded focus:outline-none focus:border-brand-main transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isPending}
              className="h-9.5 w-9.5 shrink-0 flex items-center justify-center rounded bg-brand-main text-white hover:bg-brand-hover transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Enviar"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>

      <button
        onClick={toggleOpen}
        className={`fixed z-40 bottom-6 right-6 h-14 w-14 rounded-full bg-brand-main text-white shadow-lg hover:bg-brand-hover transition-all cursor-pointer flex items-center justify-center ${
          isOpen ? 'max-sm:hidden' : ''
        }`}
        title={isOpen ? 'Cerrar asistente' : 'Abrir asistente'}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>
    </>
  );
}
