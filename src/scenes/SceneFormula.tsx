import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { TelemetryOverlay } from "../components/TelemetryOverlay";
import { StatCounter } from "../components/StatCounter";
import { COLORS } from "../types";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: poppinsFamily } = loadPoppins("normal", {
  weights: ["700"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "700"],
});

export const SceneFormula: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Entrance fade-in and slide-up
  const sceneOpacity = interpolate(frame, [0, 20], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  // Exit fade-out
  const exitOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateRight: "clamp",
  });

  const combinedOpacity = sceneOpacity * exitOpacity;

  // Title elements drawing progress
  const titleWipe = interpolate(frame, [10, 45], [0, 100], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  // Cards animation offsets
  const card1Translate = interpolate(frame, [20, 50], [40, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });
  const card1Opacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  const card2Translate = interpolate(frame, [25, 55], [40, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });
  const card2Opacity = interpolate(frame, [25, 55], [0, 1], {
    extrapolateRight: "clamp",
  });

  const card3Translate = interpolate(frame, [30, 60], [40, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });
  const card3Opacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute inset-0 bg-[#111111] flex flex-col justify-center items-center overflow-hidden"
      style={{ opacity: combinedOpacity }}
    >
      {/* SpaceX telemetry overlay background */}
      <TelemetryOverlay color={COLORS.saffron} theme="dark" gridOpacity={0.08} />

      {/* Radial glow background */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[200px] opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.saffron} 0%, rgba(17,17,17,0) 80%)`,
          top: "10%",
          left: "20%",
        }}
      />

      <div className="z-20 w-full max-w-5xl px-12 flex flex-col space-y-12">
        {/* Core Formula Title Section */}
        <div className="flex flex-col space-y-2 border-l-2 border-white/20 pl-6">
          <span 
            style={{ fontFamily: interFamily, color: COLORS.saffron }}
            className="text-xs font-bold tracking-[8px] uppercase"
          >
            Scientific Purity Standard
          </span>
          <div className="relative overflow-hidden">
            <h2
              style={{
                fontFamily: poppinsFamily,
                color: COLORS.white,
              }}
              className="text-4xl md:text-5xl font-bold uppercase tracking-wider"
            >
              Pure. Powerful. Perfected.
            </h2>
            <div 
              className="absolute top-0 right-0 bottom-0 bg-[#111111]"
              style={{ width: `${100 - titleWipe}%` }}
            />
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            className="border border-white/10 bg-white/[0.02] p-6 rounded-lg backdrop-blur-md flex flex-col justify-between h-48 relative overflow-hidden group"
            style={{
              opacity: card1Opacity,
              transform: `translateY(${card1Translate}px)`,
            }}
          >
            <div className="absolute top-0 left-0 w-[2px] h-full bg-red-600" style={{ backgroundColor: COLORS.red }} />
            <div className="flex justify-between items-start">
              <span style={{ fontFamily: interFamily }} className="text-[10px] text-white/40 tracking-widest font-mono">
                METRIC // 01
              </span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.red }} />
            </div>
            <div className="flex flex-col space-y-1">
              <span style={{ fontFamily: interFamily }} className="text-white/60 text-xs tracking-wider font-mono">
                PURITY INDEX
              </span>
              <span style={{ fontFamily: poppinsFamily }} className="text-3xl font-bold text-white">
                <StatCounter value={100} duration={60} suffix="%" />
              </span>
            </div>
            <span style={{ fontFamily: interFamily }} className="text-[9px] text-white/30 tracking-wider">
              ZERO FILLERS • ZERO CHEMICALS
            </span>
          </div>

          {/* Card 2 */}
          <div
            className="border border-white/10 bg-white/[0.02] p-6 rounded-lg backdrop-blur-md flex flex-col justify-between h-48 relative overflow-hidden"
            style={{
              opacity: card2Opacity,
              transform: `translateY(${card2Translate}px)`,
            }}
          >
            <div className="absolute top-0 left-0 w-[2px] h-full bg-orange-500" style={{ backgroundColor: COLORS.saffron }} />
            <div className="flex justify-between items-start">
              <span style={{ fontFamily: interFamily }} className="text-[10px] text-white/40 tracking-widest font-mono">
                METRIC // 02
              </span>
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: COLORS.saffron }} />
            </div>
            <div className="flex flex-col space-y-1">
              <span style={{ fontFamily: interFamily }} className="text-white/60 text-xs tracking-wider font-mono">
                AROMA LOCK
              </span>
              <span style={{ fontFamily: poppinsFamily }} className="text-3xl font-bold text-white">
                <StatCounter value={99.8} decimals={1} duration={70} suffix="%" />
              </span>
            </div>
            <span style={{ fontFamily: interFamily }} className="text-[9px] text-white/30 tracking-wider font-mono">
              CRYOGENIC PROCESSING MATRIX
            </span>
          </div>

          {/* Card 3 */}
          <div
            className="border border-white/10 bg-white/[0.02] p-6 rounded-lg backdrop-blur-md flex flex-col justify-between h-48 relative overflow-hidden"
            style={{
              opacity: card3Opacity,
              transform: `translateY(${card3Translate}px)`,
            }}
          >
            <div className="absolute top-0 left-0 w-[2px] h-full bg-yellow-400" style={{ backgroundColor: COLORS.yellow }} />
            <div className="flex justify-between items-start">
              <span style={{ fontFamily: interFamily }} className="text-[10px] text-white/40 tracking-widest font-mono">
                METRIC // 03
              </span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.yellow }} />
            </div>
            <div className="flex flex-col space-y-1">
              <span style={{ fontFamily: interFamily }} className="text-white/60 text-xs tracking-wider font-mono">
                ORGANIC GRADE
              </span>
              <span style={{ fontFamily: poppinsFamily }} className="text-3xl font-bold text-white uppercase">
                A++
              </span>
            </div>
            <span style={{ fontFamily: interFamily }} className="text-[9px] text-white/30 tracking-wider">
              DIRECT FARM SOURCING
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
