#!/usr/bin/env python3
"""
Video Analyzer — downloads a video, transcribes speech with Whisper,
and analyzes key frames with Claude Vision.
"""

import os
import sys
import json
import base64
import tempfile
import subprocess
import argparse
from pathlib import Path


def download_video(url: str, output_dir: str) -> str:
    """Download video using yt-dlp, return path to downloaded file."""
    print(f"[1/4] Downloading video from: {url}")
    output_template = os.path.join(output_dir, "video.%(ext)s")
    result = subprocess.run(
        ["yt-dlp", "-o", output_template, "--no-playlist", url],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print("yt-dlp error:", result.stderr)
        sys.exit(1)

    # Find the downloaded file
    for f in Path(output_dir).iterdir():
        if f.stem == "video":
            return str(f)
    raise FileNotFoundError("Downloaded video not found")


def extract_frames(video_path: str, output_dir: str, fps: float = 1.0) -> list[str]:
    """Extract frames from video at given FPS using ffmpeg."""
    print(f"[2/4] Extracting frames (1 frame every {int(1/fps)}s)...")
    frames_dir = os.path.join(output_dir, "frames")
    os.makedirs(frames_dir, exist_ok=True)

    subprocess.run(
        [
            "ffmpeg", "-i", video_path,
            "-vf", f"fps={fps},scale=640:-1",
            "-q:v", "3",
            os.path.join(frames_dir, "frame_%04d.jpg"),
            "-y", "-loglevel", "error"
        ],
        check=True
    )
    frames = sorted(Path(frames_dir).glob("*.jpg"))
    print(f"   Extracted {len(frames)} frames")
    return [str(f) for f in frames]


def transcribe_audio(video_path: str) -> str:
    """Transcribe audio using OpenAI Whisper."""
    print("[3/4] Transcribing audio with Whisper...")
    try:
        import whisper
        model = whisper.load_model("base")
        result = model.transcribe(video_path)
        text = result.get("text", "").strip()
        print(f"   Transcription: {text[:100]}{'...' if len(text) > 100 else ''}")
        return text
    except Exception as e:
        print(f"   Whisper unavailable ({e}), skipping transcription")
        return ""


def encode_image(path: str) -> str:
    with open(path, "rb") as f:
        return base64.standard_b64encode(f.read()).decode("utf-8")


def analyze_frames_with_claude(frames: list[str], transcription: str, question: str = "") -> dict:
    """Send frames to Claude for visual analysis."""
    print(f"[4/4] Analyzing {len(frames)} frames with Claude Vision...")
    import anthropic

    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    # Limit to 20 frames max to control cost
    if len(frames) > 20:
        step = len(frames) // 20
        frames = frames[::step][:20]
        print(f"   (Sampled down to {len(frames)} frames)")

    content = []

    # Add frames
    for i, frame_path in enumerate(frames):
        timestamp = i * (1 / 1.0)  # approximate second
        content.append({
            "type": "text",
            "text": f"Frame {i+1} (~{int(timestamp)}s into video):"
        })
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": encode_image(frame_path)
            }
        })

    # Build prompt
    prompt_parts = ["You are analyzing a video frame by frame.\n"]
    if transcription:
        prompt_parts.append(f"Audio transcription:\n\"\"\"\n{transcription}\n\"\"\"\n")
    prompt_parts.append(
        "Please provide:\n"
        "1. A general summary of what happens in the video\n"
        "2. A frame-by-frame description of key moments\n"
        "3. Any text, people, objects, or actions you notice\n"
    )
    if question:
        prompt_parts.append(f"4. Answer this specific question: {question}\n")

    content.append({"type": "text", "text": "\n".join(prompt_parts)})

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        messages=[{"role": "user", "content": content}]
    )

    analysis_text = response.content[0].text

    return {
        "transcription": transcription,
        "frame_count": len(frames),
        "analysis": analysis_text,
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens,
    }


def main():
    parser = argparse.ArgumentParser(description="Analyze a video using Whisper + Claude Vision")
    parser.add_argument("url", help="Video URL (Instagram, YouTube, etc.)")
    parser.add_argument("--question", "-q", default="", help="Specific question to answer about the video")
    parser.add_argument("--fps", type=float, default=0.5, help="Frames per second to extract (default: 0.5 = 1 frame/2s)")
    parser.add_argument("--output", "-o", default="result.json", help="Output JSON file (default: result.json)")
    parser.add_argument("--no-transcribe", action="store_true", help="Skip audio transcription")
    args = parser.parse_args()

    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Error: ANTHROPIC_API_KEY environment variable not set")
        sys.exit(1)

    with tempfile.TemporaryDirectory() as tmpdir:
        video_path = download_video(args.url, tmpdir)
        frames = extract_frames(video_path, tmpdir, fps=args.fps)

        transcription = ""
        if not args.no_transcribe:
            transcription = transcribe_audio(video_path)

        result = analyze_frames_with_claude(frames, transcription, args.question)

    # Save JSON
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print("\n" + "="*60)
    print("ANALYSIS RESULT")
    print("="*60)
    print(result["analysis"])
    if result["transcription"]:
        print("\n" + "-"*60)
        print("TRANSCRIPTION:")
        print(result["transcription"])
    print("="*60)
    print(f"\nSaved to: {args.output}")
    print(f"Tokens used: {result['input_tokens']} input, {result['output_tokens']} output")


if __name__ == "__main__":
    main()
