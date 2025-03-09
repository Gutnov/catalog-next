"use server"

import {getCompany} from "@/app/actions/company";

export default async function CompanyPage({ params }) {
    const {companyId} = await params
    const company = await getCompany(companyId)
    return (
        <div>
            <h1 className='text-xl font-bold'>Company id:  {companyId}</h1>
            <img src={`${company.logoPath}`} alt=""/>
            <p> Name: {company.name}</p>
        </div>
    )
}
