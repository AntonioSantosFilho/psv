import { NextResponse } from "next/server"

// Sample GeoJSON data
const sampleGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "São Paulo",
        category: "city",
        population: 12300000,
      },
      geometry: {
        type: "Point",
        coordinates: [-46.6333, -23.5505],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Rio de Janeiro",
        category: "city",
        population: 6700000,
      },
      geometry: {
        type: "Point",
        coordinates: [-43.1729, -22.9068],
      },
    },
  ],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const layer = searchParams.get("layer")

  // In a real application, you would fetch data from a database
  // based on the layer parameter
  return NextResponse.json(sampleGeoJSON)
}
