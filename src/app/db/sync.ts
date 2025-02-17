import { Company } from '@/app/db/company'
import sequelize from '@/app/db/db'


const runDbSync = async () => {
  const registeredModels = [Company]
  console.warn('Syncing DB schema for: ', registeredModels.map(m => m.name).join(', '))
  await sequelize.sync({ alter: true })
  console.warn('...done syncing DB schema')
}

runDbSync()
