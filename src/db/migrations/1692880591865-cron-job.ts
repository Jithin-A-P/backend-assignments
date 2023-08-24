import { MigrationInterface, QueryRunner } from "typeorm";

export class CronJob1692880591865 implements MigrationInterface {
    name = 'CronJob1692880591865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cron_job" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" uuid NOT NULL, "borrowed_book_id" uuid, CONSTRAINT "REL_5300ea6b4885d144505d3edf2b" UNIQUE ("borrowed_book_id"), CONSTRAINT "PK_3f180d097e1216411578b642513" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cron_job" ADD CONSTRAINT "FK_5300ea6b4885d144505d3edf2b3" FOREIGN KEY ("borrowed_book_id") REFERENCES "borrowed_book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cron_job" ADD CONSTRAINT "FK_9170c4c2ad08627188a54d8ae78" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cron_job" DROP CONSTRAINT "FK_9170c4c2ad08627188a54d8ae78"`);
        await queryRunner.query(`ALTER TABLE "cron_job" DROP CONSTRAINT "FK_5300ea6b4885d144505d3edf2b3"`);
        await queryRunner.query(`DROP TABLE "cron_job"`);
    }

}
