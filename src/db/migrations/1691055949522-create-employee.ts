import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployee1691055949522 implements MigrationInterface {
    name = 'CreateEmployee1691055949522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "age" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "age"`);
    }

}
