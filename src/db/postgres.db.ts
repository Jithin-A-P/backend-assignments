import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../.env' })

import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import Employee from '../entity/employee.entity'
import Address from '../entity/address.entity'
import Department from '../entity/department.entity'
import Book from '../entity/book.entity'
import Shelf from '../entity/shelf.entity'
import BookShelfJn from '../entity/book-shelf-jn.entity'
import BorrowedBook from '../entity/borrowed-book.entity'
import Notification from '../entity/notification.entity'

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [Employee, Address, Department, Book, Shelf, BookShelfJn, BorrowedBook, Notification],
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'],
})

export default dataSource
