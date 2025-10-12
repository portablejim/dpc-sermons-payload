import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "defaults" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"default_page" varchar DEFAULT 'home',
  	"default_cover_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "defaults" ADD CONSTRAINT "defaults_default_cover_image_id_cover_images_id_fk" FOREIGN KEY ("default_cover_image_id") REFERENCES "public"."cover_images"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "defaults_default_cover_image_idx" ON "defaults" USING btree ("default_cover_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "defaults" CASCADE;`)
}
