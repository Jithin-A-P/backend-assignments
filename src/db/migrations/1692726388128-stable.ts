import { MigrationInterface, QueryRunner } from "typeorm";

export class Stable1692726388128 implements MigrationInterface {
    name = 'Stable1692726388128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" integer NOT NULL, "status" character varying NOT NULL, "type" character varying NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "requested_by" integer NOT NULL, "requested_to" integer, "book_isbn" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_a0da9b4eb8be55bcb0a8d1b86f3" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_e1d5abddd82f2416df458e607eb" FOREIGN KEY ("requested_by") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_6635bfb1d9eb27d91c2b53f8d43" FOREIGN KEY ("requested_to") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_a8eef31f4639132b5ebeb17d26a" FOREIGN KEY ("book_isbn") REFERENCES "book"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_a8eef31f4639132b5ebeb17d26a"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_6635bfb1d9eb27d91c2b53f8d43"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_e1d5abddd82f2416df458e607eb"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_a0da9b4eb8be55bcb0a8d1b86f3"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
