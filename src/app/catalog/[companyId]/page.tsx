"use server"
import {getCompany} from "@/app/actions/company";
import Company from '@/components/Company'
export default async function CompanyPage({ params }: { params: { companyId: string } }) {
    const {companyId} = await params
    const company = await getCompany(companyId)

    return (
        <div>
            <Company company={company}/>
        </div>
    )
}
