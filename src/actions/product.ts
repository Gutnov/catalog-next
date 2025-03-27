'use server'

import { Op, WhereOptions } from 'sequelize'
import {revalidatePath} from 'next/cache';

import { Product } from '@/db/product';
import { ProductCompany } from '@/db/product-company';
import {DEFAULT_PRODUCTS_LIMIT} from '@/settings';

export async function getProductsByCompanyId(companyId: number, page: number = 1, search: string = '') {
    const offset = (page - 1) * DEFAULT_PRODUCTS_LIMIT;

    // const {count, rows: links} = await ProductCompany.findAndCountAll({where: {companyId}, limit, offset})
    // const products = await Product.findAll({where: {id: {[Op.in]: links.map(link=>link.productId)}}})
    const productWhere: WhereOptions<Product> = {};
    if (search) {
        productWhere.name = { [Op.substring]: search }; // Поиск по подстроке
    }

    const {count, rows: links} = await ProductCompany.findAndCountAll({
        logging: false,
        where: {companyId},
        limit: DEFAULT_PRODUCTS_LIMIT,
        offset,
        include: [
            { model: Product, as: 'product', where: productWhere }
        ],
        order: [[{model: Product, as: 'product'}, 'name', 'ASC']]
    })

    console.log('getProductsByCompanyId', offset, links.length, count, offset + links.length <= count)

    return {
        products: links.map(link=>{
            if (!link.product) throw new Error('Not correct used include')
            return { id: link.product.id, name: link.product.name }
        }),
        hasMore: offset + links.length < count,
        count: 2,
    };
}


export async function getProductsAction(search: string = '') {
    const where: WhereOptions<Product> = {}
    if (search) {
        where.name = { [Op.substring]: search }
    }
    const result = await Product.findAll({
        where,
        limit: 20
    });
    return result.map(product => ({ name: product.name, id: product.id }))
}

export const createProductAction = async (productData: { name: string }, companyId: number) => {
    const product = await Product.create({ name: productData.name })

    await ProductCompany.create({
        productId: product.id,
        companyId: companyId
    })
    revalidatePath(`/catalog/${companyId}`)
}

export const linkProductAction = async (productId: number, companyId: number) => {
    console.log(productId, companyId);

    await ProductCompany.create({
        productId: productId,
        companyId: companyId
    })
    revalidatePath(`/catalog/${companyId}`)
}