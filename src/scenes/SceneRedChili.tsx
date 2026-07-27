import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { TelemetryOverlay } from "../components/TelemetryOverlay";
import { StatCounter } from "../components/StatCounter";
import { COLORS } from "../types";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: poppinsFamily } = loadPoppins("normal", {
  weights: ["800"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "700"],
});

// Quadratic Bezier interpolation function
// B(t) = (1-t)^2 * P0 + 2*(1-t)*t * P1 + t^2 * P2
const getBezierPoint = (
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
};

export const SceneRedChili: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();

  // Transitions
  const sceneOpacity = interpolate(frame, [0, 20], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateRight: "clamp",
  });
  const combinedOpacity = sceneOpacity * exitOpacity;

  // Bezier curve points
  const p0 = { x: 150, y: 750 };
  const p1 = { x: width / 2 + 100, y: 150 };
  const p2 = { x: width - 150, y: 550 };

  // Interpolate trajectory parameter t from 0 to 1
  const t = interpolate(frame, [15, 80], [0, 1], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const dotPos = getBezierPoint(t, p0, p1, p2);

  // SVG path definition
  const pathD = `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`;

  // Trajectory drawing progress
  const pathLength = 1600;
  const pathDrawProgress = interpolate(frame, [10, 60], [pathLength, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  // Text slide animations
  const textTranslateX = interpolate(frame, [0, 45], [-40, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [0, 45], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute inset-0 bg-[#111111] overflow-hidden flex flex-col justify-between p-24"
      style={{ opacity: combinedOpacity }}
    >
      <TelemetryOverlay color={COLORS.red} theme="dark" gridOpacity={0.06} />

      {/* Intense Red Radial Glow */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[200px] opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.red} 0%, rgba(17,17,17,0) 70%)`,
          bottom: "-10%",
          left: "5%",
        }}
      />

      {/* Main Content Layout */}
      <div className="flex flex-1 justify-between items-center z-20">
        <div 
          className="flex flex-col space-y-4 max-w-xl"
          style={{
            opacity: textOpacity,
            transform: `translateX(${textTranslateX}px)`,
          }}
        >
          <span 
            style={{ fontFamily: interFamily, color: COLORS.red }} 
            className="text-xs font-bold tracking-[8px]"
          >
            THERMAL SCROLL // CAPSICUM ANNUUM
          </span>
          <h2 
            style={{ fontFamily: poppinsFamily, color: COLORS.white }}
            className="text-6xl font-extrabold uppercase leading-tight tracking-wide"
          >
            VIBRANT
            <br />
            RED CHILI
          </h2>
          <p 
            style={{ fontFamily: interFamily }} 
            className="text-white/60 text-sm font-light leading-relaxed tracking-wide"
          >
            Carefully harvested at peak maturity, our red chilies offer a brilliant natural crimson coloring and a sharp, controlled heat profile tested for consistency.
          </p>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="flex flex-col space-y-6 mr-12 w-64">
          <div className="border border-white/10 bg-white/[0.01] p-6 rounded-lg backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: COLORS.red }} />
            <span style={{ fontFamily: interFamily }} className="text-[10px] text-white/30 tracking-widest font-mono">
              SCOVILLE RATING
            </span>
            <div style={{ fontFamily: poppinsFamily }} className="text-3xl font-bold text-white mt-1">
              <StatCounter value={40000} duration={60} suffix=" SHU" />
            </div>
            <span style={{ fontFamily: interFamily }} className="text-[9px] text-white/40 tracking-wider font-mono">
              HEAT CATEGORY: HIGH
            </span>
          </div>

          <div className="border border-white/10 bg-white/[0.01] p-6 rounded-lg backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: COLORS.red }} />
            <span style={{ fontFamily: interFamily }} className="text-[10px] text-white/30 tracking-widest font-mono">
              CAPSAICIN RETAINED
            </span>
            <div style={{ fontFamily: poppinsFamily }} className="text-3xl font-bold text-white mt-1">
              <StatCounter value={100} duration={60} suffix="%" />
            </div>
            <span style={{ fontFamily: interFamily }} className="text-[9px] text-white/40 tracking-wider font-mono">
              ZERO ARTIFICIAL SHADE
            </span>
          </div>
        </div>
      </div>

      {/* Trajectory path overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {/* Bezier track */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1.5"
          strokeDasharray="5, 5"
        />
        {/* Animated red trajectory line */}
        <path
          d={pathD}
          fill="none"
          stroke={COLORS.red}
          strokeWidth="2"
          strokeDasharray={pathLength}
          strokeDashoffset={pathDrawProgress}
          style={{
            filter: `drop-shadow(0 0 10px ${COLORS.red}55)`,
          }}
        />
      </svg>

      {/* SpaceX-style Glowing Dot running along path */}
      {t > 0 && t < 1 && (
        <div
          className="absolute rounded-full z-20 pointer-events-none"
          style={{
            width: 12,
            height: 12,
            left: dotPos.x,
            top: dotPos.y,
            backgroundColor: COLORS.red,
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 15px 4px ${COLORS.red}`,
          }}
        />
      )}

      {/* Bottom telemetry detail */}
      <div className="flex justify-between items-center text-[10px] font-mono text-white/30 z-20 border-t border-white/5 pt-4">
        <span>THERMO-STABILITY: COMPLIANT</span>
        <span>VAISHNAVI LABS SPECTROMETER APPROVED</span>
      </div>
    </div>
  );
};
