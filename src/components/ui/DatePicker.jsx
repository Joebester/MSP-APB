import { useState, useRef, useEffect, useCallback } from 'react';

const CURRENT_YEAR = new Date().getFullYear();
const MAX_YEAR = CURRENT_YEAR + 50;
const YEARS = Array.from({ length: MAX_YEAR - 1900 + 1 }, (_, i) => 1900 + i).reverse();

function getDaysInMonth(month, year) {
  if (!month || !year) return 31;
  return new Date(year, month, 0).getDate();
}

function ScrollColumn({ items, value, onChange, formatLabel }) {
  const containerRef = useRef(null);
  const itemHeight = 44;
  const visibleCount = 5;
  const paddingItems = Math.floor(visibleCount / 2);

  const paddedItems = [
    ...Array(paddingItems).fill(null),
    ...items,
    ...Array(paddingItems).fill(null),
  ];

  const selectedIndex = items.indexOf(value);

  useEffect(() => {
    if (containerRef.current && selectedIndex >= 0) {
      containerRef.current.scrollTop = selectedIndex * itemHeight;
    }
  }, [value, selectedIndex]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const index = Math.round(containerRef.current.scrollTop / itemHeight);
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    if (items[clamped] !== value) {
      onChange(items[clamped]);
    }
  }, [items, value, onChange]);

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '50%', left: 4, right: 4,
        height: itemHeight, transform: 'translateY(-50%)',
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 8,
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: itemHeight * visibleCount,
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          position: 'relative', zIndex: 2,
        }}
      >
        {paddedItems.map((item, i) => (
          <div
            key={i}
            onClick={() => item !== null && onChange(item)}
            style={{
              height: itemHeight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              scrollSnapAlign: 'start',
              fontSize: 15,
              fontWeight: item === value ? 600 : 400,
              color: item === value ? '#16a34a' : item === null ? 'transparent' : '#6b7280',
              cursor: item !== null ? 'pointer' : 'default',
              transition: 'color 0.15s',
              userSelect: 'none',
            }}
          >
            {item !== null
              ? (formatLabel ? formatLabel(item) : String(item).padStart(2, '0'))
              : '·'}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DatePicker({ value, onChange, label, required }) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const wrapperRef = useRef(null);

  // sync จาก value ภายนอก → state
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-').map(Number);
      setYear(y);
      setMonth(m);
      setDay(d);
      if (!isTyping) {
        setInputText(
          `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`
        );
      }
    } else {
      if (!isTyping) setInputText('');
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const maxDay = getDaysInMonth(month, year);
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    if (day && day > maxDay) setDay(maxDay);
  }, [maxDay, day]);

  const handleInputChange = (e) => {
    setIsTyping(true);
    let raw = e.target.value;

    if (raw.length < inputText.length) {
      if (raw.endsWith('/')) raw = raw.slice(0, -1);
      setInputText(raw);
      return;
    }

    const digits = raw.replace(/\D/g, '');

    let formatted = '';
    if (digits.length <= 2) {
      formatted = digits;
    } else if (digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }

    setInputText(formatted);

    if (digits.length === 8) {
      const dNum = parseInt(digits.slice(0, 2));
      const mNum = parseInt(digits.slice(2, 4));
      const yNum = parseInt(digits.slice(4, 8));

      if (
        dNum >= 1 && dNum <= 31 &&
        mNum >= 1 && mNum <= 12 &&
        yNum >= 1900 && yNum <= MAX_YEAR
      ) {
        setDay(dNum);
        setMonth(mNum);
        setYear(yNum);
        onChange(`${yNum}-${String(mNum).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`);
      }
      setIsTyping(false);
    }
  };

  const handleInputBlur = () => {
    setIsTyping(false);
    if (value) {
      const [y, m, d] = value.split('-').map(Number);
      setInputText(`${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`);
    } else {
      setInputText('');
    }
  };

  const handleConfirm = () => {
    if (day && month && year) {
      const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onChange(iso);
      setInputText(`${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`);
    }
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="dd/mm/yyyy"
          maxLength={10}
          inputMode="numeric"
          className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-msp-green focus:ring-2 focus:ring-msp-green/20"
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-lg border border-gray-200 bg-gray-100 px-3 py-3 text-gray-500 transition hover:bg-gray-200"
          aria-label="Open date picker"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 9h18M8 2v4M16 2v4" />
          </svg>
        </button>
      </div>

      {open && (
        <div style={{
          position: 'absolute', zIndex: 50,
          top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '12px 8px 10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }}>
          <div style={{ display: 'flex', marginBottom: 4 }}>
            {['Day', 'Month', 'Year'].map((h) => (
              <span key={h} style={{
                flex: 1, textAlign: 'center',
                fontSize: 11, fontWeight: 500,
                color: '#9ca3af',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{h}</span>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #f3f4f6', margin: '0 4px' }} />

          <div style={{ display: 'flex' }}>
            <ScrollColumn items={days} value={day} onChange={setDay} />
            <div style={{ width: 1, background: '#f3f4f6', margin: '8px 0' }} />
            <ScrollColumn items={months} value={month} onChange={setMonth} />
            <div style={{ width: 1, background: '#f3f4f6', margin: '8px 0' }} />
            <ScrollColumn items={YEARS} value={year} onChange={setYear} formatLabel={(y) => String(y)} />
          </div>

          <div style={{ borderTop: '1px solid #f3f4f6', margin: '0 4px 10px' }} />

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full rounded-lg bg-msp-green py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}