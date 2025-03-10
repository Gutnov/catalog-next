import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize'
import sequelize from '@/app/db/db'
export type ProductDto = InferAttributes<Product>
export class Product extends Model<ProductDto, InferCreationAttributes<Product>> {
  declare id?: number
  declare name: string
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100)
  }
}, {
  sequelize,
  tableName: 'products',
  timestamps: true
})