const BUILD_SHA = process.env.NEXT_PUBLIC_BUILD_SHA?.trim() || "local";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "verifair-public-website",
      buildSha: BUILD_SHA,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
