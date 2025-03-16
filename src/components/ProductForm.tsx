"use client"

import {Autocomplete, AutocompleteItem} from "@heroui/autocomplete";
import { useState, ChangeEvent, useCallback, useEffect } from "react";
import { Button } from "@heroui/button";
import {ProductDto} from "@/db/product";
import {createProductAction, getProductsAction, linkProductAction} from "@/actions/product";
import { debounce } from "@/helper";

type Props = {
    companyId: number;
    product?: { id?: number; name: string } | null;
    successHandler: () => void;
};

export default function ProductForm({ companyId, product, successHandler }: Props) {
    const [name, setName] = useState(product?.name ?? "");
    const [error, setError] = useState("");
    const [fetchedProducts, setFetchedProducts] = useState<ProductDto[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);

    const mapProducts = (products: ProductDto[]) => {
        return products.map(product => ({ key: product.id, label: product.name }));
    }

    useEffect(() => {
        if (selectedProduct && name !== selectedProduct?.name) {
            setSelectedProduct(null)
        }
    }, [name]);

    const handleSubmit = async (e: React.FormEvent) => {        
        e.preventDefault();
        if (!name.trim()) {
            setError("Название товара не может быть пустым");
            return;
        }
        setError("");

        if (selectedProduct) {            
           await linkProductAction(selectedProduct.id, companyId)
           setName('')
           setSelectedProduct(null)
           successHandler()
           return
        }
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        
        await createProductAction({ name }, companyId);
        setName('');
    };

    const onInputHandler = useCallback(async (value: string) => {        
        setName(value);
        if (!value.trim()) {
            setFetchedProducts([]);
            return;
        }
        const products = await getProductsAction(value);
        if (products && products.length) {
            setFetchedProducts(products);
        }
    }, []);
    const debouncedOnInputHandler = debounce(onInputHandler, 1000);
    const selectHandler = (key) => {
        const index = Number(key) - 1;
        const currentProduct = fetchedProducts[index];
        if (currentProduct && currentProduct.id) {
            setSelectedProduct(currentProduct);
            setName(currentProduct.name);
        }        
    }

    return (
        <div onClickCapture={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit} className="pb-5 pt-5">
            <Autocomplete
                allowsCustomValue
                className=" text-black mb-5"
                defaultItems={mapProducts(fetchedProducts)}
                label="Название товара"
                variant="flat"
                onInputChange={debouncedOnInputHandler}
                onSelectionChange={selectHandler}
            >
                {(item) => <AutocompleteItem key={item.key} className='text-black'>{item.label}</AutocompleteItem>}
            </Autocomplete>
            <Button
                disabled={!name.trim()}
                color="primary"
                type="submit"
                className="px-10 block mx-auto max-w-full w-full disabled:opacity-50"
            >
                {product ? "Обновить" : "Создать"}
            </Button>
        </form>
        </div>
    );
}