import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const socCode = request.url.slice(request.url.lastIndexOf("/") + 1);
  const occupation = await fetch(
    `${process.env.REACT_APP_API_URL}/api/occupations/${socCode}`,
  );

  const occupationData = await occupation.json();

  return NextResponse.json(occupationData);
}
