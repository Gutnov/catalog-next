'use client'

import {Autocomplete, AutocompleteItem} from '@heroui/autocomplete';
import { useState, useCallback, useEffect, Key } from 'react';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';

import {ProductDto} from '@/db/product';
import {createProductAction, getProductsAction, linkProductAction} from '@/actions/product';
import { debounce } from '@/helper';

type Props = {
    companyId: number;
    product?: { id?: number; name: string } | null;
    successHandler: () => void;
};

export default function ProductForm({ companyId, product, successHandler }: Props) {
    const router = useRouter();

    const [autocompleteQuery, setAutocompleteQuery] = useState(product?.name ?? '');
    const [error, setError] = useState('');
    const [autocompleteOptions, setAutocompleteOptions] = useState<ProductDto[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);

    const mapProducts = (products: ProductDto[]) => {
        return products.map(product => ({ key: product.id, label: product.name }));
    }

    useEffect(() => {
        if (selectedProduct && autocompleteQuery !== selectedProduct?.name) {
            setSelectedProduct(null)
        }
    }, [autocompleteQuery]);

    useEffect(() => {
        debouncedOnInputHandler(autocompleteQuery)
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!autocompleteQuery.trim()) {
            setError('Название товара не может быть пустым');
            return;
        }
        setError('');

        if (selectedProduct) {
            await linkProductAction(selectedProduct.id, companyId)
        } else {
            await createProductAction({ name: autocompleteQuery }, companyId);
        }
        // window.location.reload()
        router.refresh()
        setAutocompleteQuery('')
        setSelectedProduct(null)
        successHandler()
    };

    const onInputHandler = useCallback(async (query: string) => {
        setAutocompleteQuery(query);
        const products = await getProductsAction(query.trim());
        setAutocompleteOptions(products);
    }, []);
    const debouncedOnInputHandler = debounce(onInputHandler, 1000);
    const selectHandler = (key: Key | null) => {
        if (key === null) return;
        const currentProduct = autocompleteOptions.find(product => product.id === Number(key));
        if (currentProduct && currentProduct.id) {            
            setSelectedProduct(currentProduct);
            setAutocompleteQuery(currentProduct.name);
        }
    }

    return (
        <div onClickCapture={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit} className="pb-5 pt-5">
                <Autocomplete
                    allowsCustomValue
                    className=" text-black mb-5"
                    defaultItems={mapProducts(autocompleteOptions)}
                    label="Название товара"
                    variant="flat"
                    onInputChange={debouncedOnInputHandler}
                    onSelectionChange={selectHandler}
                >
                    {(item) => <AutocompleteItem key={item.key} className='text-black'>{item.label}</AutocompleteItem>}
                </Autocomplete>
                <Button
                    disabled={!autocompleteQuery.trim()}
                    color="primary"
                    type="submit"
                    className="px-10 block mx-auto max-w-full w-full disabled:opacity-50"
                >
                    {product ? 'Обновить' : 'Создать'}
                </Button>
            </form>
        </div>
    );
}