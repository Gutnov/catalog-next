'use server'

import { Product } from "@/db/product";
import { Company } from "@/db/company";
import { ProductCompany } from "@/db/product-company";
import { Op, WhereOptions } from 'sequelize'
import {revalidatePath} from "next/cache";
export async function getProductsByCompanyId(companyId: number, page: number = 1, limit: number = 20, search: string = "") {
    const offset = (page - 1) * limit;
    const where: WhereOptions<Product> = {}
    if (search) {
      where.name = { [Op.substring]: search }
    }
    const result = await Product.findAndCountAll({
        where,
        include: {
            model: Company,
            through: { attributes: [] },
            attributes: ['id', 'name'],
            where: { id: companyId },
        },
        limit,
        offset,
    });

    return {
        products: result.rows.map(product => product.toJSON()),
        hasMore: offset + result.rows.length < result.count,
        count: result.count,
    };
}


export async function getProductsAction(search: string = "") {
  const where: WhereOptions<Product> = {}
  if (search) {
    where.name = { [Op.substring]: search }
  }
  const result = await Product.findAll({
      where,
  });

  return result.map(product => ({ name: product.name, id: product.id }))
}

export const createProductAction = async (productData: { name: string }, companyId: number) => {
  const product = await Product.create({ name: productData.name })

  await ProductCompany.create({
    productId: product.id,
    companyId: companyId
  })

  return { id: product.id, name: product.name };
}

export const linkProductAction = async (productId: number, companyId: number) => {
  console.log(productId, companyId);
  
  await ProductCompany.create({
    productId: productId,
    companyId: companyId
  })
  await revalidatePath(`/catalog/${companyId}`)
}