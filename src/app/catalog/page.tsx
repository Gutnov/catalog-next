"use server"

import CompanyList from "@/components/catalog";
import {getCompanies} from "@/app/actions/company";

export default async function Catalog(){
    const companies = await getCompanies(1, 5);
    return (<>
        <h1 className="text-3xl font-bold mb-10">Каталог компаний</h1>
        <CompanyList companiesData={companies}/>
    </>)
}