import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { TelemetryOverlay } from "../components/TelemetryOverlay";
import { COLORS } from "../types";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: poppinsFamily } = loadPoppins("normal", {
  weights: ["800"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "700"],
});

export const SceneCryo: React.FC = () => {
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

  // Temperature plunge countdown (+25 to -196)
  const tempVal = interpolate(frame, [10, 70], [25, -196], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  }).toFixed(0);

  // Concentric circle rotation
  const rot1 = frame * 0.4;
  const rot2 = -frame * 0.25;

  // Graph plotting path: simulates volatility chart
  const graphPoints = 40;
  const graphPathD = useMemo(() => {
    const points = [];
    const drawPercent = Math.min(1, frame / 90);
    const visiblePointsCount = Math.floor(graphPoints * drawPercent);
    
    for (let i = 0; i <= visiblePointsCount; i++) {
      const x = (i / graphPoints) * 400;
      // Synthesize noise that settles down as temp freezes
      const freezeFactor = Math.max(0.05, 1 - (i / graphPoints));
      const val = Math.sin(i * 0.8 + frame * 0.1) * 35 * freezeFactor;
      const y = 80 + val;
      points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return points.join(" ");
  }, [frame]);

  // Cold mist particles
  const mistParticles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const seed = i * 23;
      const x = (Math.sin(seed) * 0.5 + 0.5) * (width - 400) + 200;
      const y = (Math.cos(seed * 2) * 0.5 + 0.5) * (height - 400) + 200;
      const vx = (Math.sin(seed * 3) - 0.2) * 0.3;
      const vy = -(Math.cos(seed * 4) * 0.5 + 0.5) * 0.8;
      const maxOpacity = 0.05 + (i % 5) * 0.03;
      const size = 60 + (i % 4) * 40;
      return { x, y, vx, vy, maxOpacity, size };
    });
  }, [width, height]);

  // Text transition
  const textTranslateY = interpolate(frame, [0, 45], [40, 0], {
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
      <TelemetryOverlay color={COLORS.yellow} theme="dark" gridOpacity={0.06} />

      {/* Deep yellow/saffron central aura representing technology glow */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[260px] opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.yellow} 0%, rgba(17,17,17,0) 70%)`,
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Floating Cold Mist Particles */}
      {mistParticles.map((m, i) => {
        const cx = m.x + m.vx * frame;
        const cy = m.y + m.vy * frame;
        const op = interpolate(frame, [0, 30], [0, m.maxOpacity], { extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none bg-white blur-[50px]"
            style={{
              width: m.size,
              height: m.size,
              left: cx,
              top: cy,
              opacity: op,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* Central Visual Layout */}
      <div className="flex flex-1 justify-between items-center z-20">
        <div 
          className="flex flex-col space-y-4 max-w-xl"
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
          }}
        >
          <span 
            style={{ fontFamily: interFamily, color: COLORS.yellow }} 
            className="text-xs font-bold tracking-[8px]"
          >
            PROCESSING GRID // CRYOGENIC LOCK
          </span>
          <h2 
            style={{ fontFamily: poppinsFamily, color: COLORS.white }}
            className="text-6xl font-extrabold uppercase leading-tight tracking-wide"
          >
            FLAVOR
            <br />
            LOCKED-IN
          </h2>
          <p 
            style={{ fontFamily: interFamily }} 
            className="text-white/60 text-sm font-light leading-relaxed tracking-wide"
          >
            Our spices are ground under liquid nitrogen at sub-zero temperatures. This cryogenic grinding prevents the loss of heat-sensitive essential oils, securing ultimate aroma and spice.
          </p>
        </div>

        {/* Telemetry Dials & Temperature Count */}
        <div className="flex items-center space-x-12 mr-8">
          {/* Temperature HUD */}
          <div className="flex flex-col space-y-4 items-center justify-center p-8 border border-white/10 bg-white/[0.02] rounded-lg backdrop-blur-md w-60 h-60">
            <span style={{ fontFamily: interFamily }} className="text-[10px] text-white/40 tracking-widest font-mono">
              CRYOGENIC SYSTEM
            </span>
            <div className="flex flex-col items-center">
              <span 
                style={{ fontFamily: poppinsFamily, color: COLORS.yellow }} 
                className="text-5xl font-bold tracking-tight text-center"
              >
                {tempVal}°C
              </span>
              <span style={{ fontFamily: interFamily }} className="text-[10px] text-white/50 tracking-widest font-mono mt-1">
                LIQUID NITROGEN
              </span>
            </div>
            <span 
              style={{ fontFamily: interFamily, color: COLORS.yellow }} 
              className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-yellow-500/30 bg-yellow-500/10 ${
                Number(tempVal) < -150 ? "animate-pulse" : ""
              }`}
            >
              {Number(tempVal) < -150 ? "CRYO-LOCK ACTIVE" : "COOLING DOWN"}
            </span>
          </div>

          {/* Dials & mini graph */}
          <div className="flex flex-col space-y-4">
            {/* Concentric rotating circles diagram */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="absolute w-full h-full" style={{ transform: `rotate(${rot1}deg)` }}>
                <circle cx="72" cy="72" r="65" stroke={COLORS.yellow} strokeWidth="1" strokeDasharray="10, 8" fill="none" opacity="0.3" />
                <circle cx="72" cy="72" r="50" stroke="#FFFFFF" strokeWidth="0.75" strokeDasharray="3, 3" fill="none" opacity="0.2" />
              </svg>
              <svg className="absolute w-full h-full" style={{ transform: `rotate(${rot2}deg)` }}>
                <circle cx="72" cy="72" r="58" stroke={COLORS.saffron} strokeWidth="1.5" strokeDasharray="40, 20" fill="none" opacity="0.5" />
                <circle cx="72" cy="72" r="40" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1, 10" fill="none" opacity="0.4" />
              </svg>
              {/* Core indicator */}
              <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center bg-[#111111]">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.yellow }} />
              </div>
            </div>

            {/* Live Chart Visualizer */}
            <div className="w-48 h-20 border border-white/10 bg-white/[0.01] rounded p-2 flex flex-col justify-between relative overflow-hidden">
              <span style={{ fontFamily: interFamily }} className="text-[8px] text-white/30 tracking-widest font-mono">
                VOLATILE OILS RETENTION
              </span>
              <svg className="w-full h-12">
                <path
                  d={graphPathD}
                  fill="none"
                  stroke={COLORS.yellow}
                  strokeWidth="1.5"
                  opacity="0.8"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom telemetry detail */}
      <div className="flex justify-between items-center text-[10px] font-mono text-white/30 z-20 border-t border-white/5 pt-4">
        <span>TEMPERATURE SENSOR GRID: SECURE</span>
        <span>NITROGEN INJECTION PRESSURE: 4.8 BAR</span>
      </div>
    </div>
  );
};
