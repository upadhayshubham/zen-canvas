'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types';

interface Props { categories: Category[]; }

export default function CategoryFilter({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('category') ?? '';

  const select = (slug: string) => {
    router.push(slug ? `/?category=${slug}` : '/');
  };

  if (categories.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <button onClick={() => select('')}
        className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-colors ${!current ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:border-stone-400'}`}>
        All
      </button>
      {categories.map(cat => (
        <button key={cat.id} onClick={() => select(cat.slug)}
          className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-colors ${current === cat.slug ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:border-stone-400'}`}>
          {cat.name}
        </button>
      ))}
    </div>
  );
}
