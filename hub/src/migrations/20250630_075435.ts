import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "header_nav_items_active_url_match" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"regex" varchar
  );
  
  CREATE TABLE "footer_nav_items_active_url_match" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"regex" varchar
  );
  
  ALTER TABLE "forms_blocks_select" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "header_nav_items_active_url_match" ADD CONSTRAINT "header_nav_items_active_url_match_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items_active_url_match" ADD CONSTRAINT "footer_nav_items_active_url_match_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_nav_items_active_url_match_order_idx" ON "header_nav_items_active_url_match" USING btree ("_order");
  CREATE INDEX "header_nav_items_active_url_match_parent_id_idx" ON "header_nav_items_active_url_match" USING btree ("_parent_id");
  CREATE INDEX "footer_nav_items_active_url_match_order_idx" ON "footer_nav_items_active_url_match" USING btree ("_order");
  CREATE INDEX "footer_nav_items_active_url_match_parent_id_idx" ON "footer_nav_items_active_url_match" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "header_nav_items_active_url_match" CASCADE;
  DROP TABLE "footer_nav_items_active_url_match" CASCADE;
  ALTER TABLE "forms_blocks_select" DROP COLUMN "placeholder";`)
}
