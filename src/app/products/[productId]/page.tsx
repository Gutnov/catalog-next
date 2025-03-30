'use server'

import CompaniesListForProduct from '@/components/CompaniesListForProduct';
import {getCompaniesByProductId} from '@/actions/company/company';


export default async function Products({ params }: { params: { productId: string } }){
    const {productId} = await params
    const {companies, totalCount} = await getCompaniesByProductId(Number(productId));
    return (<>
        <h1 className="text-3xl font-bold mb-10">Продукт {productId}</h1>
        <CompaniesListForProduct
            companies={companies}
            totalCount={totalCount}
        />
    </>)
}