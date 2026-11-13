/**
 * Generates a complete, self-contained single-file HTML document
 * in the Ultra-Luxury "Pearl White & Frosted Glassmorphism" theme
 * with Tailwind CSS via CDN, Google Fonts, custom CSS for shimmer buttons & spotlights,
 * and Vanilla JS interactivity.
 */
export function getStandaloneHtml(): string {
  const rootMarkup =
    typeof document !== 'undefined' ? document.getElementById('root')?.innerHTML || '' : '';

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth overflow-x-hidden light" style="color-scheme: light only;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>Make Your Fly Easy — Pakistan's Premier Enterprise Software House & Custom App Creators</title>
  <meta name="description" content="Make Your Fly Easy — 100% Ready-to-Deploy Enterprise ERPs (Pakistan Customs, Bonded Carrier, TIR, ATT, Advocates Legal Suite, Universal Finance), Multi-Vendor E-Commerce & Delivery Apps, and Proprietary AI Solutions." />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root, html, body {
      color-scheme: light only;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 55%, #F1F5F9 100%);
      color: #0F172A;
      overflow-x: hidden;
    }
    h1, h2, h3, h4, .font-display {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      letter-spacing: -0.02em;
    }
    code, pre, .font-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
    .tabular-nums { font-variant-numeric: tabular-nums; }
    .hero-fluid-heading { font-size: clamp(1.5rem, 3.2vw, 2.65rem); line-height: 1.18; }
    .section-fluid-heading { font-size: clamp(1.25rem, 2.4vw, 2rem); line-height: 1.22; }
    .card-fluid-title { font-size: 1rem; font-weight: 700; line-height: 1.35; }
    @media (min-width: 768px) { .card-fluid-title { font-size: 1.15rem; } }
    .body-fluid-copy { font-size: 0.84rem; line-height: 1.65; }
    @media (min-width: 768px) { .body-fluid-copy { font-size: 0.94rem; } }
    .text-royal-gradient {
      background: linear-gradient(135deg, #0F172A 0%, #9A7117 50%, #0284C7 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .text-gold-gradient {
      background: linear-gradient(135deg, #9A7117 0%, #D4AF37 52%, #8A6210 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .spotlight-card {
      position: relative;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(212, 175, 55, 0.28);
      box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 1), 0 12px 32px -4px rgba(15, 23, 42, 0.05);
    }
    .btn-luxury-primary {
      background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 60%, #FEF9C3 100%);
      color: #0F172A;
      border: 1px solid rgba(212, 175, 55, 0.65);
    }
    .btn-luxury-gold {
      background: linear-gradient(135deg, #FDE08D 0%, #D4AF37 55%, #C59B27 100%);
      color: #0F172A;
      font-weight: 700;
      border: 1px solid rgba(154, 113, 23, 0.45);
    }
    .btn-luxury-glass {
      background: rgba(255, 255, 255, 0.92);
      color: #0F172A;
      border: 1px solid rgba(15, 23, 42, 0.12);
    }
  </style>
</head>
<body class="bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-[#D4AF37]/25 overflow-x-hidden">
  ${rootMarkup}
</body>
</html>`;
}

export const generateStandaloneSingleFileHtml = getStandaloneHtml;
