import { getDaily } from "@/lib/content";
import { tryCatch } from "@/lib/utils";

export async function GET(_: Request, ctx: RouteContext<"/api/[month]/[day]">) {
  const { month, day } = await ctx.params;

  const tryDaily = await tryCatch(getDaily({ day, month }));

  if (tryDaily.error) {
    return new Response(`No entry found for ${month}, ${day}.`, {
      status: 404,
    });
  }

  return Response.json(tryDaily.data.frontmatter, {
    headers: {
      "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}
