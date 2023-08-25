import { MigrationInterface, QueryRunner } from "typeorm";

export class NotifChannel1692952049340 implements MigrationInterface {
    name = 'NotifChannel1692952049340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification_channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" uuid NOT NULL, "notification_channel" character varying NOT NULL, CONSTRAINT "PK_50b36f3daa5dd86f7e707740b23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cron_job" DROP CONSTRAINT "FK_5300ea6b4885d144505d3edf2b3"`);
        await queryRunner.query(`ALTER TABLE "cron_job" ALTER COLUMN "borrowed_book_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cron_job" ADD CONSTRAINT "FK_5300ea6b4885d144505d3edf2b3" FOREIGN KEY ("borrowed_book_id") REFERENCES "borrowed_book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_channel" ADD CONSTRAINT "FK_0698a1d27745703ba3787cf7dcf" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_channel" DROP CONSTRAINT "FK_0698a1d27745703ba3787cf7dcf"`);
        await queryRunner.query(`ALTER TABLE "cron_job" DROP CONSTRAINT "FK_5300ea6b4885d144505d3edf2b3"`);
        await queryRunner.query(`ALTER TABLE "cron_job" ALTER COLUMN "borrowed_book_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cron_job" ADD CONSTRAINT "FK_5300ea6b4885d144505d3edf2b3" FOREIGN KEY ("borrowed_book_id") REFERENCES "borrowed_book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "notification_channel"`);
    }

}
