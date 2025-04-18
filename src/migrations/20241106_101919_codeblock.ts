import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TABLE IF NOT EXISTS "pages_blocks_code_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"css_code" varchar,
  	"body_code" varchar,
  	"limit_width" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_code_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"css_code" varchar,
  	"body_code" varchar,
  	"limit_width" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_code_block" ADD CONSTRAINT "pages_blocks_code_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_code_block" ADD CONSTRAINT "_pages_v_blocks_code_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_blocks_code_block_order_idx" ON "pages_blocks_code_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_code_block_parent_id_idx" ON "pages_blocks_code_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_code_block_path_idx" ON "pages_blocks_code_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_code_block_order_idx" ON "_pages_v_blocks_code_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_code_block_parent_id_idx" ON "_pages_v_blocks_code_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_code_block_path_idx" ON "_pages_v_blocks_code_block" USING btree ("_path");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "pages_blocks_code_block";
  DROP TABLE "_pages_v_blocks_code_block";`)
}
