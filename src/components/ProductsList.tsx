'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Input } from '@heroui/input';
import {Select, SelectItem} from '@heroui/select';

import {getProductsByCompanyId} from '@/actions/product';
import {PRODUCTS_LIMIT_OPTIONS, DEFAULT_PRODUCTS_LIMIT} from '@/settings';

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
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [limit, setLimit] = useState(DEFAULT_PRODUCTS_LIMIT);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastProductRef = useRef<HTMLDivElement | null>(null);
    

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    const onChangeLimit = (e) => {
        setLimit(e.target.value);
    }

    const onInputSearch = async (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setIsLoading(true);
        try {
            const data = await getProductsByCompanyId(companyId, page, limit, e.target.value)

            setProducts(data.products);
            setHasMore(data.hasMore);
            setPage(1);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const loadProducts = async (searchParam: string) => {      
        if (!hasMore || isLoading) return;

        setIsLoading(true);
        try {          
            const data = await getProductsByCompanyId(companyId, page, 20, searchParam)

            setProducts(prev => [...prev, ...data.products]);
            setHasMore(data.hasMore);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Наблюдатель за последним элементом
    useEffect(() => {      
        setTimeout(() => {
            const observer = new IntersectionObserver(
                async (entries) => {      
                    if (entries[0]?.isIntersecting && hasMore && !isLoading) {
                        await loadProducts(search);
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
        })
    }, [hasMore, page, isLoading]);

    return (
        <>
            <div className="flex gap-5">
                <Input
                    className="mb-5"
                    label="Поиск"
                    type="text"
                    onInput={onInputSearch}
                /> <Select className="max-w-xs" label="Продуктов на страницу" onChange={onChangeLimit}>
                    {PRODUCTS_LIMIT_OPTIONS.map((option: { key: string; label: string; }) => (
                        <SelectItem key={option.key}>{option.label}</SelectItem>
                    ))}
                </Select>
            </div>
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
                                <p className="text-gray-800 font-medium">idx: {index}: id: {product.id}. {product.name}</p>
                            </div>
                        )
                    })}
                    <div ref={lastProductRef}></div>
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