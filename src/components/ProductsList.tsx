'use client';

import {useState, useEffect, useRef} from 'react';
import { Input } from '@heroui/input';

import {getProductsByCompanyId} from '@/actions/product';
import {debounce} from '@/helper';

interface Product {
  id: number;
  name: string;
}

interface ProductListProps {
  companyId: number;
  initialProducts: Product[];
  initialHasMore: boolean;
}

export default function ProductList ({ companyId, initialProducts, initialHasMore }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');

    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastProductRef = useRef<HTMLDivElement | null>(null);
    const intersectionObserver = useRef<IntersectionObserver | null>(null)

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    useEffect(() => {
        if (page===1){
            // initial products were rendered from server
            return
        }
        loadMore()
    }, [page, search]);

    useEffect(() => {
        intersectionObserver.current = new IntersectionObserver(
            async (entries) => {
                if (entries[0]?.isIntersecting) {
                    handleScrollIntersectionDebounced()
                }
            },
            {
                root: containerRef.current,
                rootMargin: '0px 0px 200px 0px',
                threshold: 0
            }
        );
        if (lastProductRef.current)
            intersectionObserver.current.observe(lastProductRef.current)
        return () => {
            intersectionObserver.current?.disconnect()
        };
    }, [products.length]);

    const loadMore = async () => {
        setIsLoading(true);
        try {
            const data = await getProductsByCompanyId(companyId, page, search);
            setProducts(prev=>[...prev, ...data.products]);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleScrollIntersectionDebounced = debounce(async ()=>{
        if (isLoading) {
            return
        }
        if (hasMore){
            setPage(page=>page+1)
        }
    }, 500)

    return (
        <>
            <div className="flex gap-5">
                <Input
                    className="mb-5"
                    label="Поиск"
                    type="text"
                    onInput={(e) => {
                        setProducts([])
                        setPage(1)
                        setSearch(e.target.value)
                    }}
                />
            </div>
            <div>Search: {search}</div>
            <div>Page: {page}. Hasmore: {String(hasMore)}</div>
            <div>Products number: {products.length}</div>
            {products.length > 0 && <div
                ref={containerRef}
                className="h-[600px] overflow-y-auto border border-gray-200 rounded-lg p-4"
            >
                <div className="space-y-4">
                    {products.map((product, index) => {
                        return (
                            <div
                                key={product.id}
                                className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                            >
                                <p className="text-gray-800 font-medium">idx: {index}:
                                    id: {product.id}. {product.name}</p>
                            </div>
                        )
                    })}
                    <div ref={lastProductRef}>last</div>
                    {isLoading && (
                        <div className="p-4 text-center text-gray-500">
                            Загрузка...
                        </div>
                    )}
                </div>
            </div>}
            {!products.length && <h2 className='text-center text-2xl'>Нет товаров</h2>}
        </>
    );
};