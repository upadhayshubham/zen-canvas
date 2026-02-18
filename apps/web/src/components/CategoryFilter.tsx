'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types';

interface Props { categories: Category[]; }

const CATEGORY_STYLES: Record<string, { active: string; inactive: string }> = {
  'wall-art': { active: 'bg-violet-600 text-white', inactive: 'border-violet-200 text-violet-600 hover:bg-violet-50' },
  'posters': { active: 'bg-fuchsia-600 text-white', inactive: 'border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-50' },
  'originals': { active: 'bg-rose-600 text-white', inactive: 'border-rose-200 text-rose-600 hover:bg-rose-50' },
  'gift-sets': { active: 'bg-amber-500 text-white', inactive: 'border-amber-200 text-amber-600 hover:bg-amber-50' },
};

export default function CategoryFilter({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('category') ?? '';

  const select = (slug: string) => router.push(slug ? `/?category=${slug}` : '/');

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap">
      <button onClick={() => select('')}
        className={`shrink-0 text-sm px-4 py-1.5 rounded-full border font-semibold transition-colors ${!current ? 'bg-purple-700 text-white border-purple-700' : 'border-purple-200 text-purple-600 hover:bg-purple-50'}`}>
        All
      </button>
      {categories.map(cat => {
        const style = CATEGORY_STYLES[cat.slug] ?? { active: 'bg-purple-600 text-white', inactive: 'border-purple-200 text-purple-600 hover:bg-purple-50' };
        return (
          <button key={cat.id} onClick={() => select(cat.slug)}
            className={`shrink-0 text-sm px-4 py-1.5 rounded-full border font-semibold transition-colors ${current === cat.slug ? style.active : style.inactive}`}>
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
