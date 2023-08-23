import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertToUuid1692782851408 implements MigrationInterface {
    name = 'ConvertToUuid1692782851408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" uuid NOT NULL, "status" character varying NOT NULL, "type" character varying NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "requested_by" uuid NOT NULL, "requested_to" uuid, "book_isbn" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "isbn" character varying NOT NULL, "title" character varying NOT NULL, "author" character varying NOT NULL, "category" character varying NOT NULL, "description" character varying, "publisher" character varying, "release_date" character varying, "thumbnail_url" character varying, "total_count" integer NOT NULL, "available_count" integer NOT NULL, CONSTRAINT "UQ_bd183604b9c828c0bdd92cafab7" UNIQUE ("isbn"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_shelf_jn" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "shelf_code" character varying NOT NULL, "book_isbn" character varying NOT NULL, "book_count" integer NOT NULL, CONSTRAINT "PK_0fe4d2c6aeec6ac16dfd8356190" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shelf" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "shelf_code" character varying NOT NULL, "location" character varying NOT NULL, CONSTRAINT "UQ_de0478c3e7f3d89ed2f91dd6725" UNIQUE ("shelf_code"), CONSTRAINT "PK_da2ce57e38dfc635d50d0e5fc8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "borrowed_book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" uuid NOT NULL, "book_isbn" character varying NOT NULL, "shelf_borrowed_from" character varying NOT NULL, "shelf_returned_to" character varying, "borrowed_at" character varying NOT NULL, "returned_at" character varying, CONSTRAINT "PK_4c9f6ded12afd45e3b2492f3b58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_7e77f562043393b08de949b804b"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "REL_7e77f562043393b08de949b804"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "employee_id" uuid`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "UQ_7e77f562043393b08de949b804b" UNIQUE ("employee_id")`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_d62835db8c0aec1d18a5a927549"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "PK_9a2213262c1593bffb581e382f5"`);
        await queryRunner.query(`ALTER TABLE "department" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "department" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "department_id"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "department_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_7e77f562043393b08de949b804b" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_a0da9b4eb8be55bcb0a8d1b86f3" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_e1d5abddd82f2416df458e607eb" FOREIGN KEY ("requested_by") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_6635bfb1d9eb27d91c2b53f8d43" FOREIGN KEY ("requested_to") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_a8eef31f4639132b5ebeb17d26a" FOREIGN KEY ("book_isbn") REFERENCES "book"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "FK_3ea08526e10844c330fbbdc8b70" FOREIGN KEY ("shelf_code") REFERENCES "shelf"("shelf_code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "FK_19408f367519a83586bbcc7c377" FOREIGN KEY ("book_isbn") REFERENCES "book"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "FK_1262ccd74454b87d67e3da4d543" FOREIGN KEY ("shelf_borrowed_from") REFERENCES "shelf"("shelf_code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "FK_2ca0ed7cbd6e3b7867dc7215ca6" FOREIGN KEY ("shelf_returned_to") REFERENCES "shelf"("shelf_code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "FK_ea7890e7c2ea260306f11a5b7fb" FOREIGN KEY ("book_isbn") REFERENCES "book"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "FK_8947df3fa66e9f26225b24d6ff6" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_d62835db8c0aec1d18a5a927549" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_d62835db8c0aec1d18a5a927549"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "FK_8947df3fa66e9f26225b24d6ff6"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "FK_ea7890e7c2ea260306f11a5b7fb"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "FK_2ca0ed7cbd6e3b7867dc7215ca6"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "FK_1262ccd74454b87d67e3da4d543"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "FK_19408f367519a83586bbcc7c377"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "FK_3ea08526e10844c330fbbdc8b70"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_a8eef31f4639132b5ebeb17d26a"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_6635bfb1d9eb27d91c2b53f8d43"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_e1d5abddd82f2416df458e607eb"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_a0da9b4eb8be55bcb0a8d1b86f3"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_7e77f562043393b08de949b804b"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "department_id"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "department_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "PK_9a2213262c1593bffb581e382f5"`);
        await queryRunner.query(`ALTER TABLE "department" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "department" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_d62835db8c0aec1d18a5a927549" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "UQ_7e77f562043393b08de949b804b"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "employee_id" integer`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "REL_7e77f562043393b08de949b804" UNIQUE ("employee_id")`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_7e77f562043393b08de949b804b" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "borrowed_book"`);
        await queryRunner.query(`DROP TABLE "shelf"`);
        await queryRunner.query(`DROP TABLE "book_shelf_jn"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
