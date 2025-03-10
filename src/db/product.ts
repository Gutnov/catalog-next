import {Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize'
import sequelize from '@/db/db'
export type ProductDto = InferAttributes<Product>
export class Product extends Model<ProductDto, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>
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