'use server'

import {Company, CompanyDto} from "@/app/db/company";

import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {validateFormData} from "@/utils";

import {CompanyFormErrors} from "@/types";

// export const getCompany = (id: number): Promise<CompanyDto> =>{
//     // todo
// }

export const getCompanies = async (page: number, limit: number): Promise<{companies: CompanyDto[], totalCount: number}> => {
    if (page < 1) throw new Error("Page Not Found");
    const {rows, count} =  await Company.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
    })

    return {
        companies: rows.map(row=>({id: row.id, name: row.name, createdYear: row.createdYear, logoPath: row.logoPath})),
        totalCount: count
    }
}


export const  createCompanyAction = async (
    formState: CompanyFormErrors,
    formData: FormData): Promise<CompanyFormErrors> => {

    
    const companyData = await validateFormData(formData)
    if ('error' in companyData) {
       throw new Error('Ощибка при создании компании')
    }
    
    const newCompany = await Company.create(companyData);
    revalidatePath('/catalog')
    redirect(`/catalog/${newCompany.id}`)
}

export const updateCompanyAction = async (
    formState: CompanyFormErrors,
    formData: FormData): Promise<CompanyFormErrors> => {
    const companyData = await validateFormData(formData)
    Company.update(companyData, {where: {id: companyData.id}})
}