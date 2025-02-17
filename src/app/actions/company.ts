'use server'

import {Company} from "@/app/db/company";

export const getCompanies = async (page: number, limit: number) => {
    if (page < 1) throw new Error("Page Not Found");
    const {rows, count} =  await Company.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
    })
    return rows.map(row=>({id: row.id, name: row.name}))
}