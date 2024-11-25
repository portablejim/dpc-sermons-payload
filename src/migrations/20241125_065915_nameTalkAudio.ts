import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TYPE "public"."enum_cover_image_svgs_focal_point" RENAME TO "enum_cover_image_svgs_svg_focal_point";
  ALTER TABLE "cover_image_svgs" RENAME COLUMN "focal_point" TO "svg_focal_point";
  ALTER TABLE "talk_audio" ADD COLUMN "original_filename" varchar;
  ALTER TABLE "public"."cover_image_svgs" ALTER COLUMN "svg_focal_point" SET DATA TYPE text;
  DROP TYPE "public"."enum_cover_image_svgs_svg_focal_point";
  CREATE TYPE "public"."enum_cover_image_svgs_svg_focal_point" AS ENUM('top-left', 'top-center', 'top-right', 'center-left', 'center-center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right');
  ALTER TABLE "public"."cover_image_svgs" ALTER COLUMN "svg_focal_point" SET DATA TYPE "public"."enum_cover_image_svgs_svg_focal_point" USING "svg_focal_point"::"public"."enum_cover_image_svgs_svg_focal_point";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TYPE "public"."enum_cover_image_svgs_svg_focal_point" RENAME TO "enum_cover_image_svgs_focal_point";
  ALTER TABLE "cover_image_svgs" ADD COLUMN "focal_point" "enum_cover_image_svgs_focal_point" DEFAULT 'center-center';
  ALTER TABLE "cover_image_svgs" DROP COLUMN IF EXISTS "svg_focal_point";
  ALTER TABLE "talk_audio" DROP COLUMN IF EXISTS "original_filename";
  ALTER TABLE "public"."cover_image_svgs" ALTER COLUMN "focal_point" SET DATA TYPE text;
  DROP TYPE "public"."enum_cover_image_svgs_focal_point";
  CREATE TYPE "public"."enum_cover_image_svgs_focal_point" AS ENUM('top-left', 'top-center', 'top-right', 'center-left', 'center-center', 'center-right', 'bottom-left', '50% bottom-center', 'bottom-right');
  ALTER TABLE "public"."cover_image_svgs" ALTER COLUMN "focal_point" SET DATA TYPE "public"."enum_cover_image_svgs_focal_point" USING "focal_point"::"public"."enum_cover_image_svgs_focal_point";`)
}
