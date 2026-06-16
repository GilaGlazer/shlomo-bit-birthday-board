import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}

export default function Pagination({ page, totalPages, total, limit, onPage }: Props) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  const withEllipsis: (number | '…')[] = [];
  let prev: number | null = null;
  for (const p of pages) {
    if (prev !== null && p - prev > 1) withEllipsis.push('…');
    withEllipsis.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-xs text-zinc-500">
        Showing <span className="text-zinc-300">{from}–{to}</span> of{' '}
        <span className="text-zinc-300">{total}</span> people
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
        </button>

        {withEllipsis.map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="px-1.5 text-zinc-600 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                page === p
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
