import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDepartment1691302731575 implements MigrationInterface {
    name = 'AddDepartment1691302731575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "joining_date" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "joining_date"`);
    }

}
