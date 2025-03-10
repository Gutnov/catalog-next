import { config } from 'dotenv'
import { Sequelize } from 'sequelize'
import mysql2 from 'mysql2'

config()

export const dbOptions = {
  port: Number(process.env.DB_PORT) || 3306,
  host: 'localhost',
  username: process.env.DB_USER ?? '',
  password: process.env.DB_PWD ?? '',
  dialect: 'mysql',
  dialectModule: mysql2,
  database: process.env.DB_NAME ?? ''
}
const sequelize = new Sequelize(dbOptions)
export default sequelize
