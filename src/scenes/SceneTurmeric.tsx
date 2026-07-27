import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { TelemetryOverlay } from "../components/TelemetryOverlay";
import { StatCounter } from "../components/StatCounter";
import { COLORS } from "../types";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: poppinsFamily } = loadPoppins("normal", {
  weights: ["700", "800"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "700"],
});

export const SceneTurmeric: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

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

  // Curcumin wave physics simulation
  const wavePoints = 120;
  const pathD = React.useMemo(() => {
    const points = [];
    for (let i = 0; i <= wavePoints; i++) {
      const x = (i / wavePoints) * (width - 200) + 100;
      // Combine two sine waves for organic texture and drive phase with frame
      const angle1 = (i / wavePoints) * Math.PI * 4 + frame * 0.05;
      const angle2 = (i / wavePoints) * Math.PI * 8 - frame * 0.02;
      const y = height / 2 + 100 + Math.sin(angle1) * 35 + Math.cos(angle2) * 15;
      points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return points.join(" ");
  }, [frame, width, height]);

  // Secondary overlay wave for depth
  const pathD2 = React.useMemo(() => {
    const points = [];
    for (let i = 0; i <= wavePoints; i++) {
      const x = (i / wavePoints) * (width - 200) + 100;
      const angle1 = (i / wavePoints) * Math.PI * 3.5 - frame * 0.04;
      const angle2 = (i / wavePoints) * Math.PI * 7 + frame * 0.03;
      const y = height / 2 + 120 + Math.sin(angle1) * 25 + Math.cos(angle2) * 10;
      points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return points.join(" ");
  }, [frame, width, height]);

  // SVG Wave drawing progress
  const pathLength = 1500;
  const waveDrawProgress = interpolate(frame, [10, 60], [pathLength, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  // Circular progress ring telemetry
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // Let's animate progress from 0% to 85% of ring
  const targetPercent = 0.85;
  const ringProgress = interpolate(frame, [20, 80], [circumference, circumference * (1 - targetPercent)], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  // Title entrance
  const textTranslateY = interpolate(frame, [0, 40], [30, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute inset-0 bg-[#111111] overflow-hidden flex flex-col justify-between p-24"
      style={{ opacity: combinedOpacity }}
    >
      <TelemetryOverlay color={COLORS.yellow} theme="dark" gridOpacity={0.06} />

      {/* Heavy radial golden background aura */}
      <div
        className="absolute w-[900px] h-[900px] rounded-full blur-[240px] opacity-25 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.yellow} 0%, rgba(17,17,17,0) 75%)`,
          top: "40%",
          left: "30%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Top Section: Title */}
      <div 
        className="flex flex-col space-y-2 z-20"
        style={{
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
        }}
      />

      {/* Main visual layouts: Text Left, Ring Right */}
      <div className="flex flex-1 justify-between items-center z-20">
        <div className="flex flex-col space-y-4 max-w-xl">
          <span 
            style={{ fontFamily: interFamily, color: COLORS.yellow }} 
            className="text-xs font-bold tracking-[8px]"
          >
            ACTIVE INGREDIENTS // CURCUMA LONGA
          </span>
          <h2 
            style={{ fontFamily: poppinsFamily, color: COLORS.white }}
            className="text-6xl font-extrabold uppercase leading-tight tracking-wide"
          >
            GOLDEN
            <br />
            TURMERIC
          </h2>
          <p 
            style={{ fontFamily: interFamily }} 
            className="text-white/60 text-sm font-light leading-relaxed tracking-wide"
          >
            Hand-selected roots ground under cryogenic conditions to preserve high curcumin levels, bringing you an earthy aroma and deep golden tint.
          </p>
        </div>

        {/* Circular Telemetry Stat Ring */}
        <div className="flex flex-col items-center justify-center mr-12 relative">
          <svg className="w-48 h-48 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="6"
              fill="none"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke={COLORS.yellow}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={ringProgress}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 8px ${COLORS.yellow}44)`,
              }}
            />
          </svg>
          {/* Inner Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span style={{ fontFamily: interFamily }} className="text-[10px] text-white/30 tracking-widest font-mono">
              CURCUMIN
            </span>
            <span style={{ fontFamily: poppinsFamily }} className="text-2xl font-bold text-white mt-1">
              <StatCounter value={5.2} decimals={1} duration={70} suffix="%" />
            </span>
            <span style={{ fontFamily: interFamily, color: COLORS.yellow }} className="text-[9px] tracking-wider mt-1">
              POTENCY
            </span>
          </div>
        </div>
      </div>

      {/* Curcumin SVG Wave Graphic */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {/* Secondary wave shadow */}
        <path
          d={pathD2}
          fill="none"
          stroke={`${COLORS.yellow}18`}
          strokeWidth="1.5"
          strokeDasharray="10, 5"
        />
        {/* Main glowing wave */}
        <path
          d={pathD}
          fill="none"
          stroke={COLORS.yellow}
          strokeWidth="2.5"
          strokeDasharray={pathLength}
          strokeDashoffset={waveDrawProgress}
          style={{
            filter: `drop-shadow(0 0 12px ${COLORS.yellow}66)`,
          }}
        />
      </svg>

      {/* Bottom telemetry detail */}
      <div className="flex justify-between items-center text-[10px] font-mono text-white/30 z-20 border-t border-white/5 pt-4">
        <span>CURCUMIN STABILITY MATRIX: STABLE</span>
        <span>VAISHNAVI LABS QUALITY CONTROL APPROVED</span>
      </div>
    </div>
  );
};
