import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPassword1691125896707 implements MigrationInterface {
    name = 'AddPassword1691125896707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "password"`);
    }

}
