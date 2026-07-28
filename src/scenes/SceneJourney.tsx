import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: poppinsFamily } = loadPoppins("normal", {
  weights: ["700", "800"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "500", "600"],
});

// Cubic Bezier interpolation helper
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

export const SceneJourney: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const blueColor = "#0071e3";

  // Easing zoom (camera push)
  const scale = interpolate(frame, [0, durationInFrames], [0.98, 1.02], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
  });

  // Soft fade in and fade out
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

  // Bezier curve points relative to the 800x550 right container
  const p0 = { x: 100, y: 480 };
  const p1 = { x: 300, y: 430 };
  const p2 = { x: 500, y: 280 };
  const p3 = { x: 700, y: 80 };

  const pathD = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;
  const pathLength = 800;

  // Timeline progress (takes 6 seconds from frame 20 to 200)
  const progress = interpolate(frame, [20, 200], [0, 1], {
    easing: Easing.bezier(0.25, 1, 0.33, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Drawing animation for the curve
  const drawProgress = interpolate(progress, [0, 1], [pathLength, 0]);

  // Position function for trailing coins
  const getCoinPos = (delay: number) => {
    const delayedFrame = Math.max(0, frame - delay);
    const p = interpolate(delayedFrame, [20, 200], [0, 1], {
      easing: Easing.bezier(0.25, 1, 0.33, 1),
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    return getCubicBezierPoint(p, p0, p1, p2, p3);
  };

  const coin0 = getCoinPos(0);
  const coin1 = getCoinPos(4);
  const coin2 = getCoinPos(8);

  // Nodes positions
  const node1Pos = getCubicBezierPoint(0.0, p0, p1, p2, p3);
  const node2Pos = getCubicBezierPoint(0.33, p0, p1, p2, p3);
  const node3Pos = getCubicBezierPoint(0.66, p0, p1, p2, p3);
  const node4Pos = getCubicBezierPoint(1.0, p0, p1, p2, p3);

  // Staggered node scale & opacity reveals
  const getNodeAnim = (revealProgress: number) => {
    const startFrame = 20 + revealProgress * 180;
    const scaleVal = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
      easing: Easing.bezier(0.175, 0.885, 0.32, 1.275), // Bounce reveal
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const opacityVal = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    return { scale: scaleVal, opacity: opacityVal };
  };

  const node1 = getNodeAnim(0.0);
  const node2 = getNodeAnim(0.33);
  const node3 = getNodeAnim(0.66);
  const node4 = getNodeAnim(1.0);

  // Title/Text animations
  const textTranslateY = interpolate(frame, [5, 40], [30, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [5, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute inset-0 bg-[#fafafa] flex flex-col justify-between p-24 overflow-hidden"
      style={{
        opacity: combinedOpacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Soft backdrop gridlines */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.02] pointer-events-none">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-black" />
        ))}
      </div>

      {/* Split Layout: Copy left, Visual Timeline right */}
      <div className="flex flex-1 justify-between items-center z-20 my-auto w-full gap-12">

        {/* Left Side Column: Copy & Title */}
        <div
          className="flex flex-col space-y-6 max-w-xl text-left"
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY - 60}px)`,
          }}
        >
          <span
            style={{ fontFamily: interFamily, color: blueColor }}
            className="text-base font-bold tracking-[8px] uppercase pl-[2px]"
          >
            Investing Journey
          </span>
          <h1
            style={{
              fontFamily: poppinsFamily,
              color: "#111111",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
            }}
            className="text-5xl md:text-6xl font-extrabold mt-3"
          >
            Build Computing
            <br />
            Wealth
          </h1>
          <p
            style={{ fontFamily: interFamily }}
            className="text-black/60 text-2xl leading-relaxed font-light"
          >
            Follow a proven path to transition your active earnings into long-term financial freedom.
          </p>
        </div>

        {/* Right Side Column: Visual Timeline Area */}
        <div className="relative w-[800px] h-[550px] flex-shrink-0">

          {/* SVG Curve Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* Shadow/Glow path */}
            <path
              d={pathD}
              fill="none"
              stroke={`${blueColor}22`}
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Main animated path */}
            <path
              d={pathD}
              fill="none"
              stroke={blueColor}
              strokeWidth="4.5"
              strokeDasharray={pathLength}
              strokeDashoffset={drawProgress}
              strokeLinecap="round"
            />
          </svg>

          {/* Floating moving coins */}
          {progress > 0 && progress < 1 && (
            <>
              {/* Delayed coin 2 */}
              {frame >= 28 && (
                <div
                  className="absolute rounded-full pointer-events-none z-30 flex items-center justify-center bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                  style={{
                    width: 20,
                    height: 20,
                    left: coin2.x,
                    top: coin2.y,
                    transform: "translate(-50%, -50%)",
                    opacity: 0.35,
                  }}
                >
                  <span className="text-[10px]">🪙</span>
                </div>
              )}
              {/* Delayed coin 1 */}
              {frame >= 24 && (
                <div
                  className="absolute rounded-full pointer-events-none z-30 flex items-center justify-center bg-amber-400 border border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                  style={{
                    width: 26,
                    height: 26,
                    left: coin1.x,
                    top: coin1.y,
                    transform: "translate(-50%, -50%)",
                    opacity: 0.6,
                  }}
                >
                  <span className="text-xs">🪙</span>
                </div>
              )}
              {/* Main coin */}
              <div
                className="absolute rounded-full pointer-events-none z-30 flex items-center justify-center bg-amber-400 border-2 border-amber-300 shadow-[0_0_15px_4px_rgba(245,158,11,0.5)]"
                style={{
                  width: 34,
                  height: 34,
                  left: coin0.x,
                  top: coin0.y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="text-sm">🪙</span>
              </div>
            </>
          )}

          {/* Nodes and text blocks inside the relative timeline wrapper */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Node 1: Salary */}
            <div
              className="absolute flex flex-col items-center text-center"
              style={{
                left: node1Pos.x,
                top: node1Pos.y,
                transform: `translate(-50%, -50%) scale(${node1.scale})`,
                opacity: node1.opacity,
                width: 260,
              }}
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-black/[0.03] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                <span style={{ fontFamily: poppinsFamily }} className="text-base font-bold text-slate-800 block">
                  1. Salary
                </span>
                <span style={{ fontFamily: interFamily }} className="text-xs text-slate-400 font-light mt-0.5 block">
                  Earnings from active income
                </span>
              </div>
            </div>

            {/* Node 2: Investment */}
            <div
              className="absolute flex flex-col items-center text-center"
              style={{
                left: node2Pos.x,
                top: node2Pos.y,
                transform: `translate(-50%, -50%) scale(${node2.scale})`,
                opacity: node2.opacity,
                width: 260,
              }}
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-black/[0.03] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                <span style={{ fontFamily: poppinsFamily }} className="text-base font-bold text-slate-800 block">
                  2. Investment
                </span>
                <span style={{ fontFamily: interFamily }} className="text-xs text-slate-400 font-light mt-0.5 block">
                  Moving money into assets
                </span>
              </div>
            </div>

            {/* Node 3: Portfolio */}
            <div
              className="absolute flex flex-col items-center text-center"
              style={{
                left: node3Pos.x,
                top: node3Pos.y,
                transform: `translate(-50%, -50%) scale(${node3.scale})`,
                opacity: node3.opacity,
                width: 260,
              }}
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div className="bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-black/[0.03] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                <span style={{ fontFamily: poppinsFamily }} className="text-base font-bold text-slate-800 block">
                  3. Portfolio
                </span>
                <span style={{ fontFamily: interFamily }} className="text-xs text-slate-400 font-light mt-0.5 block">
                  Diversifying across strategies
                </span>
              </div>
            </div>

            {/* Node 4: Long-Term Growth */}
            <div
              className="absolute flex flex-col items-center text-center"
              style={{
                left: node4Pos.x,
                top: node4Pos.y,
                transform: `translate(-50%, -50%) scale(${node4.scale})`,
                opacity: node4.opacity,
                width: 260,
              }}
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-black/[0.03] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                <span style={{ fontFamily: poppinsFamily }} className="text-base font-bold text-slate-800 block">
                  4. Compounding
                </span>
                <span style={{ fontFamily: interFamily }} className="text-xs text-slate-400 font-light mt-0.5 block">
                  Securing long-term value
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Spacer for bottom layout structure consistency */}
      <div className="h-6" />
    </div>
  );
};
