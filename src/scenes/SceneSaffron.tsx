import React, { useMemo } from "react";
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

export const SceneSaffron: React.FC = () => {
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

  // Animate text elements
  const textTranslateY = interpolate(frame, [0, 50], [50, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [0, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Deterministic Saffron threads animation (floating and rotating)
  const threads = useMemo(() => {
    return [
      { id: 1, x: width * 0.5, y: height * 0.3, scale: 1.2, speedX: 0.1, speedY: -0.15, rotSpeed: 0.2, length: 110 },
      { id: 2, x: width * 0.65, y: height * 0.45, scale: 0.8, speedX: -0.12, speedY: -0.1, rotSpeed: -0.15, length: 90 },
      { id: 3, x: width * 0.55, y: height * 0.65, scale: 1.0, speedX: 0.08, speedY: -0.08, rotSpeed: 0.12, length: 100 },
      { id: 4, x: width * 0.72, y: height * 0.2, scale: 0.6, speedX: -0.06, speedY: -0.12, rotSpeed: -0.22, length: 80 },
    ];
  }, [width, height]);

  return (
    <div
      className="absolute inset-0 bg-[#111111] overflow-hidden flex flex-col justify-between p-24"
      style={{ opacity: combinedOpacity }}
    >
      <TelemetryOverlay color={COLORS.saffron} theme="dark" gridOpacity={0.06} />

      {/* Saffron Radial Glow */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[220px] opacity-25 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COLORS.saffron} 0%, rgba(17,17,17,0) 70%)`,
          top: "20%",
          right: "5%",
        }}
      />

      {/* Content Layout */}
      <div className="flex flex-1 justify-between items-center z-20">
        <div 
          className="flex flex-col space-y-4 max-w-xl"
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
          }}
        >
          <span 
            style={{ fontFamily: interFamily, color: COLORS.saffron }} 
            className="text-xs font-bold tracking-[8px]"
          >
            LUXURY EXCLUSIVES // CROCUS SATIVUS
          </span>
          <h2 
            style={{ fontFamily: poppinsFamily, color: COLORS.white }}
            className="text-6xl font-extrabold uppercase leading-tight tracking-wide"
          >
            ROYAL
            <br />
            SAFFRON
          </h2>
          <p 
            style={{ fontFamily: interFamily }} 
            className="text-white/60 text-sm font-light leading-relaxed tracking-wide"
          >
            The world’s most precious spice, hand-picked in the fields of Kashmir. Deep crimson stigmas rich in Crocin, offering a sweet, honeyed aroma and luxurious hue.
          </p>
        </div>

        {/* Technical Stats Block */}
        <div className="flex flex-col space-y-6 mr-12 w-64">
          <div className="border border-white/10 bg-white/[0.01] p-6 rounded-lg backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: COLORS.saffron }} />
            <span style={{ fontFamily: interFamily }} className="text-[10px] text-white/30 tracking-widest font-mono">
              CROCIN STIGMA GRADE
            </span>
            <div style={{ fontFamily: poppinsFamily }} className="text-3xl font-bold text-white mt-1">
              <StatCounter value={220} duration={60} suffix="+" />
            </div>
            <span style={{ fontFamily: interFamily }} className="text-[9px] text-white/40 tracking-wider font-mono">
              GRADE I LUXURY CERTIFIED
            </span>
          </div>

          <div className="border border-white/10 bg-white/[0.01] p-6 rounded-lg backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: COLORS.saffron }} />
            <span style={{ fontFamily: interFamily }} className="text-[10px] text-white/30 tracking-widest font-mono">
              PURITY VERIFIED
            </span>
            <div style={{ fontFamily: poppinsFamily }} className="text-3xl font-bold text-white mt-1">
              <StatCounter value={100} duration={60} suffix="%" />
            </div>
            <span style={{ fontFamily: interFamily }} className="text-[9px] text-white/40 tracking-wider font-mono">
              COLD EXCLUSION ANALYSIS
            </span>
          </div>
        </div>
      </div>

      {/* Floating Saffron Stigmas SVG Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {threads.map((thread) => {
          // Compute animated coordinates
          const tx = thread.x + thread.speedX * frame;
          const ty = thread.y + thread.speedY * frame;
          const rot = thread.rotSpeed * frame;
          
          // Thread path: a delicate curves representing a stigma thread
          const pathD = `M 0 0 C 10 30, -5 60, 5 ${thread.length}`;

          return (
            <g
              key={thread.id}
              transform={`translate(${tx}, ${ty}) rotate(${rot}) scale(${thread.scale})`}
              opacity={interpolate(frame, [0, 20], [0, 0.75], { extrapolateRight: "clamp" })}
            >
              {/* Backglow for threads */}
              <path
                d={pathD}
                fill="none"
                stroke={COLORS.saffron}
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.2"
                style={{ filter: "blur(4px)" }}
              />
              {/* Core thread line */}
              <path
                d={pathD}
                fill="none"
                stroke={COLORS.saffron}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Tiny yellow pollen tip */}
              <circle
                cx="0"
                cy="0"
                r="2"
                fill={COLORS.yellow}
              />
            </g>
          );
        })}
      </svg>

      {/* Bottom telemetry detail */}
      <div className="flex justify-between items-center text-[10px] font-mono text-white/30 z-20 border-t border-white/5 pt-4">
        <span>SAFFRON STIGMA ASSAY: COMPLETED</span>
        <span>VAISHNAVI LABS GRADE-1 APPROVED</span>
      </div>
    </div>
  );
};
