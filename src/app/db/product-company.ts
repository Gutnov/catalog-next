import { Model, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes } from 'sequelize'
import sequelize from '@/app/db/db'
import { Company } from '@/app/db/company'
import { Product } from '@/app/db/product'

export class ProductCompany extends Model<InferAttributes<ProductCompany>, InferCreationAttributes<ProductCompany>> {
  declare productId: ForeignKey<Product['id']>
  declare companyId: ForeignKey<Company['id']>
}

ProductCompany.init({
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id'
    },
    onDelete: 'CASCADE',
    primaryKey: true
  },
  companyId: {
    type: DataTypes.INTEGER,
    references: {
      model: Company,
      key: 'id'
    },
    onDelete: 'CASCADE',
    primaryKey: true
  }
}, {
  sequelize,
  tableName: 'product_companies',
  timestamps: false
})

Company.belongsToMany(Product, {
    through: ProductCompany,
    foreignKey: 'companyId',
    otherKey: 'productId'
})

Product.belongsToMany(Company, {
    through: ProductCompany,
    foreignKey: 'productId',
    otherKey: 'companyId'
})