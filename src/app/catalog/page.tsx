"use server"

import CompanyList from "@/components/catalog";
import {getCompanies} from "@/app/actions/company";

export default async function Catalog(){
    const companies = await getCompanies(1, 3);
    return (<>
        <div>Hello catalog page!</div>
        <CompanyList initialCompanies={companies}/>
    </>)
}