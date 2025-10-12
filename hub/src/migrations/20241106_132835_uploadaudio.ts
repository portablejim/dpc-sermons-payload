import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "episodes_bible_passages" ADD COLUMN "verse_start" numeric;
  ALTER TABLE "episodes_bible_passages" ADD COLUMN "verse_end" numeric;
  ALTER TABLE "_episodes_v_version_bible_passages" ADD COLUMN "verse_start" numeric;
  ALTER TABLE "_episodes_v_version_bible_passages" ADD COLUMN "verse_end" numeric;`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "episodes_bible_passages" DROP COLUMN IF EXISTS "verse_start";
  ALTER TABLE "episodes_bible_passages" DROP COLUMN IF EXISTS "verse_end";
  ALTER TABLE "_episodes_v_version_bible_passages" DROP COLUMN IF EXISTS "verse_start";
  ALTER TABLE "_episodes_v_version_bible_passages" DROP COLUMN IF EXISTS "verse_end";`)
}
