"use server"

import CompanyList from "@/components/Catalog";
import {getCompaniesAction} from "@/actions/company/company";

type Props = {
    searchParams: Promise<{page?: string, itemsPerPage?: string}>
}

export default async function Catalog({searchParams}: Props){

    const {page = 1, itemsPerPage = 5} = await searchParams

    const {companies, totalCount} = await getCompaniesAction(Number(page), Number(itemsPerPage));
    return (<>
        <h1 className="text-3xl font-bold mb-10">Каталог компаний</h1>
        <CompanyList
            companies={companies}
            totalCount={totalCount}
        />
    </>)
}