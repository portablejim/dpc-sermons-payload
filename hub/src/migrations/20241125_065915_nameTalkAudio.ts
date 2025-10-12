import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TYPE "public"."enum_cover_image_svgs_focal_point" RENAME TO "enum_cover_image_svgs_svg_focal_point";
  ALTER TABLE "cover_image_svgs" RENAME COLUMN "focal_point" TO "svg_focal_point";
  ALTER TABLE "talk_audio" ADD COLUMN "original_filename" varchar;`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TYPE "public"."enum_cover_image_svgs_svg_focal_point" RENAME TO "enum_cover_image_svgs_focal_point";
  ALTER TABLE "cover_image_svgs" RENAME COLUMN "svg_focal_point" TO "focal_point";
  ALTER TABLE "talk_audio" DROP COLUMN IF EXISTS "original_filename";`)
}
