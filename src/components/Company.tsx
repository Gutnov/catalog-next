"use client"

import { Button } from '@heroui/button';
import { useState } from 'react';

import {CompanyDto} from "@/db/company";
import ProductList from '@/components/ProductsList';
import { PlusIcon } from '@/components/icons/plusIcon';
import ModalComponent from "@/components/ModalComponent";
import ProductForm from '@/components/ProductForm';
import { ProductDto } from '@/db/product';

export default function Company({ company, products, initialHasMore, initialIsOpen = false }: { company: CompanyDto, products: ProductDto[], initialHasMore:boolean, initialIsOpen?:boolean }) {
    const [isOpen, setIsOpen] = useState(initialIsOpen);
    const [selectedProduct, setSelectedProduct] = useState<ProductDto|null>();

    const openProductForm = (product: ProductDto | null) => {
        setSelectedProduct(product);
        setIsOpen(true);
    };

    return (
        <div>
            <ModalComponent isOpen={isOpen} onOpenChange={setIsOpen} title={selectedProduct ? 'Редактирование товара' : 'Добавление товара'}>
                <ProductForm companyId={Number(company.id)} product={selectedProduct} successHandler={() => setIsOpen(false)} />
            </ModalComponent>
            <div className="flex justify-between">
                <h1 className='text-xl font-bold mb-10 text-center'>Company id:  {company.id}</h1>
                <Button onPress={() => openProductForm(null)} color='secondary' className='mb-5'>
                    Добавить товар
                    <PlusIcon/>
                </Button>
            </div>
            {/*<img src={`${company.logoPath}`} alt=""/>*/}
            <ProductList companyId={Number(company.id)} initialProducts={products} initialHasMore={initialHasMore}/>
        </div>
    )
}
