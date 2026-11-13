import React, { useEffect, useState } from 'react';

const RAW_LOGO_PATH = '/assets/aistudio/Gemini_Generated_Image_cvxebrcvxebrcvxe_ce4ad535.jpg';

let cachedProcessedLogoUrl: string | null = null;
let processingPromise: Promise<string> | null = null;

function isNeutralCheckerboardPixel(r: number, g: number, b: number): boolean {
  const maxC = Math.max(r, g, b);
  const minC = Math.min(r, g, b);
  return maxC - minC <= 18 && minC >= 175;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hn = ((h % 360) + 360) % 360 / 360;
  if (s === 0) {
    const val = Math.round(l * 255);
    return [val, val, val];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tn = t;
    if (tn < 0) tn += 1;
    if (tn > 1) tn -= 1;
    if (tn < 1 / 6) return p + (q - p) * 6 * tn;
    if (tn < 1 / 2) return q;
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, hn) * 255),
    Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  ];
}

function getProcessedLogoUrl(): Promise<string> {
  if (cachedProcessedLogoUrl) {
    return Promise.resolve(cachedProcessedLogoUrl);
  }
  if (processingPromise) {
    return processingPromise;
  }

  processingPromise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) {
          resolve(RAW_LOGO_PATH);
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(RAW_LOGO_PATH);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0;
        let tail = 0;

        const enqueueIfBg = (x: number, y: number) => {
          const idx = y * w + x;
          if (visited[idx]) return;
          const p = idx * 4;
          if (isNeutralCheckerboardPixel(data[p], data[p + 1], data[p + 2])) {
            visited[idx] = 1;
            queue[tail++] = idx;
          }
        };

        // Flood-fill strictly from outer edges to leave internal metallic wing shading untouched
        for (let x = 0; x < w; x++) {
          enqueueIfBg(x, 0);
          enqueueIfBg(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          enqueueIfBg(0, y);
          enqueueIfBg(w - 1, y);
        }

        while (head < tail) {
          const curr = queue[head++];
          const cx = curr % w;
          const cy = (curr - cx) / w;
          data[curr * 4 + 3] = 0;

          if (cx > 0) enqueueIfBg(cx - 1, cy);
          if (cx < w - 1) enqueueIfBg(cx + 1, cy);
          if (cy > 0) enqueueIfBg(cx, cy - 1);
          if (cy < h - 1) enqueueIfBg(cx, cy + 1);
        }

        // Shift blue/teal artwork hues cleanly into Pearl White & Royal Purple theme palette
        // Navy/Blue (~205-245°) -> Deep Royal Indigo-Violet (~256-265°)
        // Cyan/Teal (~168-205°) -> Vibrant Amethyst Purple (~272-284°)
        let minX = w;
        let minY = h;
        let maxX = 0;
        let maxY = 0;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            const p = idx * 4;
            if (data[p + 3] === 0) continue;

            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;

            const [hue, sat, lum] = rgbToHsl(data[p], data[p + 1], data[p + 2]);
            if (sat > 0.14) {
              let targetHue = hue;
              let targetSat = sat;
              let targetLum = lum;

              if (hue >= 155 && hue < 204) {
                // Cyan/Teal accent -> Vibrant Royal Violet (#7C3AED - #9333EA range)
                targetHue = 274 + ((hue - 155) / 49) * 10;
                targetSat = Math.min(0.86, Math.max(0.68, sat));
                targetLum = Math.min(0.56, Math.max(0.44, lum * 1.15));
              } else if (hue >= 204 && hue <= 255) {
                // Navy/Blue -> Deep Royal Purple (#3B0764 - #5B21B6 range)
                targetHue = 260 + ((hue - 204) / 51) * 8;
                targetSat = Math.min(0.82, Math.max(0.65, sat));
                targetLum = Math.min(0.44, Math.max(0.22, lum * 1.05));
              }

              const [nr, ng, nb] = hslToRgb(targetHue, targetSat, targetLum);
              data[p] = nr;
              data[p + 1] = ng;
              data[p + 2] = nb;
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);

        if (maxX <= minX || maxY <= minY) {
          resolve(RAW_LOGO_PATH);
          return;
        }

        const cropW = maxX - minX + 1;
        const cropH = maxY - minY + 1;

        const outCanvas = document.createElement('canvas');
        outCanvas.width = cropW;
        outCanvas.height = cropH;
        const outCtx = outCanvas.getContext('2d');
        if (!outCtx) {
          resolve(RAW_LOGO_PATH);
          return;
        }

        outCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
        const resultUrl = outCanvas.toDataURL('image/png');
        cachedProcessedLogoUrl = resultUrl;
        resolve(resultUrl);
      } catch {
        resolve(RAW_LOGO_PATH);
      }
    };
    img.onerror = () => resolve(RAW_LOGO_PATH);
    img.src = RAW_LOGO_PATH;
  });

  return processingPromise;
}

export const RoyalLogo: React.FC<{ className?: string; idSuffix?: string }> = ({
  className = 'h-8 sm:h-9 w-auto',
}) => {
  const [logoSrc, setLogoSrc] = useState<string>(cachedProcessedLogoUrl || RAW_LOGO_PATH);

  useEffect(() => {
    let active = true;
    getProcessedLogoUrl().then((url) => {
      if (active) setLogoSrc(url);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <img
      src={logoSrc}
      alt="Make Your Fly Easy (MYFE) Official Logo"
      className={`${className} shrink-0 object-contain bg-transparent select-none transition-transform duration-300 group-hover:scale-105`}
    />
  );
};
