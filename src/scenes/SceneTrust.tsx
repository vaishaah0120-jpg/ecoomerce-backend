import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: poppinsFamily } = loadPoppins("normal", {
  weights: ["500", "700", "800"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
});

export const SceneTrust: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const blueColor = "#0071e3";
  const greenColor = "#10b981"; // Emerald green for verified checkmark

  // Camera Zoom (subtle zoom push)
  const scale = interpolate(frame, [0, durationInFrames], [0.98, 1.02], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
  });

  // Soft scene fade-in and exit fade-out
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  const fadeOutStart = durationInFrames - 15;
  const exitOpacity = interpolate(frame, [fadeOutStart, durationInFrames], [1, 0], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateRight: "clamp",
  });

  const combinedOpacity = opacity * exitOpacity;

  // ----------------------------------------------------
  // LEFT COLUMN TEXT ANIMATIONS
  // ----------------------------------------------------
  
  // Word 1: Secure
  const secureOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const secureTranslateY = interpolate(frame, [15, 35], [20, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Word 2: Transparent
  const transparentOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const transparentTranslateY = interpolate(frame, [35, 55], [20, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Word 3: Simple
  const simpleOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const simpleTranslateY = interpolate(frame, [55, 75], [20, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Description copy
  const descOpacity = interpolate(frame, [75, 100], [0, 0.6], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const descTranslateY = interpolate(frame, [75, 100], [15, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // ----------------------------------------------------
  // RIGHT COLUMN CARD ANIMATIONS
  // ----------------------------------------------------

  // Card 1: Verified Account Status (Entrance)
  const card1Opacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const card1TranslateY = interpolate(frame, [10, 35], [40, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Security Shield Outer border drawing
  const shieldDrawProgress = interpolate(frame, [25, 55], [300, 0], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Inner Checkmark path drawing
  const checkmarkDrawProgress = interpolate(frame, [50, 75], [50, 0], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Glow Checkmark Completed Pulse
  const pulseScale = interpolate(frame, [70, 95], [0.8, 2.0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const pulseOpacity = interpolate(frame, [70, 95], [0.8, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Card 2: Portfolio Overview (Entrance)
  const card2Opacity = interpolate(frame, [70, 95], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const card2TranslateY = interpolate(frame, [70, 95], [50, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Portfolio Sparkline drawing progress
  const sparklineDrawProgress = interpolate(frame, [90, 140], [500, 0], {
    easing: Easing.bezier(0.25, 1, 0.45, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Portfolio allocation bars width expansion percentages
  const bluechipWidth = interpolate(frame, [95, 125], [0, 60], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const goldWidth = interpolate(frame, [100, 130], [0, 30], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const cashWidth = interpolate(frame, [105, 135], [0, 10], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Sparkline SVG definition
  const chartPoints = [
    { x: 10, y: 80 },
    { x: 70, y: 70 },
    { x: 130, y: 85 },
    { x: 190, y: 50 },
    { x: 250, y: 65 },
    { x: 310, y: 30 },
    { x: 370, y: 35 },
    { x: 430, y: 15 },
  ];

  const sparklineD = useMemo(() => {
    return chartPoints.reduce((acc, p, idx) => {
      return acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
    }, "");
  }, []);

  const sparklineAreaD = useMemo(() => {
    return `${sparklineD} L 430 100 L 10 100 Z`;
  }, [sparklineD]);

  return (
    <div
      className="absolute inset-0 bg-[#fafafa] flex flex-col justify-between p-24 overflow-hidden w-full h-full"
      style={{
        opacity: combinedOpacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Background SpaceX-style grid overlay */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.02] pointer-events-none">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-black" />
        ))}
      </div>

      {/* Main split content layout */}
      <div className="flex flex-1 justify-between items-center z-20 my-auto w-full max-w-7xl mx-auto gap-16">
        
        {/* Left Column: Typography copy */}
        <div className="flex flex-col space-y-6 max-w-xl text-left">
          <span
            style={{ fontFamily: interFamily, color: blueColor }}
            className="text-xs font-semibold tracking-[8px] uppercase pl-[2px]"
          >
            Trust & Transparency
          </span>

          <div className="flex flex-col space-y-2 mt-2">
            <h1
              style={{
                fontFamily: poppinsFamily,
                color: "#111111",
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                opacity: secureOpacity,
                transform: `translateY(${secureTranslateY}px)`,
              }}
              className="text-5xl md:text-6xl font-extrabold"
            >
              Secure.
            </h1>
            <h1
              style={{
                fontFamily: poppinsFamily,
                color: "#111111",
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                opacity: transparentOpacity,
                transform: `translateY(${transparentTranslateY}px)`,
              }}
              className="text-5xl md:text-6xl font-extrabold"
            >
              Transparent.
            </h1>
            <h1
              style={{
                fontFamily: poppinsFamily,
                color: "#111111",
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                opacity: simpleOpacity,
                transform: `translateY(${simpleTranslateY}px)`,
              }}
              className="text-5xl md:text-6xl font-extrabold"
            >
              Simple.
            </h1>
          </div>

          <p
            style={{
              fontFamily: interFamily,
              opacity: descOpacity,
              transform: `translateY(${descTranslateY}px)`,
            }}
            className="text-black/60 text-lg leading-relaxed font-light mt-4"
          >
            A platform designed from the ground up to protect your assets and verify every transaction instantly.
          </p>
        </div>

        {/* Right Column: Cards container */}
        <div className="relative w-[520px] h-[400px] flex-shrink-0 flex flex-col space-y-6">
          
          {/* Card 1: Verified Account */}
          <div
            className="bg-white rounded-2xl border border-black/[0.04] p-5 flex items-center gap-5 transition-all duration-300"
            style={{
              opacity: card1Opacity,
              transform: `translateY(${card1TranslateY}px)`,
              boxShadow: "0 20px 45px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.01)",
            }}
          >
            {/* Animated Shield Area */}
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              {/* Outer Ripple Pulse Circle */}
              {frame >= 70 && (
                <div
                  className="absolute rounded-full border pointer-events-none"
                  style={{
                    width: 56,
                    height: 56,
                    borderColor: greenColor,
                    transform: `scale(${pulseScale})`,
                    opacity: pulseOpacity,
                  }}
                />
              )}

              {/* Shield & Checkmark SVG */}
              <svg width="60" height="60" viewBox="0 0 80 80" className="overflow-visible">
                {/* Shield Path */}
                <path
                  d="M 40 10 L 10 16 C 10 16 10 32 10 42 C 10 60 25 72 40 76 C 55 72 70 60 70 42 C 70 32 70 16 70 16 L 40 10 Z"
                  fill="none"
                  stroke={blueColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="300"
                  strokeDashoffset={shieldDrawProgress}
                />
                
                {/* Checkmark Path */}
                <path
                  d="M 27 42 L 36 50 L 53 32"
                  fill="none"
                  stroke={greenColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="50"
                  strokeDashoffset={checkmarkDrawProgress}
                />
              </svg>
            </div>

            {/* Verification Copy */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span style={{ fontFamily: poppinsFamily }} className="text-sm font-bold text-slate-800">
                  Account Status
                </span>
                <span 
                  style={{ fontFamily: interFamily, backgroundColor: `${greenColor}15`, color: greenColor }}
                  className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  Verified
                </span>
              </div>
              <span style={{ fontFamily: interFamily }} className="text-xs text-slate-400 mt-1">
                Secure Tier-3 Cryptographic Custody
              </span>
              <span style={{ fontFamily: interFamily }} className="text-[10px] text-slate-300 font-mono mt-0.5">
                SECURE KEY: SHA-256 // ENG-APPROVED
              </span>
            </div>
          </div>

          {/* Card 2: Portfolio Overview */}
          <div
            className="bg-white rounded-2xl border border-black/[0.04] p-6 flex flex-col justify-between flex-1 transition-all duration-300"
            style={{
              opacity: card2Opacity,
              transform: `translateY(${card2TranslateY}px)`,
              boxShadow: "0 20px 45px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.01)",
            }}
          >
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <span style={{ fontFamily: interFamily }} className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  PORTFOLIO OVERVIEW
                </span>
                <span style={{ fontFamily: poppinsFamily }} className="text-2xl font-bold text-slate-800 mt-1 block">
                  $84,290.00
                </span>
              </div>
              <div 
                style={{ backgroundColor: `${greenColor}15`, color: greenColor, fontFamily: interFamily }}
                className="px-2 py-1 rounded text-xs font-bold"
              >
                +1.24% Today
              </div>
            </div>

            {/* Middle part: Mini Sparkline area chart */}
            <div className="relative w-full h-[100px] bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100/50 mt-3 flex items-end">
              <svg className="w-full h-full absolute inset-0 pointer-events-none">
                <defs>
                  <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={blueColor} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={blueColor} stopOpacity="0.00" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d={sparklineAreaD}
                  fill="url(#gradient-area)"
                  stroke="none"
                />
                {/* Sparkline curve */}
                <path
                  d={sparklineD}
                  fill="none"
                  stroke={blueColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="500"
                  strokeDashoffset={sparklineDrawProgress}
                />
              </svg>
            </div>

            {/* Bottom part: Staggered bar charts */}
            <div className="flex flex-col space-y-2 mt-4">
              {/* Asset 1: Stocks */}
              <div className="flex flex-col">
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span style={{ fontFamily: interFamily }}>Bluechip Equity</span>
                  <span style={{ fontFamily: interFamily }} className="font-bold text-slate-600">60%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${bluechipWidth}%`, 
                      backgroundColor: blueColor 
                    }} 
                  />
                </div>
              </div>

              {/* Asset 2: Gold */}
              <div className="flex flex-col">
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span style={{ fontFamily: interFamily }}>Gold & Commodities</span>
                  <span style={{ fontFamily: interFamily }} className="font-bold text-slate-600">30%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full rounded-full bg-amber-500" 
                    style={{ 
                      width: `${goldWidth}%`
                    }} 
                  />
                </div>
              </div>

              {/* Asset 3: Cash */}
              <div className="flex flex-col">
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span style={{ fontFamily: interFamily }}>Liquid Cash</span>
                  <span style={{ fontFamily: interFamily }} className="font-bold text-slate-600">10%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full rounded-full bg-emerald-500" 
                    style={{ 
                      width: `${cashWidth}%` 
                    }} 
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Footer telemetry details */}
      <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 z-20 border-t border-black/5 pt-4">
        <span>SECURITY PROTOCOL: SSL-AES256</span>
        <span>VAISHNAVI SYSTEM CORE v1.0.4</span>
      </div>
    </div>
  );
};
