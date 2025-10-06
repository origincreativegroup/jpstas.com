import React, { useEffect, useRef, useState } from 'react';
import { config } from '@/config/environment';

export type DebugEvent = {
  id: string;
  time: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
};

export const debugBus = {
  listeners: new Set<(event: DebugEvent) => void>(),
  emit(event: DebugEvent) {
    this.listeners.forEach((fn) => fn(event));
  },
  on(fn: (event: DebugEvent) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
};

export const DebugOverlay: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<DebugEvent[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!config.enableDebug) return;
    const off = debugBus.on((evt) => {
      setEvents((prev) => [...prev.slice(-199), evt]);
    });
    return () => off();
  }, []);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [open, events.length]);

  if (!config.enableDebug) return null;

  return (
    <div style={{ position: 'fixed', bottom: 12, right: 12, zIndex: 9999 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: '#111827',
          color: 'white',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        {open ? 'Close Debug' : `Open Debug (${events.length})`}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 56,
            right: 12,
            width: 420,
            maxHeight: 360,
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: 10, borderBottom: '1px solid #e5e7eb', background: '#f3f4f6' }}>
            <strong>Debug Events</strong>
          </div>
          <div ref={listRef} style={{ padding: 10, overflowY: 'auto', maxHeight: 300 }}>
            {events.map((e) => (
              <div key={e.id} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{e.time} • {e.level.toUpperCase()}</div>
                <div style={{ fontSize: 13 }}>{e.message}</div>
                {e.context && (
                  <pre style={{ fontSize: 11, color: '#111827', background: '#f9fafb', padding: 8, borderRadius: 6, overflowX: 'auto' }}>
                    {JSON.stringify(e.context, null, 2)}
                  </pre>
                )}
              </div>
            ))}
            {events.length === 0 && (
              <div style={{ fontSize: 12, color: '#6b7280' }}>No events yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const pushDebug = (level: DebugEvent['level'], message: string, context?: Record<string, any>) => {
  if (!config.enableDebug) return;
  const evt: DebugEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    time: new Date().toLocaleTimeString(),
    level,
    message,
    context,
  };
  debugBus.emit(evt);
};


