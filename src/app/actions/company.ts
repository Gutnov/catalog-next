'use server'

import {Company, CompanyDto} from "@/app/db/company";

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

export const  createCompanyAction = async (data: { name: string, createdYear: number }): Promise<CompanyDto> => {
    if (!data.name) {
        throw new Error("Company name cannot be empty");
    }
    try {
        const newCompany = await Company.create({
            name: data.name,
            createdYear: data.createdYear
        });

        return newCompany.toJSON();
    } catch (error) {
        console.error("Ошибка при создании компании:", error);
        throw new Error("Something went wrong");
    }
}