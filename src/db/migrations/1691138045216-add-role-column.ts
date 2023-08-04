import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleColumn1691138045216 implements MigrationInterface {
    name = 'AddRoleColumn1691138045216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "role" character varying NOT NULL DEFAULT 'DEVELOPER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "role"`);
    }

}
