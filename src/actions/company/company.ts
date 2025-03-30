'use server'

import { Op, WhereOptions } from 'sequelize'
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

import {DEFAULT_COMPANIES_LIMIT} from '@/settings';
import { ProductCompany } from '@/db/product-company';
import {Company, CompanyDto} from '@/db/company';
import {CompanyFormErrors} from '@/types';
import {ValidationError} from '@/errors';
import {cleanCompanyFormData} from '@/actions/company/form-cleaners';

export const getCompaniesAction = async (page: number, limit: number): Promise<{companies: CompanyDto[], totalCount: number}> => {
    if (page < 1) throw new Error('Page Not Found');
    const {rows, count} =  await Company.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
    })

    return {
        companies: rows.map(row=>({id: row.id, name: row.name, createdYear: row.createdYear, logoPath: row.logoPath})),
        totalCount: count
    }
}

export const getCompanyAction = async (id: string): Promise<CompanyDto> => {
    const company= await Company.findByPk(id)
    if (!company) {
        throw new ValidationError('Company not found')
    }
    return company.toJSON()
}


export const  companyFormAction = async (
        formState: CompanyFormErrors,
        formData: FormData): Promise<CompanyFormErrors> => {

    let companyId
    try {
        const companyData = await cleanCompanyFormData(formData)
        if (companyData.id) {
            await Company.update(companyData, {where: {id: companyData.id}})
            companyId = companyData.id
        } else {
            const newCompany  = await Company.create(companyData);
            companyId = newCompany.id;
        }


    } catch (error) {
        if (error instanceof ValidationError) {
            return { nameError: 'Компания с таким именем уже существует' }
        }
        console.error('Internal error on companyFormAction', error)
        throw error
    }

    revalidatePath('/catalog')
    redirect(`/catalog/${companyId}`)
}

export async function getCompaniesByProductId(productId: number, page: number = 1, search: string = '') {
    const offset = (page - 1) * DEFAULT_COMPANIES_LIMIT;

    const companyWhere: WhereOptions<Company> = {};
    if (search) {
        companyWhere.name = { [Op.substring]: search }; // Поиск по подстроке
    }

    const {count, rows: links} = await ProductCompany.findAndCountAll({
        where: {productId},
        limit: DEFAULT_COMPANIES_LIMIT,
        offset,
        include: [
            { model: Company, as: 'company'}
        ],
        order: [[{model: Company, as: 'company'}, 'name', 'ASC']]
    })

    return {
        totalCount: count,
        companies: links.map(link=>{
            if (!link.company) throw new Error('Not correct used include')
            return { id: link.company.id, name: link.company.name }
        })
    }
}