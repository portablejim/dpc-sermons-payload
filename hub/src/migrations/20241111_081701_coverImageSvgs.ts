import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_cover_image_svgs_focal_point" AS ENUM('top-left', 'top-center', 'top-right', 'center-left', 'center-center', 'center-right', 'bottom-left', '50% bottom-center', 'bottom-right');
  CREATE TABLE IF NOT EXISTS "cover_image_svgs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"focal_point" "enum_cover_image_svgs_focal_point" DEFAULT 'center-center',
  	"version" numeric DEFAULT 1,
  	"guid" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  ALTER TABLE "cover_images" ADD COLUMN "square_svg_id" integer;
  ALTER TABLE "cover_images" ADD COLUMN "card_svg_id" integer;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_thumbnail_webp_url" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_thumbnail_webp_width" numeric;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_thumbnail_webp_height" numeric;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_thumbnail_webp_mime_type" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_thumbnail_webp_filesize" numeric;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_thumbnail_webp_filename" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_thumbnail_large_url" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_thumbnail_large_width" numeric;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_thumbnail_large_height" numeric;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_thumbnail_large_mime_type" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_thumbnail_large_filesize" numeric;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_thumbnail_large_filename" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_card_webp_url" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_card_webp_width" numeric;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_card_webp_height" numeric;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_card_webp_mime_type" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_card_webp_filesize" numeric;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_card_webp_filename" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_card_large_url" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_card_large_width" numeric;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_card_large_height" numeric;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_card_large_mime_type" varchar;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_card_large_filesize" numeric;
  ALTER TABLE "cover_images" ADD COLUMN "sizes_card_large_filename" varchar;
  ALTER TABLE "episodes" ADD COLUMN "order" numeric DEFAULT 1;
  ALTER TABLE "_episodes_v" ADD COLUMN "version_order" numeric DEFAULT 1;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cover_image_svgs_id" integer;
  CREATE UNIQUE INDEX IF NOT EXISTS "cover_image_svgs_guid_idx" ON "cover_image_svgs" USING btree ("guid");
  CREATE INDEX IF NOT EXISTS "cover_image_svgs_updated_at_idx" ON "cover_image_svgs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "cover_image_svgs_created_at_idx" ON "cover_image_svgs" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "cover_image_svgs_filename_idx" ON "cover_image_svgs" USING btree ("filename");
  DO $$ BEGIN
   ALTER TABLE "cover_images" ADD CONSTRAINT "cover_images_square_svg_id_cover_image_svgs_id_fk" FOREIGN KEY ("square_svg_id") REFERENCES "public"."cover_image_svgs"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "cover_images" ADD CONSTRAINT "cover_images_card_svg_id_cover_image_svgs_id_fk" FOREIGN KEY ("card_svg_id") REFERENCES "public"."cover_image_svgs"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cover_image_svgs_fk" FOREIGN KEY ("cover_image_svgs_id") REFERENCES "public"."cover_image_svgs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "cover_images_square_svg_idx" ON "cover_images" USING btree ("square_svg_id");
  CREATE INDEX IF NOT EXISTS "cover_images_card_svg_idx" ON "cover_images" USING btree ("card_svg_id");
  CREATE INDEX IF NOT EXISTS "cover_images_sizes_thumbnail_webp_sizes_thumbnail_webp_filename_idx" ON "cover_images" USING btree ("sizes_thumbnail_webp_filename");
  CREATE INDEX IF NOT EXISTS "cover_images_sizes_thumbnail_large_sizes_thumbnail_large_filename_idx" ON "cover_images" USING btree ("sizes_thumbnail_large_filename");
  CREATE INDEX IF NOT EXISTS "cover_images_sizes_card_webp_sizes_card_webp_filename_idx" ON "cover_images" USING btree ("sizes_card_webp_filename");
  CREATE INDEX IF NOT EXISTS "cover_images_sizes_card_large_sizes_card_large_filename_idx" ON "cover_images" USING btree ("sizes_card_large_filename");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_cover_image_svgs_id_idx" ON "payload_locked_documents_rels" USING btree ("cover_image_svgs_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "cover_image_svgs";
  ALTER TABLE "cover_images" DROP CONSTRAINT "cover_images_square_svg_id_cover_image_svgs_id_fk";
  
  ALTER TABLE "cover_images" DROP CONSTRAINT "cover_images_card_svg_id_cover_image_svgs_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cover_image_svgs_fk";
  
  DROP INDEX IF EXISTS "cover_images_square_svg_idx";
  DROP INDEX IF EXISTS "cover_images_card_svg_idx";
  DROP INDEX IF EXISTS "cover_images_sizes_thumbnail_webp_sizes_thumbnail_webp_filename_idx";
  DROP INDEX IF EXISTS "cover_images_sizes_thumbnail_large_sizes_thumbnail_large_filename_idx";
  DROP INDEX IF EXISTS "cover_images_sizes_card_webp_sizes_card_webp_filename_idx";
  DROP INDEX IF EXISTS "cover_images_sizes_card_large_sizes_card_large_filename_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_cover_image_svgs_id_idx";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "square_svg_id";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "card_svg_id";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_thumbnail_webp_url";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_thumbnail_webp_width";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_thumbnail_webp_height";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_thumbnail_webp_mime_type";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_thumbnail_webp_filesize";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_thumbnail_webp_filename";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_thumbnail_large_url";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_thumbnail_large_width";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_thumbnail_large_height";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_thumbnail_large_mime_type";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_thumbnail_large_filesize";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_thumbnail_large_filename";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_card_webp_url";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_card_webp_width";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_card_webp_height";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_card_webp_mime_type";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_card_webp_filesize";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_card_webp_filename";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_card_large_url";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_card_large_width";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_card_large_height";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_card_large_mime_type";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_card_large_filesize";
  ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "sizes_card_large_filename";
  ALTER TABLE "episodes" DROP COLUMN IF EXISTS "order";
  ALTER TABLE "_episodes_v" DROP COLUMN IF EXISTS "version_order";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "cover_image_svgs_id";
  DROP TYPE "public"."enum_cover_image_svgs_focal_point";`)
}
