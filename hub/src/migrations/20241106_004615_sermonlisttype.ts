import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_library_list_episode_type" AS ENUM('regular', 'special');
  CREATE TYPE "public"."enum__pages_v_blocks_library_list_episode_type" AS ENUM('regular', 'special');
  ALTER TABLE "cover_images" ADD COLUMN "version" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_library_list" ADD COLUMN "episode_type" "enum_pages_blocks_library_list_episode_type" DEFAULT 'regular';
  ALTER TABLE "_pages_v_blocks_library_list" ADD COLUMN "episode_type" "enum__pages_v_blocks_library_list_episode_type" DEFAULT 'regular';`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "cover_images" DROP COLUMN IF EXISTS "version";
  ALTER TABLE "pages_blocks_library_list" DROP COLUMN IF EXISTS "episode_type";
  ALTER TABLE "_pages_v_blocks_library_list" DROP COLUMN IF EXISTS "episode_type";
  DROP TYPE "public"."enum_pages_blocks_library_list_episode_type";
  DROP TYPE "public"."enum__pages_v_blocks_library_list_episode_type";`)
}
