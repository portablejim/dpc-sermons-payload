import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  DROP INDEX "cover_images_sizes_thumbnail_webp_sizes_thumbnail_webp_filename_idx";
  DROP INDEX "cover_images_sizes_thumbnail_large_sizes_thumbnail_large_filename_idx";
  DROP INDEX "cover_images_sizes_large_square_sizes_large_square_filename_idx";
  DROP INDEX "pages_blocks_link_tile_list_link_tiles_link_tile_link_tile_background_image_idx";
  DROP INDEX "pages_blocks_link_tile_list_link_tiles_link_tile_link_tile_linked_media_idx";
  DROP INDEX "_pages_v_blocks_link_tile_list_link_tiles_link_tile_link_tile_background_image_idx";
  DROP INDEX "_pages_v_blocks_link_tile_list_link_tiles_link_tile_link_tile_linked_media_idx";
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "episodes" ALTER COLUMN "has_valid_media" DROP DEFAULT;
  ALTER TABLE "_episodes_v" ALTER COLUMN "version_has_valid_media" DROP DEFAULT;
  ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "cover_images_sizes_thumbnail_webp_sizes_thumbnail_webp_f_idx" ON "cover_images" USING btree ("sizes_thumbnail_webp_filename");
  CREATE INDEX "cover_images_sizes_thumbnail_large_sizes_thumbnail_large_idx" ON "cover_images" USING btree ("sizes_thumbnail_large_filename");
  CREATE INDEX "cover_images_sizes_large_square_sizes_large_square_filen_idx" ON "cover_images" USING btree ("sizes_large_square_filename");
  CREATE INDEX "pages_blocks_link_tile_list_link_tiles_link_tile_link_ti_idx" ON "pages_blocks_link_tile_list_link_tiles" USING btree ("link_tile_background_image_id");
  CREATE INDEX "pages_blocks_link_tile_list_link_tiles_link_tile_link__1_idx" ON "pages_blocks_link_tile_list_link_tiles" USING btree ("link_tile_linked_media_id");
  CREATE INDEX "_pages_v_blocks_link_tile_list_link_tiles_link_tile_link_idx" ON "_pages_v_blocks_link_tile_list_link_tiles" USING btree ("link_tile_background_image_id");
  CREATE INDEX "_pages_v_blocks_link_tile_list_link_tiles_link_tile_li_1_idx" ON "_pages_v_blocks_link_tile_list_link_tiles" USING btree ("link_tile_linked_media_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_kv" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP INDEX "cover_images_sizes_thumbnail_webp_sizes_thumbnail_webp_f_idx";
  DROP INDEX "cover_images_sizes_thumbnail_large_sizes_thumbnail_large_idx";
  DROP INDEX "cover_images_sizes_large_square_sizes_large_square_filen_idx";
  DROP INDEX "pages_blocks_link_tile_list_link_tiles_link_tile_link_ti_idx";
  DROP INDEX "pages_blocks_link_tile_list_link_tiles_link_tile_link__1_idx";
  DROP INDEX "_pages_v_blocks_link_tile_list_link_tiles_link_tile_link_idx";
  DROP INDEX "_pages_v_blocks_link_tile_list_link_tiles_link_tile_li_1_idx";
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "episodes" ALTER COLUMN "has_valid_media" SET DEFAULT false;
  ALTER TABLE "_episodes_v" ALTER COLUMN "version_has_valid_media" SET DEFAULT false;
  CREATE INDEX "cover_images_sizes_thumbnail_webp_sizes_thumbnail_webp_filename_idx" ON "cover_images" USING btree ("sizes_thumbnail_webp_filename");
  CREATE INDEX "cover_images_sizes_thumbnail_large_sizes_thumbnail_large_filename_idx" ON "cover_images" USING btree ("sizes_thumbnail_large_filename");
  CREATE INDEX "cover_images_sizes_large_square_sizes_large_square_filename_idx" ON "cover_images" USING btree ("sizes_large_square_filename");
  CREATE INDEX "pages_blocks_link_tile_list_link_tiles_link_tile_link_tile_background_image_idx" ON "pages_blocks_link_tile_list_link_tiles" USING btree ("link_tile_background_image_id");
  CREATE INDEX "pages_blocks_link_tile_list_link_tiles_link_tile_link_tile_linked_media_idx" ON "pages_blocks_link_tile_list_link_tiles" USING btree ("link_tile_linked_media_id");
  CREATE INDEX "_pages_v_blocks_link_tile_list_link_tiles_link_tile_link_tile_background_image_idx" ON "_pages_v_blocks_link_tile_list_link_tiles" USING btree ("link_tile_background_image_id");
  CREATE INDEX "_pages_v_blocks_link_tile_list_link_tiles_link_tile_link_tile_linked_media_idx" ON "_pages_v_blocks_link_tile_list_link_tiles" USING btree ("link_tile_linked_media_id");
  CREATE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";`)
}
