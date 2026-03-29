import { NextRequest, NextResponse } from "next/server";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// Stable Diffusion Inpainting model on Replicate
const MODEL_VERSION =
  "c11bac58203367db93a3c552bd49a25a5418458ddff2f4a8c7af60b49c8c0b53";

export async function POST(req: NextRequest) {
  try {
    const { image, mask } = await req.json();

    if (!image || !mask) {
      return NextResponse.json(
        { error: "image and mask are required" },
        { status: 400 }
      );
    }

    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN is not configured. Add it to your .env.local file." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          image,
          mask,
          prompt:
            "photorealistic, high quality, natural extension of the scene, seamless, detailed, 4k",
          negative_prompt:
            "blurry, low quality, artifacts, distortion, border, frame, watermark",
          num_inference_steps: 25,
          guidance_scale: 7.5,
          num_outputs: 1,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Replicate error:", errText);
      return NextResponse.json(
        { error: `Replicate API error: ${errText}` },
        { status: 502 }
      );
    }

    const prediction = await response.json();

    // Return prediction ID for client-side polling
    return NextResponse.json({ predictionId: prediction.id });
  } catch (err) {
    console.error("Image editor POST error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing prediction id" }, { status: 400 });
  }

  if (!REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "REPLICATE_API_TOKEN not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${id}`,
      {
        headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to poll prediction" }, { status: 502 });
    }

    const prediction = await response.json();

    if (prediction.status === "succeeded") {
      const outputUrl = Array.isArray(prediction.output)
        ? prediction.output[0]
        : prediction.output;

      // Fetch the image and return as base64 to avoid CORS issues
      const imgRes = await fetch(outputUrl);
      const imgBuffer = await imgRes.arrayBuffer();
      const base64 = Buffer.from(imgBuffer).toString("base64");
      const mime = imgRes.headers.get("content-type") || "image/png";

      return NextResponse.json({
        status: "succeeded",
        result: `data:${mime};base64,${base64}`,
      });
    }

    if (prediction.status === "failed") {
      return NextResponse.json({
        status: "failed",
        error: prediction.error || "Processing failed",
      });
    }

    // Still processing
    return NextResponse.json({ status: prediction.status });
  } catch (err) {
    console.error("Image editor GET error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
