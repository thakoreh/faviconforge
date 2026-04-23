// Favicon generation utilities — client-side SVG-based

export type FaviconStyle = "letter" | "icon" | "gradient";
export type FaviconShape = "rounded" | "circle" | "hexagon" | "square";
export type FaviconSize = 16 | 32 | 48 | 64 | 128 | 180 | 192 | 512;

export interface FaviconConfig {
  brandName: string;
  style: FaviconStyle;
  shape: FaviconShape;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
}

// Predefined color palettes
export const COLOR_PALETTES = [
  { primary: "#6366f1", secondary: "#818cf8", text: "#ffffff" },
  { primary: "#ec4899", secondary: "#f472b6", text: "#ffffff" },
  { primary: "#f59e0b", secondary: "#fbbf24", text: "#1e293b" },
  { primary: "#10b981", secondary: "#34d399", text: "#ffffff" },
  { primary: "#3b82f6", secondary: "#60a5fa", text: "#ffffff" },
  { primary: "#ef4444", secondary: "#f87171", text: "#ffffff" },
  { primary: "#8b5cf6", secondary: "#a78bfa", text: "#ffffff" },
  { primary: "#14b8a6", secondary: "#2dd4bf", text: "#ffffff" },
];

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getShapePath(shape: FaviconShape, size: number): string {
  const r = size / 2;
  const cx = r;
  const cy = r;
  
  switch (shape) {
    case "circle":
      return `<circle cx="${cx}" cy="${cy}" r="${r - 1}" />`;
    case "hexagon": {
      const hexR = r - 1;
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        points.push(`${cx + hexR * Math.cos(angle)},${cy + hexR * Math.sin(angle)}`);
      }
      return `<polygon points="${points.join(" ")}" />`;
    }
    case "square":
      return `<rect x="1" y="1" width="${size - 2}" height="${size - 2}" />`;
    case "rounded":
    default: {
      const radius = Math.max(3, size * 0.18);
      return `<rect x="1" y="1" width="${size - 2}" height="${size - 2}" rx="${radius}" />`;
    }
  }
}

function buildSvg(config: FaviconConfig, size: number): string {
  const initials = getInitials(config.brandName);
  const shapePath = getShapePath(config.shape, size);
  const isGradient = config.style === "gradient";
  const fontSize = Math.round(size * (config.brandName.length > 1 ? 0.38 : 0.48));
  const fontFamily = "system-ui, -apple-system, sans-serif";
  const fontWeight = "700";

  let backgroundContent = "";
  if (isGradient) {
    backgroundContent = `
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${config.primaryColor}" />
          <stop offset="100%" stop-color="${config.secondaryColor}" />
        </linearGradient>
      </defs>
      <g fill="url(#bgGrad)">${shapePath}</g>
    `;
  } else {
    backgroundContent = `<g fill="${config.primaryColor}">${shapePath}</g>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  ${backgroundContent}
  ${config.style !== "icon" ? `
  <text
    x="${size / 2}"
    y="${size / 2 + fontSize * 0.35}"
    text-anchor="middle"
    font-family="${fontFamily}"
    font-size="${fontSize}"
    font-weight="${fontWeight}"
    fill="${config.textColor}"
    dominant-baseline="middle"
  >${initials}</text>` : ""}
</svg>`;
}

export function generateSvgDataUrl(config: FaviconConfig, size: number): string {
  const svg = buildSvg(config, size);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function generateSvgBlob(config: FaviconConfig, size: number): Blob {
  const svg = buildSvg(config, size);
  return new Blob([svg], { type: "image/svg+xml" });
}

export async function svgToPng(svgString: string, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (blob) resolve(blob);
        else reject(new Error("Canvas to blob failed"));
      }, "image/png");
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };
    
    img.src = url;
  });
}

export async function generateFaviconZip(config: FaviconConfig): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  
  const sizes: FaviconSize[] = [16, 32, 48, 64, 128, 180, 192, 512];
  
  // Add SVG favicon
  const svgContent = buildSvg(config, 512);
  zip.file("favicon.svg", svgContent);
  
  // Generate PNGs at various sizes
  for (const size of sizes) {
    const pngBlob = await svgToPng(svgContent, size);
    zip.file(`favicon-${size}x${size}.png`, pngBlob);
  }
  
  // Generate apple-touch-icon
  const appleBlob = await svgToPng(svgContent, 180);
  zip.file("apple-touch-icon.png", appleBlob);
  
  // Generate android-chrome
  const androidBlob = await svgToPng(svgContent, 192);
  zip.file("android-chrome-192x192.png", androidBlob);
  
  const android512Blob = await svgToPng(svgContent, 512);
  zip.file("android-chrome-512x512.png", android512Blob);
  
  // Generate ICO file (multi-resolution)
  const ico16 = await svgToPng(svgContent, 16);
  const ico32 = await svgToPng(svgContent, 32);
  const ico48 = await svgToPng(svgContent, 48);
  const icoData = buildIco([ico16, ico32, ico48]);
  zip.file("favicon.ico", icoData);
  
  // Generate web app manifest
  const manifest = generateWebManifest(config);
  zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));
  
  // Generate browserconfig.xml for Windows tiles
  const browserconfig = generateBrowserConfig();
  zip.file("browserconfig.xml", browserconfig);
  
  return await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}

function buildIco(pngBlobs: Blob[]): Blob {
  // ICO header
  const header = new ArrayBuffer(6);
  const headerView = new DataView(header);
  headerView.setUint16(0, 0, true); // Reserved
  headerView.setUint16(2, 1, true); // Type: 1 = ICO
  headerView.setUint16(4, pngBlobs.length, true); // Number of images
  
  let offset = 6 + pngBlobs.length * 16; // After header + directory entries
  const entries: ArrayBuffer[] = [];
  const imageData: ArrayBuffer[] = [];
  
  for (let i = 0; i < pngBlobs.length; i++) {
    const blob = pngBlobs[i];
    const size = [16, 32, 48][i];
    const entry = new ArrayBuffer(16);
    const entryView = new DataView(entry);
    
    entryView.setUint8(0, size === 256 ? 0 : size); // Width
    entryView.setUint8(1, size === 256 ? 0 : size); // Height
    entryView.setUint8(2, 0); // Color palette
    entryView.setUint8(3, 0); // Reserved
    entryView.setUint16(4, 1, true); // Color planes
    entryView.setUint16(6, 32, true); // Bits per pixel
    entryView.setUint32(8, blob.size, true); // Size of image data
    entryView.setUint32(12, offset, true); // Offset to image data
    
    entries.push(entry);
    
    blob.arrayBuffer().then((buf) => {
      imageData[i] = buf;
    });
    
    offset += blob.size;
  }
  
  // Wait for all array buffers
  return new Blob([header, ...entries, ...imageData], { type: "image/x-icon" });
}

function generateWebManifest(config: FaviconConfig): object {
  const brand = config.brandName.trim();
  return {
    name: brand,
    short_name: brand.length > 12 ? brand.slice(0, 12) : brand,
    description: `${brand} favicon generated by FaviconForge`,
    start_url: "/",
    display: "standalone",
    background_color: config.secondaryColor,
    theme_color: config.primaryColor,
    icons: [
      { src: "android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { src: "favicon.svg", type: "image/svg+xml", sizes: "any" }
    ]
  };
}

function generateBrowserConfig(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/mstile-150x150.png"/>
      <square310x310logo src="/mstile-310x310.png"/>
      <wide310x150logo src="/mstile-310x150.png"/>
      <TileColor>#6366f1</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export function getContrastText(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#ffffff";
  // Using relative luminance formula
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? "#1e293b" : "#ffffff";
}
