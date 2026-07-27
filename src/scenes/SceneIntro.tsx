import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: poppinsFamily } = loadPoppins("normal", {
  weights: ["500", "700", "800"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "500", "600"],
});

const PixelRevealText: React.FC<{
  text: string;
  frame: number;
  startFrame: number;
  bgHex?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ text, frame, startFrame, bgHex = "#ffffff", className, style }) => {
  const chars = useMemo(() => text.split(""), [text]);

  return (
    <span className={className} style={style}>
      {chars.map((char, charIndex) => {
        const charStart = startFrame + charIndex * 2;

        return (
          <span key={charIndex} className="relative inline-block">
            {char === " " ? "\u00A0" : char}
            {char !== " " && (
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                {Array.from({ length: 16 }).map((_, i) => {
                  const seed = (charIndex * 7 + i * 13) % 17;
                  const cellStart = charStart + seed;
                  const cellOpacity = interpolate(
                    frame,
                    [cellStart, cellStart + 8],
                    [1, 0],
                    {
                      easing: Easing.bezier(0.25, 1, 0.5, 1),
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }
                  );

                  if (cellOpacity <= 0) return null;

                  return (
                    <div
                      key={i}
                      style={{
                        backgroundColor: bgHex,
                        opacity: cellOpacity,
                        transform: `scale(${cellOpacity})`,
                      }}
                      className="w-[108%] h-[108%]"
                    />
                  );
                })}
              </div>
            )}
          </span>
        );
      })}
    </span>
  );
};

// Cubic Bezier interpolation helper
// B(t) = (1-t)^3 * P0 + 3*(1-t)^2 * t * P1 + 3*(1-t)*t^2 * P2 + t^3 * P3
const getCubicBezierPoint = (
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
) => {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  };
};

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // Premium Blue theme color
  const blueColor = "#0071e3";

  // Easing zoom (camera push: 0.97 -> 1.04)
  const scale = interpolate(frame, [0, durationInFrames], [0.97, 1.04], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
  });

  // Soft fade in and fade out
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  const fadeOutStart = durationInFrames - 15;
  const exitOpacity = interpolate(frame, [fadeOutStart, durationInFrames], [1, 0], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateRight: "clamp",
  });

  const combinedOpacity = opacity * exitOpacity;

  // Main graph Bezier control points (sleek upward curve)
  const p0 = { x: 150, y: 700 };
  const p1 = { x: width * 0.35, y: 680 };
  const p2 = { x: width * 0.65, y: 350 };
  const p3 = { x: width - 150, y: 300 };

  const pathD = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;

  // Graph animation progress (t from 0 to 1)
  const t = interpolate(frame, [15, 110], [0, 1], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const currentDotPos = getCubicBezierPoint(t, p0, p1, p2, p3);

  // SVG drawing dashoffset
  const pathLength = 1800;
  const drawProgress = interpolate(frame, [15, 110], [pathLength, 0], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Floating background charts generation (deterministic)
  const floatingCharts = useMemo(() => {
    return [
      // Chart 1: Mini bar chart (top left)
      {
        id: 1,
        type: "bars",
        x: width * 0.12,
        y: height * 0.22,
        scale: 0.8,
        driftX: 10,
        driftY: -15,
        opacity: 0.08,
      },
      // Chart 2: Candlesticks (bottom right)
      {
        id: 2,
        type: "candles",
        x: width * 0.82,
        y: height * 0.72,
        scale: 0.9,
        driftX: -12,
        driftY: -8,
        opacity: 0.06,
      },
      // Chart 3: Mini curve (top right)
      {
        id: 3,
        type: "curve",
        x: width * 0.78,
        y: height * 0.25,
        scale: 0.75,
        driftX: -8,
        driftY: -20,
        opacity: 0.07,
      },
      // Chart 4: Grid coordinates (bottom left)
      {
        id: 4,
        type: "grid",
        x: width * 0.15,
        y: height * 0.68,
        scale: 1.0,
        driftX: 15,
        driftY: -10,
        opacity: 0.05,
      },
    ];
  }, [width, height]);

  // Text entrance
  const textTranslateY = interpolate(frame, [5, 45], [30, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [5, 45], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute inset-0 bg-white flex flex-col justify-between p-24 overflow-hidden"
      style={{
        opacity: combinedOpacity,
        scale: `${scale}`,
      }}
    >
      {/* Floating financial charts */}
      {floatingCharts.map((chart) => {
        const dx = chart.x + (frame / durationInFrames) * chart.driftX;
        const dy = chart.y + (frame / durationInFrames) * chart.driftY;
        
        return (
          <div
            key={chart.id}
            className="absolute pointer-events-none"
            style={{
              left: dx,
              top: dy,
              opacity: chart.opacity,
              transform: `scale(${chart.scale})`,
            }}
          >
            {chart.type === "bars" && (
              <svg width="120" height="80" viewBox="0 0 120 80">
                <line x1="0" y1="80" x2="120" y2="80" stroke="#000" strokeWidth="1" />
                <rect x="10" y="40" width="12" height="40" fill={blueColor} />
                <rect x="30" y="25" width="12" height="55" fill={blueColor} />
                <rect x="50" y="50" width="12" height="30" fill={blueColor} />
                <rect x="70" y="15" width="12" height="65" fill={blueColor} />
                <rect x="90" y="35" width="12" height="45" fill={blueColor} />
              </svg>
            )}

            {chart.type === "candles" && (
              <svg width="140" height="90" viewBox="0 0 140 90">
                <line x1="0" y1="90" x2="140" y2="90" stroke="#000" strokeWidth="1" />
                {/* Candle 1 */}
                <line x1="20" y1="20" x2="20" y2="70" stroke={blueColor} strokeWidth="1.5" />
                <rect x="14" y="30" width="12" height="30" fill={blueColor} stroke={blueColor} />
                {/* Candle 2 */}
                <line x1="50" y1="10" x2="50" y2="50" stroke={blueColor} strokeWidth="1.5" />
                <rect x="44" y="20" width="12" height="20" fill="none" stroke={blueColor} strokeWidth="2" />
                {/* Candle 3 */}
                <line x1="80" y1="40" x2="80" y2="85" stroke="#ef4444" strokeWidth="1.5" />
                <rect x="74" y="50" width="12" height="25" fill="#ef4444" stroke="#ef4444" />
                {/* Candle 4 */}
                <line x1="110" y1="15" x2="110" y2="60" stroke={blueColor} strokeWidth="1.5" />
                <rect x="104" y="25" width="12" height="25" fill={blueColor} stroke={blueColor} />
              </svg>
            )}

            {chart.type === "curve" && (
              <svg width="120" height="80" viewBox="0 0 120 80">
                <path d="M 10 70 Q 40 10, 70 50 T 110 20" fill="none" stroke={blueColor} strokeWidth="2" />
                <circle cx="110" cy="20" r="3" fill={blueColor} />
              </svg>
            )}

            {chart.type === "grid" && (
              <svg width="100" height="100" viewBox="0 0 100 100">
                <line x1="0" y1="0" x2="100" y2="0" stroke="#000" strokeWidth="0.5" strokeDasharray="3, 3" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#000" strokeWidth="0.5" strokeDasharray="3, 3" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#000" strokeWidth="0.5" strokeDasharray="3, 3" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#000" strokeWidth="0.5" strokeDasharray="3, 3" />
                <line x1="25" y1="0" x2="25" y2="100" stroke="#000" strokeWidth="0.5" strokeDasharray="3, 3" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="#000" strokeWidth="0.5" strokeDasharray="3, 3" />
                <line x1="75" y1="0" x2="75" y2="100" stroke="#000" strokeWidth="0.5" strokeDasharray="3, 3" />
              </svg>
            )}
          </div>
        );
      })}

      {/* SpaceX/Apple Gridlines overlay (subtle) */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.02] pointer-events-none">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-black" />
        ))}
      </div>



      {/* Main typography (Apple / OpenAI style) */}
      <div 
        className="flex flex-col items-center text-center z-20 space-y-4 my-auto"
        style={{
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
        }}
      >
        <span 
          style={{ fontFamily: interFamily, color: blueColor }}
          className="text-base font-bold tracking-[8px] uppercase pl-[8px]"
        >
          <PixelRevealText text="Compound Strategy" frame={frame} startFrame={15} />
        </span>
        <h1
          style={{
            fontFamily: poppinsFamily,
            color: "#111111",
            letterSpacing: "-0.5px",
            lineHeight: 1.15,
          }}
          className="text-5xl md:text-6xl font-extrabold max-w-3xl leading-none"
        >
          <PixelRevealText text="Your Money Should" frame={frame} startFrame={25} />
          <br />
          <PixelRevealText text="Work For You" frame={frame} startFrame={38} />
        </h1>
      </div>

      {/* Growing Minimal Blue Line Graph */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <path
          d={pathD}
          fill="none"
          stroke={blueColor}
          strokeWidth="3.5"
          strokeDasharray={pathLength}
          strokeDashoffset={drawProgress}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 4px 12px ${blueColor}33)`,
          }}
        />
      </svg>

      {/* Glowing tip pointer */}
      {t > 0 && t < 1 && (
        <div
          className="absolute rounded-full pointer-events-none z-20"
          style={{
            width: 14,
            height: 14,
            left: currentDotPos.x,
            top: currentDotPos.y,
            backgroundColor: blueColor,
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 16px 4px ${blueColor}88`,
          }}
        />
      )}


    </div>
  );
};
