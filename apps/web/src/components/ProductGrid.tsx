import { getProducts, getCategories } from '@/services/product.service';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';

interface Props {
  searchParams?: { category?: string; search?: string };
}

export default async function ProductGrid({ searchParams }: Props) {
  const [productsPage, categories] = await Promise.all([
    getProducts({
      search: searchParams?.search,
      size: 24,
    }),
    getCategories(),
  ]);

  const products = productsPage.content;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            {searchParams?.search ? `Results for "${searchParams.search}"` : 'All Products'}
          </h2>
          <p className="text-sm text-stone-400">{productsPage.totalElements} products</p>
        </div>
        <CategoryFilter categories={categories} />
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24 text-stone-400">
          <p className="text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination hint */}
      {productsPage.totalPages > 1 && (
        <p className="text-center text-sm text-stone-400 mt-8">
          Showing {products.length} of {productsPage.totalElements} products
        </p>
      )}
    </div>
  );
}
