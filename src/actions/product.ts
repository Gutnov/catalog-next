'use server'

import { Product } from "@/db/product";
import { ProductCompany } from "@/db/product-company";
import { Op, WhereOptions } from 'sequelize'
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function getProductsByCompanyId(companyId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    // const {count, rows: links} = await ProductCompany.findAndCountAll({where: {companyId}, limit, offset})
    // const products = await Product.findAll({where: {id: {[Op.in]: links.map(link=>link.productId)}}})

    const {count, rows: links} = await ProductCompany.findAndCountAll({
        logging: false,
        where: {companyId}, limit, offset,
        include: [
            { model: Product, as: "product" }
        ],
        order: [[{model: Product, as: "product"}, "name", "ASC"]]
    })

    return {
        products: links.map(link=>({id: link.product.id, name: link.product.name})),
        hasMore: offset + links.length <count,
        count: 2,
    };
}


export async function getProductsAction(search: string = "") {
  const where: WhereOptions<Product> = {}
  if (search) {
    where.name = { [Op.substring]: search }
  }
  const result = await Product.findAll({
      where,
      limit: 20
  });
  console.log('get products action')
  return result.map(product => ({ name: product.name, id: product.id }))
}

export const createProductAction = async (productData: { name: string }, companyId: number) => {
  const product = await Product.create({ name: productData.name })

  await ProductCompany.create({
    productId: product.id,
    companyId: companyId
  })
    revalidatePath(`/catalog/${companyId}`)
    redirect(`/catalog/${companyId}`)

    // return { id: product.id, name: product.name };
}

export const linkProductAction = async (productId: number, companyId: number) => {
  console.log(productId, companyId);

  await ProductCompany.create({
    productId: productId,
    companyId: companyId
  })
  revalidatePath(`/catalog/${companyId}`)
    redirect(`/catalog/${companyId}`)

}