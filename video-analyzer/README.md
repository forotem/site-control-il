# Video Analyzer

Analyzes any video (Instagram, YouTube, TikTok, etc.) using:
- **yt-dlp** — download from almost any platform
- **Whisper** — speech transcription
- **Claude Vision** — frame-by-frame visual analysis

## Setup

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your_key_here
```

## Usage

```bash
# Basic analysis
python analyzer.py https://www.instagram.com/reel/...

# Ask a specific question about the video
python analyzer.py https://youtu.be/... --question "What product is being shown?"

# Adjust frame rate (default: 0.5 fps = 1 frame every 2 seconds)
python analyzer.py <url> --fps 1.0

# Skip audio transcription
python analyzer.py <url> --no-transcribe

# Save output to custom file
python analyzer.py <url> --output my_analysis.json
```

## Output

Prints analysis to terminal and saves full JSON to `result.json`:
```json
{
  "transcription": "...",
  "frame_count": 15,
  "analysis": "...",
  "input_tokens": 12000,
  "output_tokens": 800
}
```
