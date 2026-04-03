/**
 * Backfill script: generate slug values for all prompts that have slug = null.
 *
 * Once every prompt has a slug, the title-based fallback lookup in
 * src/pages/api/mcp.ts can be removed.
 *
 * Usage:
 *   npx tsx scripts/backfill-slugs.ts [--dry-run]
 *
 * Options:
 *   --dry-run  Print what would be updated without writing to the database.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DRY_RUN = process.argv.includes("--dry-run");

/**
 * Converts a string to a URL-friendly slug (mirrors src/lib/slug.ts#slugify).
 * Kept inline so the script has no dependency on the Next.js module graph.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

async function main() {
  console.log(`Mode: ${DRY_RUN ? "dry-run" : "live"}`);

  // Fetch all prompts with no slug
  const prompts = await prisma.prompt.findMany({
    where: { slug: null },
    select: { id: true, title: true },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${prompts.length} prompt(s) with no slug.`);

  if (prompts.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  // Build a set of already-used slugs (existing non-null slugs) so we can
  // avoid conflicts.
  const existingSlugs = await prisma.prompt
    .findMany({
      where: { slug: { not: null } },
      select: { slug: true },
    })
    .then((rows) => new Set(rows.map((r) => r.slug as string)));

  let updated = 0;
  let skipped = 0;

  for (const prompt of prompts) {
    const base = slugify(prompt.title) || prompt.id;

    // Make the slug unique by appending a counter when there's a collision
    let candidate = base;
    let counter = 1;
    while (existingSlugs.has(candidate)) {
      candidate = `${base}-${counter}`;
      counter++;
    }

    existingSlugs.add(candidate); // reserve for subsequent iterations

    if (DRY_RUN) {
      console.log(`  [dry-run] ${prompt.id}  "${prompt.title}"  →  "${candidate}"`);
      skipped++;
      continue;
    }

    await prisma.prompt.update({
      where: { id: prompt.id },
      data: { slug: candidate },
    });

    console.log(`  updated ${prompt.id}  "${prompt.title}"  →  "${candidate}"`);
    updated++;
  }

  console.log(`\nDone. updated=${updated} skipped(dry-run)=${skipped}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
