import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const VALID_TAGS = ["products", "settings"] as const;
type ValidTag = (typeof VALID_TAGS)[number];

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).secret !== "string" ||
    (body as Record<string, unknown>).secret !== process.env.REVALIDATE_SECRET
  ) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const tag = (body as Record<string, unknown>).tag;

  if (!VALID_TAGS.includes(tag as ValidTag)) {
    return NextResponse.json(
      { error: `"tag" must be one of: ${VALID_TAGS.join(", ")}` },
      { status: 400 },
    );
  }

  revalidateTag(tag as ValidTag, {});

  return NextResponse.json({ revalidated: true, tag });
}
