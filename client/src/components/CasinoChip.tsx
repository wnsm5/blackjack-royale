import React from 'react';

interface CasinoChipProps {
  value: number | string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

const CHIP_STYLES: Record<string, { bg: string; border: string; ring: string; text: string }> = {
  '25': {
    bg: 'from-emerald-700 via-emerald-600 to-emerald-900',
    border: 'border-emerald-300',
    ring: 'ring-emerald-200/40',
    text: 'text-emerald-100',
  },
  '50': {
    bg: 'from-blue-700 via-blue-600 to-blue-900',
    border: 'border-blue-300',
    ring: 'ring-blue-200/40',
    text: 'text-blue-100',
  },
  '100': {
    bg: 'from-slate-900 via-slate-800 to-black',
    border: 'border-slate-300',
    ring: 'ring-slate-100/40',
    text: 'text-slate-100',
  },
  '250': {
    bg: 'from-purple-700 via-purple-600 to-purple-950',
    border: 'border-purple-300',
    ring: 'ring-purple-200/40',
    text: 'text-purple-100',
  },
  '500': {
    bg: 'from-rose-700 via-rose-600 to-rose-950',
    border: 'border-rose-300',
    ring: 'ring-rose-200/40',
    text: 'text-rose-100',
  },
  '1000': {
    bg: 'from-amber-600 via-yellow-500 to-amber-800',
    border: 'border-amber-200',
    ring: 'ring-yellow-100/50',
    text: 'text-amber-200 font-extrabold',
  },
  'MAX': {
    bg: 'from-red-600 via-rose-500 to-pink-900',
    border: 'border-white',
    ring: 'ring-white/50',
    text: 'text-white font-black tracking-wider',
  },
};

export const CasinoChip: React.FC<CasinoChipProps> = ({
  value,
  size = 'md',
  onClick,
  disabled = false,
}) => {
  const key = String(value);
  const style = CHIP_STYLES[key] || {
    bg: 'from-amber-600 via-yellow-500 to-amber-800',
    border: 'border-amber-300',
    ring: 'ring-amber-200/40',
    text: 'text-amber-100',
  };

  const sizeClasses = {
    sm: 'w-9 h-9 text-[11px] border-2',
    md: 'w-14 h-14 text-xs border-4 sm:w-16 sm:h-16 sm:text-sm',
    lg: 'w-20 h-20 text-base border-4',
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative rounded-full bg-gradient-to-br ${style.bg} ${style.border} border-dashed shadow-xl flex items-center justify-center select-none cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 ${sizeClasses}`}
    >
      {/* Outer Ribs / Edge Ring */}
      <div className={`absolute inset-1 rounded-full border border-white/20 ${style.ring}`} />
      
      {/* Inner Inlay Circle */}
      <div className="w-4/5 h-4/5 rounded-full bg-slate-950/70 backdrop-blur-xs border border-white/15 flex items-center justify-center shadow-inner">
        <span className={`font-black tracking-tight ${style.text}`}>
          {value}
        </span>
      </div>
    </button>
  );
};
