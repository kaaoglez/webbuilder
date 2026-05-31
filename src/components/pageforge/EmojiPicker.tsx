'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const EMOJI_CATEGORIES = [
  { name: 'Comunes', emojis: ['⚡', '🔥', '💡', '🎯', '🚀', '⭐', '💎', '🏆', '📊', '📈', '💼', '🏠', '🌍', '✅', '❤️', '👑', '🎨', '📸', '🎬', '🎓'] },
  { name: 'Servicios', emojis: ['⚙️', '🔧', '🛠️', '💻', '📱', '🖥️', '🔒', '🛡️', '📧', '💬', '📞', '🌐', '📦', '🧩', '📑', '✏️', '📐', '🏗️'] },
  { name: 'Social', emojis: ['👤', '👥', '🤝', '👍', '🙏', '💪', '🌟', '✨', '🎉', '🎊', '💬', '❓', '📌', '🔗', '📧', '📲'] },
  { name: 'Negocio', emojis: ['🏢', '🏪', '🏥', '🎓', '⚖️', '🏦', '📊', '📈', '💰', '💵', '💳', '🛒', '🚚', '📦', '🏷️', '📋'] },
];

interface EmojiPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function EmojiPicker({ value, onChange, placeholder = '⚡' }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const filteredCategories = EMOJI_CATEGORIES.map(cat => ({
    ...cat,
    emojis: cat.emojis, // show all, filter is for search below
  }));

  const filtered = search.trim()
    ? EMOJI_CATEGORIES.flatMap(cat => cat.emojis).filter(e => e.includes(search))
    : [];

  return (
    <div className="relative" ref={ref}>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-9 w-20 text-center text-lg"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 px-2 shrink-0"
          onClick={() => setOpen(!open)}
        >
          <span className="text-base">😊</span>
        </Button>
      </div>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar emoji..."
              className="h-8 text-xs"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-2">
            {search.trim() ? (
              <div className="grid grid-cols-8 gap-1">
                {filtered.map((emoji, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { onChange(emoji); setSearch(''); setOpen(false); }}
                    className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 text-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="col-span-8 text-center text-gray-400 text-xs py-3">Sin resultados</p>
                )}
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <div key={cat.name} className="mb-2 last:mb-0">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1 px-1">{cat.name}</p>
                  <div className="grid grid-cols-8 gap-1">
                    {cat.emojis.map((emoji, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { onChange(emoji); setOpen(false); }}
                        className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 text-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
