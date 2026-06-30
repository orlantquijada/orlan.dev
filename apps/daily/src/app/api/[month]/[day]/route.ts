import { getDaily, isValidDate } from "@/lib/content";
import { tryCatch } from "@/lib/utils";

type Params = {
  params: Promise<{ month: string; day: string }>;
};

export async function GET(_: Request, ctx: Params) {
  const { month, day } = await ctx.params;

  // Validate against the known content set before importing, and keep the 404
  // body static — don't reflect the raw params back to the caller.
  if (!(await isValidDate({ day, month }))) {
    return new Response("Not found.", { status: 404 });
  }

  const tryDaily = await tryCatch(getDaily({ day, month }));

  if (tryDaily.error) {
    return new Response("Not found.", { status: 404 });
  }

  return Response.json(tryDaily.data.frontmatter, {
    headers: {
      "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}
