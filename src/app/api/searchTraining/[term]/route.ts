import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.url.slice(request.url.lastIndexOf("/") + 1);
  const searchResults = await fetch(
    `${process.env.REACT_APP_API_URL}/api/trainings/search?query=${query}`,
  );

  const trainingData = await searchResults.json();

  return NextResponse.json(trainingData);
}
