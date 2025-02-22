'use server'

import {Company} from "@/app/db/company";
import { create } from 'domain';

export const getCompanies = async (page: number, limit: number) => {
    if (page < 1) throw new Error("Page Not Found");
    const {rows} =  await Company.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
    })
    
    return {
        list: rows.map(row=>({id: row.id, name: row.name, createdYear: row.createdYear})),
        totalPages: rows.length - 1
    }
}