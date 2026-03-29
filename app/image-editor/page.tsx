"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const DISPLAY_MAX_WIDTH = 900;
const DISPLAY_MAX_HEIGHT = 550;

export default function ImageOutpaintEditor() {
  const [hasImage, setHasImage] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(30);
  const [isErasing, setIsErasing] = useState(false);
  const [status, setStatus] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const compositeCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const origImageDataRef = useRef<string | null>(null);

  // Redraw the composite view: image + red mask overlay
  const redrawComposite = useCallback(() => {
    const imgCanvas = imageCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const compCanvas = compositeCanvasRef.current;
    if (!imgCanvas || !maskCanvas || !compCanvas) return;

    const ctx = compCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, compCanvas.width, compCanvas.height);
    ctx.drawImage(imgCanvas, 0, 0);
    ctx.drawImage(maskCanvas, 0, 0);
  }, []);

  const loadImage = useCallback(
    (dataUrl: string) => {
      origImageDataRef.current = dataUrl;
      const img = new Image();
      img.onload = () => {
        // Scale to fit display limits
        let w = img.width;
        let h = img.height;
        const ratio = Math.min(DISPLAY_MAX_WIDTH / w, DISPLAY_MAX_HEIGHT / h, 1);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);

        [imageCanvasRef, maskCanvasRef, compositeCanvasRef].forEach((ref) => {
          if (ref.current) {
            ref.current.width = w;
            ref.current.height = h;
          }
        });

        // Draw image
        const imgCtx = imageCanvasRef.current?.getContext("2d");
        if (imgCtx) {
          imgCtx.drawImage(img, 0, 0, w, h);
        }

        // Clear mask
        const maskCtx = maskCanvasRef.current?.getContext("2d");
        if (maskCtx) maskCtx.clearRect(0, 0, w, h);

        // Auto-detect black areas
        if (imgCtx) autoDetectBlack(imgCtx, w, h);

        redrawComposite();
        setHasImage(true);
        setResultUrl(null);
        setError(null);
        setStatus("");
      };
      img.src = dataUrl;
    },
    [redrawComposite]
  );

  const autoDetectBlack = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number
  ) => {
    const imageData = ctx.getImageData(0, 0, w, h);
    const pixels = imageData.data;
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    maskCtx.clearRect(0, 0, w, h);

    const maskData = maskCtx.createImageData(w, h);
    const mp = maskData.data;
    const threshold = 18;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      if (r < threshold && g < threshold && b < threshold) {
        mp[i] = 220;
        mp[i + 1] = 30;
        mp[i + 2] = 30;
        mp[i + 3] = 160;
      }
    }

    maskCtx.putImageData(maskData, 0, 0);
  };

  const getPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = compositeCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const paint = useCallback(
    (point: { x: number; y: number }) => {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas) return;
      const ctx = maskCanvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      if (isErasing) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.fillStyle = "rgba(0,0,0,1)";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "rgba(220,30,30,0.6)";
        ctx.fillStyle = "rgba(220,30,30,0.6)";
      }

      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (lastPointRef.current) {
        ctx.beginPath();
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      redrawComposite();
    },
    [brushSize, isErasing, redrawComposite]
  );

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const p = getPoint(e);
    if (p) { lastPointRef.current = null; paint(p); lastPointRef.current = p; }
  };
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const p = getPoint(e);
    if (p) { paint(p); lastPointRef.current = p; }
  };
  const onMouseUp = () => { isDrawingRef.current = false; lastPointRef.current = null; };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => loadImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const clearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    maskCanvas.getContext("2d")?.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    redrawComposite();
  };

  const autoDetect = () => {
    const imgCanvas = imageCanvasRef.current;
    if (!imgCanvas) return;
    const ctx = imgCanvas.getContext("2d");
    if (ctx) {
      autoDetectBlack(ctx, imgCanvas.width, imgCanvas.height);
      redrawComposite();
    }
  };

  // Build a B&W mask (white = fill, black = keep)
  const buildBWMask = (): string | null => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return null;
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return null;

    const { width, height } = maskCanvas;
    const tmp = document.createElement("canvas");
    tmp.width = width;
    tmp.height = height;
    const tmpCtx = tmp.getContext("2d");
    if (!tmpCtx) return null;

    tmpCtx.fillStyle = "black";
    tmpCtx.fillRect(0, 0, width, height);

    const srcData = maskCtx.getImageData(0, 0, width, height);
    const dstData = tmpCtx.getImageData(0, 0, width, height);

    for (let i = 0; i < srcData.data.length; i += 4) {
      if (srcData.data[i + 3] > 10) {
        dstData.data[i] = 255;
        dstData.data[i + 1] = 255;
        dstData.data[i + 2] = 255;
        dstData.data[i + 3] = 255;
      }
    }

    tmpCtx.putImageData(dstData, 0, 0);
    return tmp.toDataURL("image/png");
  };

  const handleProcess = async () => {
    const imgCanvas = imageCanvasRef.current;
    if (!imgCanvas) return;

    const imageData = imgCanvas.toDataURL("image/png");
    const maskData = buildBWMask();
    if (!maskData) return;

    setIsProcessing(true);
    setError(null);
    setStatus("Sending to AI...");

    try {
      const res = await fetch("/api/image-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, mask: maskData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }

      setStatus("Processing...");
      const data = await res.json();

      if (data.predictionId) {
        // Poll for result
        let attempts = 0;
        while (attempts < 90) {
          await new Promise((r) => setTimeout(r, 2000));
          const poll = await fetch(`/api/image-editor?id=${data.predictionId}`);
          const pollData = await poll.json();

          if (pollData.status === "succeeded") {
            setResultUrl(pollData.result);
            setStatus("");
            break;
          } else if (pollData.status === "failed") {
            throw new Error(pollData.error || "Processing failed");
          }
          attempts++;
          setStatus(`Processing... (${attempts * 2}s)`);
        }
        if (attempts >= 90) throw new Error("Timeout");
      } else if (data.result) {
        setResultUrl(data.result);
        setStatus("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process");
      setStatus("");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Image Outpainting Editor
          </h1>
          <p className="text-gray-400">
            העלה פריים שאינו 16:9 — האזורים השחורים יזוהו אוטומטית. סמן את האזורים למילוי וה-AI ישלים את התמונה.
          </p>
        </div>

        {/* Upload zone */}
        {!hasImage && (
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
              dragOver
                ? "border-blue-400 bg-blue-900/20"
                : "border-gray-600 hover:border-gray-400 bg-gray-900/40"
            }`}
          >
            <svg className="w-14 h-14 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-300 font-medium">גרור תמונה לכאן, או לחץ לבחירה</p>
            <p className="text-gray-500 text-sm mt-1">PNG, JPG, WEBP</p>
            <input type="file" className="hidden" accept="image/*" onChange={onFileInput} />
          </label>
        )}

        {/* Editor */}
        {hasImage && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button
                onClick={() => setIsErasing(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !isErasing ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                צבע מסכה
              </button>
              <button
                onClick={() => setIsErasing(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isErasing ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                מחק מסכה
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">מברשת:</span>
                <input
                  type="range" min="5" max="120" value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-28 accent-blue-500"
                />
                <span className="text-sm text-gray-400 w-8">{brushSize}</span>
              </div>
              <button
                onClick={autoDetect}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                זיהוי אוטומטי
              </button>
              <button
                onClick={clearMask}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                נקה מסכה
              </button>
              <label className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors cursor-pointer">
                החלף תמונה
                <input type="file" className="hidden" accept="image/*" onChange={onFileInput} />
              </label>
            </div>

            {/* Canvas stack */}
            <div
              className="relative bg-gray-900 rounded-2xl overflow-hidden mb-4 select-none"
              style={{ display: "inline-block", maxWidth: "100%" }}
            >
              {/* Hidden canvases for data */}
              <canvas ref={imageCanvasRef} className="hidden" />
              <canvas ref={maskCanvasRef} className="hidden" />
              {/* Visible composite canvas */}
              <canvas
                ref={compositeCanvasRef}
                className="block max-w-full cursor-crosshair"
                style={{ maxHeight: `${DISPLAY_MAX_HEIGHT}px` }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              />
            </div>

            <p className="text-gray-500 text-sm mb-5">
              האזורים האדומים יימלאו ע"י ה-AI. ניתן לצבוע ידנית אזורים נוספים או למחוק.
            </p>

            {/* Process button */}
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-lg"
            >
              {isProcessing ? status || "מעבד..." : "השלם תמונה עם AI"}
            </button>

            {error && (
              <div className="mt-4 text-red-300 bg-red-900/30 border border-red-800 rounded-xl p-4">
                {error}
              </div>
            )}
          </>
        )}

        {/* Result */}
        {resultUrl && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <h2 className="text-xl font-semibold">תוצאה — 16:9</h2>
            </div>
            <div className="bg-gray-900 rounded-2xl overflow-hidden inline-block mb-4">
              <img
                src={resultUrl}
                alt="Result"
                className="block max-w-full"
                style={{ maxHeight: `${DISPLAY_MAX_HEIGHT}px` }}
              />
            </div>
            <div className="flex gap-3">
              <a
                href={resultUrl}
                download="outpainted-16x9.png"
                className="inline-block px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-xl transition-colors"
              >
                הורד תמונה
              </a>
              <button
                onClick={() => setResultUrl(null)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
              >
                ערוך שוב
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
