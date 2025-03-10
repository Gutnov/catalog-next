// components/ProductList.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface Product {
  id: number;
  name: string;
}

interface ProductListProps {
  companyId: number;
}

export default function ProductList ({ companyId }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  const loadProducts = async () => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products?companyId=${companyId}&page=${page}`);
      const data = await response.json();
      
      setProducts(prev => [...prev, ...data.products]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadProducts();
    }
  }, [companyId]);

  // Наблюдатель за последним элементом
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          loadProducts();
        }
      },
      { 
        root: containerRef.current,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0
      }
    );

    if (lastProductRef.current) observer.observe(lastProductRef.current);

    return () => observer.disconnect();
  }, [hasMore, page, isLoading]);

  return (
    <div 
      ref={containerRef}
      className="h-[600px] overflow-y-auto border border-gray-200 rounded-lg p-4"
    >
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            ref={index === products.length - 1 ? lastProductRef : null}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <p className="text-gray-800 font-medium">{product.name}</p>
          </div>
        ))}
        {isLoading && (
          <div className="p-4 text-center text-gray-500">
            Загрузка...
          </div>
        )}
      </div>
    </div>
  );
};