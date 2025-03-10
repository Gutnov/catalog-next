"use server"

import {getCompanyAction} from "@/app/actions/company/company";
import Company from '@/components/Company'
import {getProductsByCompanyId} from "@/app/actions/product";

export default async function CompanyPage({ params }: { params: { companyId: string } }) {
    const {companyId} = await params
    const company = await getCompanyAction(companyId)

    const companyProducts = await getProductsByCompanyId(Number(companyId))

    return (
        <div>
            <Company company={company} products={companyProducts.products} />
        </div>
    )
}
