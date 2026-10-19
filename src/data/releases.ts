/**
 * Public releases. Stays empty until signed artifacts exist; the download page
 * and the header call to action read from here. Validated at build time.
 */
import { z } from 'astro/zod';
import raw from '@/content/data/releases.json';

const releaseSchema = z.object({
  id: z.string(),
  version: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.url(),
  githubRelease: z.url(),
  artifacts: z.array(
    z.object({
      platform: z.enum(['macos', 'windows', 'linux']),
      arch: z.enum(['arm64', 'x64']),
      format: z.string(),
      url: z.url(),
      size: z.string(),
      sha256: z.string().length(64),
      signing: z.string(),
    }),
  ),
});

export type Release = z.infer<typeof releaseSchema>;

/** Same shape as a content-collection entry ({ id, data }) so templates read `r.data.version`. */
export const releases: { id: string; data: Release }[] = z
  .array(releaseSchema)
  .parse(raw)
  .map((r) => ({ id: r.id, data: r }))
  .sort((a, b) => b.data.date.localeCompare(a.data.date));

export const hasRelease = releases.length > 0;
