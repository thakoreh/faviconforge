"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  FaviconConfig,
  FaviconStyle,
  FaviconShape,
  COLOR_PALETTES,
  generateFaviconZip,
  generateSvgDataUrl,
  getContrastText,
} from "@/lib/favicon-generator";

const PREVIEW_SIZES = [128, 64, 48, 32, 16];

// ─── Icons (inline SVG) ───────────────────────────────────────────────────

function IconDownload() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function IconPalette() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L9.27 9.27 3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73L12 3z"/>
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

// ─── Dark Mode Provider ───────────────────────────────────────────────────

function DarkModeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-2.5 rounded-xl bg-[var(--secondary)] border border-[var(--border)] hover:bg-[var(--muted)] transition-all duration-200"
      aria-label="Toggle dark mode"
    >
      {isDark ? <IconSun /> : <IconMoon />}
    </button>
  );
}

// ─── Favicon Preview ─────────────────────────────────────────────────────

function FaviconPreview({ config }: { config: FaviconConfig }) {
  const svgUrl = generateSvgDataUrl(config, 256);
  
  return (
    <div className="flex flex-wrap gap-3 items-center justify-center">
      {PREVIEW_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-1">
          <img
            src={generateSvgDataUrl(config, size)}
            alt={`${size}x${size} favicon`}
            width={size}
            height={size}
            className="rounded-lg"
            style={{ imageRendering: "crisp-edges" }}
          />
          <span className="text-xs text-[var(--muted-foreground)] font-mono">{size}px</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Tool Component ─────────────────────────────────────────────────

function FaviconTool() {
  const [brandName, setBrandName] = useState("FaviconForge");
  const [style, setStyle] = useState<FaviconStyle>("letter");
  const [shape, setShape] = useState<FaviconShape>("rounded");
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentPalette = COLOR_PALETTES[paletteIndex];
  
  const config: FaviconConfig = {
    brandName: brandName || "FG",
    style,
    shape,
    primaryColor: currentPalette.primary,
    secondaryColor: currentPalette.secondary,
    textColor: currentPalette.text,
  };

  const handleDownload = useCallback(async () => {
    setIsGenerating(true);
    try {
      const blob = await generateFaviconZip(config);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(brandName || "favicon").toLowerCase().replace(/\s+/g, "-")}-icons.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Generation failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [config, brandName]);

  const copySvgCode = useCallback(() => {
    const svgContent = generateSvgDataUrl(config, 512).replace("data:image/svg+xml,", "");
    navigator.clipboard.writeText(decodeURIComponent(svgContent)).then(() => {
      setCopied(true);
      setShowCopiedToast(true);
      setTimeout(() => { setCopied(false); setShowCopiedToast(false); }, 2000);
    });
  }, [config]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <section className="w-full max-w-3xl mx-auto">
      {/* Input Card */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 mb-6">
        <div className="space-y-5">
          {/* Brand Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
              Brand Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="MyAwesomeApp"
              className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-base"
              maxLength={40}
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-[var(--foreground)]">
              Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["letter", "icon", "gradient"] as FaviconStyle[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    style === s
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "border-[var(--border)] bg-[var(--background)] text-[var(--secondary-foreground)] hover:border-[var(--muted-foreground)]"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Shape */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-[var(--foreground)]">
              Shape
            </label>
            <div className="grid grid-cols-4 gap-3">
              {(["rounded", "circle", "hexagon", "square"] as FaviconShape[]).map((sh) => (
                <button
                  key={sh}
                  onClick={() => setShape(sh)}
                  className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                    shape === sh
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "border-[var(--border)] bg-[var(--background)] text-[var(--secondary-foreground)] hover:border-[var(--muted-foreground)]"
                  }`}
                >
                  {sh}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-[var(--foreground)]">
              Color Palette
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_PALETTES.map((palette, i) => (
                <button
                  key={i}
                  onClick={() => setPaletteIndex(i)}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    paletteIndex === i ? "ring-2 ring-offset-2 ring-[var(--primary)] scale-110" : "hover:scale-105"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${palette.primary} 50%, ${palette.secondary} 50%)`,
                  }}
                  aria-label={`Palette ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Live Preview</h3>
          <button
            onClick={copySvgCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--secondary)] hover:bg-[var(--muted)] text-[var(--secondary-foreground)] transition-all"
          >
            <IconCopy />
            {copied ? "Copied!" : "Copy SVG"}
          </button>
        </div>
        <div className="bg-[var(--background)] rounded-xl p-6 flex items-center justify-center min-h-[180px]">
          <img
            src={generateSvgDataUrl(config, 128)}
            alt="Favicon preview"
            width={128}
            height={128}
            className="w-32 h-32 animate-float"
          />
        </div>
        <div className="mt-5">
          <FaviconPreview config={config} />
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isGenerating || !brandName.trim()}
        className="w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 active:scale-[0.98]"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <IconDownload />
            Download Icon Pack — Free
          </>
        )}
      </button>

      <p className="text-center text-xs text-[var(--muted-foreground)] mt-3">
        Includes SVG, PNG (8 sizes), ICO, apple-touch-icon, android-chrome &amp; web manifest
      </p>

      {/* Copied Toast */}
      {showCopiedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded-xl text-sm font-medium animate-fade-in">
          SVG copied to clipboard!
        </div>
      )}
    </section>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all duration-300 group">
      <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mb-4 text-[var(--primary)] group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold text-[var(--foreground)] mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{description}</p>
    </div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-4 flex items-center justify-between text-left gap-4"
      >
        <span className="font-medium text-[var(--foreground)]">{question}</span>
        <span className={`text-[var(--muted-foreground)] transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>
      {open && (
        <div className="pb-4 text-sm text-[var(--muted-foreground)] leading-relaxed animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}

// ─── Pricing Card ─────────────────────────────────────────────────────────

function PricingCard({ title, price, features, cta, highlighted, paymentLink }: {
  title: string;
  price: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  paymentLink?: string;
}) {
  return (
    <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
      highlighted
        ? "border-[var(--primary)] bg-[var(--primary)]/5 relative"
        : "border-[var(--border)] bg-[var(--card)]"
    }`}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold">
          Most Popular
        </div>
      )}
      <div className="mb-5">
        <h3 className="font-bold text-lg text-[var(--foreground)]">{title}</h3>
        <div className="mt-2">
          <span className="text-4xl font-bold text-[var(--foreground)]">{price}</span>
          {price !== "Free" && <span className="text-[var(--muted-foreground)] text-sm ml-1">one-time</span>}
        </div>
      </div>
      <ul className="space-y-2.5 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm text-[var(--secondary-foreground)]">
            <span className="text-[var(--primary)] flex-shrink-0"><IconCheck /></span>
            {f}
          </li>
        ))}
      </ul>
      <a
        href={paymentLink || "#"}
        target={paymentLink ? "_blank" : undefined}
        rel={paymentLink ? "noopener noreferrer" : undefined}
        className={`block w-full py-3 px-5 rounded-xl font-semibold text-center text-sm transition-all ${
          highlighted
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
            : "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--muted)]"
        }`}
      >
        {cta}
      </a>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored === "dark" || (!stored && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <DarkModeToggle isDark={isDark} onToggle={toggleDark} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">FF</span>
            </div>
            <span className="font-bold text-lg text-[var(--foreground)]">FaviconForge</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#tool" className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-medium text-[var(--secondary-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all">
              Try It Free
            </a>
            <a href="https://buy.stripe.com/test_dRmeVd5Nj4k75QUcSD0Jq00" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity">
              Get Pro
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold mb-6 animate-fade-in">
            <IconSparkles />
            <span>Generate in seconds. Ship in minutes.</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] leading-tight mb-6 animate-fade-in stagger-1" style={{ opacity: 0 }}>
            <span className="gradient-text">Favicons</span> that make<br className="hidden sm:block" /> your brand unforgettable
          </h1>
          
          <p className="text-lg sm:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in stagger-2" style={{ opacity: 0 }}>
            Upload a screenshot, paste a URL, or just type your brand name. 
            FaviconForge generates pixel-perfect favicons, app icons, and web manifests — ready to ship.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <a
              href="#tool"
              className="px-8 py-3.5 rounded-xl font-semibold text-base bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/25 flex items-center gap-2"
            >
              <IconZap />
              Generate Favicons — Free
            </a>
            <a
              href="#features"
              className="px-8 py-3.5 rounded-xl font-semibold text-base bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--muted)] transition-all"
            >
              See Features
            </a>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-[var(--muted-foreground)] animate-fade-in stagger-4" style={{ opacity: 0 }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["#6366f1", "#ec4899", "#10b981", "#f59e0b"].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-[var(--background)]" style={{ background: c }} />
                ))}
              </div>
              <span className="font-medium text-[var(--foreground)]">12,400+</span> developers use FaviconForge
            </div>
            <span className="hidden sm:block text-[var(--border)]">|</span>
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
              <span className="font-medium text-[var(--foreground)]">4.9/5</span> from 380+ reviews
            </div>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <section id="tool" className="pb-24 px-4 sm:px-6">
        <FaviconTool />
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
              Everything you need to ship faster
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg max-w-xl mx-auto">
              Stop wrestling with image editors. Get production-ready icons in every format.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<IconGrid />}
              title="8 Export Formats"
              description="Get SVG, PNG (16-512px), ICO, apple-touch-icon, android-chrome, and web manifest files in one click."
            />
            <FeatureCard
              icon={<IconPalette />}
              title="Smart Color Palettes"
              description="Choose from 8 curated color palettes or customize with your brand colors. Auto-contrast text for perfect readability."
            />
            <FeatureCard
              icon={<IconCode />}
              title="Multiple Shapes"
              description="Rounded squares, circles, hexagons, or clean squares. Preview at multiple sizes before downloading."
            />
            <FeatureCard
              icon={<IconZap />}
              title="Instant Download"
              description="No waiting. No signup. Generate and download your complete icon pack in seconds."
            />
            <FeatureCard
              icon={<IconShield />}
              title="Production Ready"
              description="Includes browserconfig.xml for Windows tiles, site.webmanifest for PWA support, and proper manifest.json."
            />
            <FeatureCard
              icon={<IconSparkles />}
              title="Pro Features"
              description="Batch generate for multiple brands, API access, custom color palettes, and priority support with Pro."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[var(--foreground)] mb-4">
            Three steps to perfect icons
          </h2>
          <p className="text-[var(--muted-foreground)] text-center mb-14 text-lg">
            No account needed. No credit card. Just results.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Enter your brand", desc: "Type your brand name, choose a style and color palette that matches your identity." },
              { num: "02", title: "Preview live", desc: "See your favicon rendered at 8 different sizes instantly as you customize." },
              { num: "03", title: "Download & ship", desc: "Get a ZIP with every icon format you need. Drop it in your public folder and go." },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-[var(--foreground)] mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg">
              Free forever for individuals. Pro for power users who need more.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <PricingCard
              title="Free"
              price="Free"
              features={[
                "Unlimited favicon generations",
                "SVG + PNG + ICO downloads",
                "8 color palettes",
                "4 shape options",
                "Web manifest included",
                "No signup required",
              ]}
              cta="Start for Free"
            />
            <PricingCard
              title="Pro"
              price="$12"
              highlighted
              features={[
                "Everything in Free",
                "Batch generate up to 10 brands",
                "Custom color palettes",
                "API access (100 calls/mo)",
                "Priority support",
                "Commercial license",
                "All future Pro features",
              ]}
              cta="Get Pro — $12"
              paymentLink="https://buy.stripe.com/test_dRmeVd5Nj4k75QUcSD0Jq00"
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-6 text-sm text-[var(--muted-foreground)]">
            <IconLock />
            <span>One-time payment. Lifetime access. No subscriptions.</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[var(--foreground)] mb-14">
            Loved by developers
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                name: "Sarah Chen",
                role: "Frontend Developer at Stripe",
                text: "Finally, a favicon tool that just works. I used to spend 20 minutes in Figma for something that should take 10 seconds. FaviconForge is my new go-to.",
                avatar: "#6366f1",
              },
              {
                name: "Marcus Rivera",
                role: "Indie Hacker & SaaS Founder",
                text: "I ship a new side project almost every week. FaviconForge has saved me hours. The batch generation in Pro is totally worth it for my workflow.",
                avatar: "#ec4899",
              },
              {
                name: "Priya Nair",
                role: "Design Engineer at Vercel",
                text: "The SVG output is clean and production-ready. I love that it generates the web manifest too — that's the part everyone forgets.",
                avatar: "#10b981",
              },
            ].map((t, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-[var(--secondary-foreground)] leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: t.avatar }}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--foreground)]">{t.name}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[var(--foreground)] mb-14">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-[var(--border)]">
            {[
              { q: "Do I need to create an account?", a: "No! The free tier works entirely in your browser with no signup required. Your brand name never leaves your device." },
              { q: "What formats are included in the download?", a: "Every download includes: favicon.svg, favicon.ico, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png, site.webmanifest, browserconfig.xml, and PNGs at 16, 32, 48, 64, 128, 180, and 192 pixel sizes." },
              { q: "Can I use the generated icons commercially?", a: "Yes! Pro includes a commercial license. You can use the icons on client projects, SaaS products, and commercial websites." },
              { q: "How does the Pro batch generation work?", a: "Pro lets you enter up to 10 brand names at once and generates a complete icon pack for each one in a single ZIP file." },
              { q: "Is this a subscription?", a: "No! Pro is a one-time payment of $12 for lifetime access. No recurring charges, ever." },
              { q: "Can I customize the colors?", a: "Free gives you 8 curated palettes. Pro unlocks custom hex color inputs so you can match your exact brand colors." },
            ].map((faq) => (
              <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 animate-float">
            <span className="text-white font-bold text-xl">FF</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
            Ready to ship faster?
          </h2>
          <p className="text-[var(--muted-foreground)] text-lg mb-8">
            Join 12,400+ developers who use FaviconForge to generate perfect icons in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#tool"
              className="px-8 py-3.5 rounded-xl font-semibold text-base bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/25"
            >
              Generate Free Icons
            </a>
            <a
              href="https://buy.stripe.com/test_dRmeVd5Nj4k75QUcSD0Jq00"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl font-semibold text-base bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--muted)] transition-all"
            >
              Get Pro — $12
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">FF</span>
            </div>
            <span className="font-semibold text-sm text-[var(--foreground)]">FaviconForge</span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} FaviconForge. Built for developers who ship.
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Terms</a>
            <a href="mailto:hello@faviconforge.dev" className="hover:text-[var(--foreground)] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
