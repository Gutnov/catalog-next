import { Product } from "@/app/db/product";
import { Company } from "@/app/db/company";
import { ProductCompany } from "@/app/db/product-company";
export async function getProductsByCompanyId(companyId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const result = await Product.findAndCountAll({
        include: {
            model: Company,
            through: { attributes: [] },
            where: { id: companyId },
        },
        limit,
        offset,
    });

    return {
        products: result.rows.map(product => ({ name: product.name, id: product.id })),
        hasMore: offset + result.rows.length < result.count,
        count: result.count,
    };
}


export const createOrUpdateProduct = async (productData: { name: string }, companyId: number) => {
  const product = await Product.create({ name: productData.name })
  
  await ProductCompany.create({
    productId: product.id,
    companyId: companyId
  })

  return product
}
