import { Model, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes } from 'sequelize'

import sequelize from '@/db/db'
import { Company } from '@/db/company'
import { Product } from '@/db/product'

export class ProductCompany extends Model<InferAttributes<ProductCompany>, InferCreationAttributes<ProductCompany>> {
    declare productId: ForeignKey<Product['id']>
    declare companyId: ForeignKey<Company['id']>
    declare product?: Product
}

ProductCompany.init({
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        },
        onDelete: 'CASCADE',
    // primaryKey: true
    },
    companyId: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'id'
        },
        onDelete: 'CASCADE',
    // primaryKey: true
    }
}, {
    sequelize,
    tableName: 'product_companies',
    timestamps: false,
    indexes: [{
        name: 'product_company_unique',
        fields: ['productId', 'companyId'],
        unique: true
    }]
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

ProductCompany.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
});

ProductCompany.belongsTo(Company, {
    foreignKey: 'companyId',
    as: 'company'
});