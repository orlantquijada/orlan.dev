import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/daily", "/api/daily"],
};

export async function middleware(req: NextRequest) {
  const { nextUrl: url, headers } = req;

  url.searchParams.set("timezone", headers.get("x-vercel-ip-timezone") || "");

  return NextResponse.rewrite(url);
}
