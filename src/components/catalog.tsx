"use client"

import Table from "@/components/table";
import {CompanyDto} from "@/app/db/company";
import {usePathname, useSearchParams, useRouter} from "next/navigation";

type Props = {
    companies: CompanyDto[];
    totalCount: number;
}

export default function CompanyList({companies, totalCount}: Props){
    const queryParams = useSearchParams();

    const page = queryParams.get("page")
        ? Number(queryParams.get("page"))
        : 1

    const itemsPerPage = queryParams.get("itemsPerPage")
        ? Number(queryParams.get("itemsPerPage"))
        : 5

    const router = useRouter()
    const pathname = usePathname()

    const changePage = (page: number)=>{
        const searchParams = queryParams ?
            new URLSearchParams(queryParams.toString()) :
            new URLSearchParams()

        searchParams.set("page", String(page))
        router.push(pathname + "?" + searchParams.toString());
    }

    return (<>
        <Table list={companies} onChangePage={changePage} totalPages={Math.ceil(totalCount/itemsPerPage)} page={page}/>
        </>)
}