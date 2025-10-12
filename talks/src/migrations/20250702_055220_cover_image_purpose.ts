import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_cover_images_purpose" AS ENUM('hub-image', 'series-image', 'other');
  CREATE TABLE "cover_images_purpose" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_cover_images_purpose",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "cover_images" ADD COLUMN "name" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "sha1sum" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "hash_invalid" boolean DEFAULT false;
  ALTER TABLE "cover_images_purpose" ADD CONSTRAINT "cover_images_purpose_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cover_images"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "cover_images_purpose_order_idx" ON "cover_images_purpose" USING btree ("order");
  CREATE INDEX "cover_images_purpose_parent_idx" ON "cover_images_purpose" USING btree ("parent_id");
  ALTER TABLE "cover_images" DROP COLUMN "caption";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cover_images_purpose" CASCADE;
  ALTER TABLE "cover_images" ADD COLUMN "caption" jsonb;
  ALTER TABLE "cover_images" DROP COLUMN "name";
  ALTER TABLE "cover_images" DROP COLUMN "sha1sum";
  ALTER TABLE "cover_images" DROP COLUMN "hash_invalid";
  DROP TYPE "public"."enum_cover_images_purpose";`)
}
