import { Company } from '@/db/company'
import { Product } from '@/db/product'
import { ProductCompany } from '@/db/product-company'
import sequelize from '@/db/db'

const runDbSync = async () => {
  const registeredModels = [Company, Product, ProductCompany]
  console.warn('Syncing DB schema for: ', registeredModels.map(m => m.name).join(', '))
  await sequelize.sync({ alter: true })
  console.warn('...done syncing DB schema')
}

runDbSync()