"use client"

import {useEffect, useState, useCallback} from "react";
import {getCompanies} from "@/app/actions/company";
import Table from "@/components/table";
import {Company} from "@/types";

type Props = {
    companiesData: {
        list: Company[],
        totalPages: number
    }
}

export default function CompanyList({companiesData}: Props){
    const [page, setPage] = useState(1);
    const [companiesList, setCompaniesList] = useState(companiesData.list);
    const [totalPages, setTotalPages] = useState(companiesData.totalPages);
    
    const loadCompanies = useCallback(async () => {
        const data = await getCompanies(page, 5);
        setCompaniesList(data.list);
        setTotalPages(data.totalPages);
    }, [page]);

    useEffect(() => {
        if (page === 1 && companiesData.list.length > 0) {
            setCompaniesList(companiesData.list); 
            setTotalPages(companiesData.totalPages);
        } else {
            loadCompanies();
        }
    }, [page, loadCompanies, companiesData]);

    const changePage = (page: number)=>{        
        setPage(page)
    }

    return (<>
        <Table list={companiesList} onChangePage={changePage} totalPages={totalPages} page={page}/>
        </>)
}