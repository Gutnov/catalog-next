import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import sequelize from '@/db/db'
export type CompanyDto = InferAttributes<Company>

export class Company extends Model<CompanyDto, InferCreationAttributes<Company>> {
  declare id: CreationOptional<number>
  declare name: string
  declare createdYear: number
  declare logoPath: string
}

Company.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100)
  },
  logoPath: {
    type: DataTypes.STRING(100),
    defaultValue: ''
  },
  createdYear: {
    type: DataTypes.INTEGER,
    defaultValue: new Date().getFullYear(),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'companies',
  timestamps: true
})