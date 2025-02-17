"use client"

import {useEffect, useState} from "react";
import {getCompanies} from "@/app/actions/company";

type Props = {
    initialCompanies: any[]
}

export default function CompanyList({initialCompanies}: Props){
    const [page, setPage] = useState(1);
    const [companies, setCompanies] = useState<any>(initialCompanies);

    const loadMoreHandler = async ()=>{
        const moreCompanies = await getCompanies(page, 3)
        setCompanies((companies: any)=>[...companies, ...moreCompanies])
    }

    useEffect(() => {
        if (page === 1){
            return
        }
        loadMoreHandler()
    }, [page]);

    return (<>
        <button onClick={()=>setPage(page + 1)}>loadMore</button>
        {companies.map(
            (c: any, index: number)=><p key={c.id}>{c.name}</p>)
        }
        </>)
}