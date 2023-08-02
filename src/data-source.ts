import { DataSource } from 'typeorm';
import Employee from './models/employee';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 8765,
  username: "postgres",
  password: "postgres",
  database: "training",
  entities: [Employee],
  logging: true,
  namingStrategy: new SnakeNamingStrategy()
});
