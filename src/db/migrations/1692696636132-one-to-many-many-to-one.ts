import { MigrationInterface, QueryRunner } from "typeorm";

export class OneToManyManyToOne1692696636132 implements MigrationInterface {
    name = 'OneToManyManyToOne1692696636132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "FK_e833f7ba19ce11f010a859ff85d"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "FK_19408f367519a83586bbcc7c377"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "FK_8947df3fa66e9f26225b24d6ff6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19408f367519a83586bbcc7c37"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3ea08526e10844c330fbbdc8b7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8947df3fa66e9f26225b24d6ff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea7890e7c2ea260306f11a5b7f"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP COLUMN "shelf_code_ref"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "FK_3ea08526e10844c330fbbdc8b70"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "PK_cf4e9f46f98d24f3186dffc6113"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "PK_8dd16edc762b715de0dbdde6984" PRIMARY KEY ("book_isbn", "shelf_code", "id")`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "PK_8dd16edc762b715de0dbdde6984"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "PK_b631b27d3aa2954e318d22b1fb8" PRIMARY KEY ("id", "book_isbn")`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "PK_b631b27d3aa2954e318d22b1fb8"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "PK_0fe4d2c6aeec6ac16dfd8356190" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "FK_ea7890e7c2ea260306f11a5b7fb"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "PK_ff119062353916af4e83dcc7a1a"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "PK_a4913a6e71fbb759bfbbbd679f3" PRIMARY KEY ("employee_id", "book_isbn", "id")`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "PK_a4913a6e71fbb759bfbbbd679f3"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "PK_4d53f2d1091b9a255d30cb241bd" PRIMARY KEY ("id", "book_isbn")`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "PK_4d53f2d1091b9a255d30cb241bd"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "PK_4c9f6ded12afd45e3b2492f3b58" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "FK_3ea08526e10844c330fbbdc8b70" FOREIGN KEY ("shelf_code") REFERENCES "shelf"("shelf_code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "FK_19408f367519a83586bbcc7c377" FOREIGN KEY ("book_isbn") REFERENCES "book"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "FK_ea7890e7c2ea260306f11a5b7fb" FOREIGN KEY ("book_isbn") REFERENCES "book"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "FK_8947df3fa66e9f26225b24d6ff6" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "FK_8947df3fa66e9f26225b24d6ff6"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "FK_ea7890e7c2ea260306f11a5b7fb"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "FK_19408f367519a83586bbcc7c377"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "FK_3ea08526e10844c330fbbdc8b70"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "PK_4c9f6ded12afd45e3b2492f3b58"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "PK_4d53f2d1091b9a255d30cb241bd" PRIMARY KEY ("id", "book_isbn")`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "PK_4d53f2d1091b9a255d30cb241bd"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "PK_a4913a6e71fbb759bfbbbd679f3" PRIMARY KEY ("id", "employee_id", "book_isbn")`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" DROP CONSTRAINT "PK_a4913a6e71fbb759bfbbbd679f3"`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "PK_ff119062353916af4e83dcc7a1a" PRIMARY KEY ("employee_id", "book_isbn")`);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "FK_ea7890e7c2ea260306f11a5b7fb" FOREIGN KEY ("book_isbn") REFERENCES "book"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "PK_0fe4d2c6aeec6ac16dfd8356190"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "PK_b631b27d3aa2954e318d22b1fb8" PRIMARY KEY ("id", "book_isbn")`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "PK_b631b27d3aa2954e318d22b1fb8"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "PK_8dd16edc762b715de0dbdde6984" PRIMARY KEY ("id", "book_isbn", "shelf_code")`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" DROP CONSTRAINT "PK_8dd16edc762b715de0dbdde6984"`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "PK_cf4e9f46f98d24f3186dffc6113" PRIMARY KEY ("book_isbn", "shelf_code")`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "FK_3ea08526e10844c330fbbdc8b70" FOREIGN KEY ("shelf_code") REFERENCES "shelf"("shelf_code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD "shelf_code_ref" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_ea7890e7c2ea260306f11a5b7f" ON "borrowed_book" ("book_isbn") `);
        await queryRunner.query(`CREATE INDEX "IDX_8947df3fa66e9f26225b24d6ff" ON "borrowed_book" ("employee_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3ea08526e10844c330fbbdc8b7" ON "book_shelf_jn" ("shelf_code") `);
        await queryRunner.query(`CREATE INDEX "IDX_19408f367519a83586bbcc7c37" ON "book_shelf_jn" ("book_isbn") `);
        await queryRunner.query(`ALTER TABLE "borrowed_book" ADD CONSTRAINT "FK_8947df3fa66e9f26225b24d6ff6" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "FK_19408f367519a83586bbcc7c377" FOREIGN KEY ("book_isbn") REFERENCES "book"("isbn") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "book_shelf_jn" ADD CONSTRAINT "FK_e833f7ba19ce11f010a859ff85d" FOREIGN KEY ("shelf_code_ref") REFERENCES "shelf"("shelf_code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
