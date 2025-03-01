'use server'

import {Company, CompanyDto} from "@/app/db/company";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

export const getCompanies = async (page: number, limit: number): Promise<{companies: CompanyDto[], totalCount: number}> => {
    if (page < 1) throw new Error("Page Not Found");
    const {rows, count} =  await Company.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
    })

    return {
        companies: rows.map(row=>({id: row.id, name: row.name, createdYear: row.createdYear})),
        totalCount: count
    }
}


type CompanyFormErrors = {
    name?: string,
    year?: string,
    error?: string,
}

export const  createCompanyAction = async (
    formState: CompanyFormErrors,
    formData: FormData): Promise<CompanyFormErrors> => {
    // if (!data.name) {
    //     throw new Error("Company name cannot be empty");
    // }

    const name = formData.get("name")
    const year = Number(formData.get("createdYear"))

    console.log('formState', formData)
    if (!name || name && typeof name === "string" && name.length < 5) {
        return {
            name: 'Too short name'
        }
    }
    if (! year || year < 1900){
        return {
            year: 'Impossible year'
        }
    }
    let newCompany
    try {
        const existingCompany = await Company.findOne({
            where: { name },
        });

        if (existingCompany) {
            return {
                error: 'Компания с таким названием уже существует',
            };
        }
        newCompany = await Company.create({
            name: name,
            createdYear: year
        });
        console.log('newCompany', newCompany.id)
    } catch (error) {
        console.error("Ошибка при создании компании:", error);
        return {
            error: "Unexpected error on company creation"
        }
        // throw new Error("Ошибка при создании компании");
    }
    revalidatePath('/catalog')
    redirect(`/catalog/${newCompany.id}`)

}