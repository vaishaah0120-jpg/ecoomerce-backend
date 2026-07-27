import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../types";

interface TelemetryOverlayProps {
  color?: string;
  theme?: "light" | "dark";
  gridOpacity?: number;
}

export const TelemetryOverlay: React.FC<TelemetryOverlayProps> = ({
  color = COLORS.yellow,
  theme = "dark",
  gridOpacity = 0.05,
}) => {
  const frame = useCurrentFrame();

  const textColor = theme === "dark" ? "text-white/60" : "text-black/60";
  const borderStyle = theme === "dark" ? "border-white/10" : "border-black/10";
  const labelColor = theme === "dark" ? "text-white/30" : "text-black/30";

  // Telemetry values animations
  const systemValue = (100 - interpolate(frame, [0, 300], [0, 4.2], { extrapolateRight: "clamp" })).toFixed(1);
  const orbitalSpeed = (27500 + Math.sin(frame * 0.1) * 45).toFixed(0);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 font-mono text-[10px] uppercase tracking-widest z-10 select-none">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none"
        style={{ opacity: gridOpacity }}
      >
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className={`border-[0.5px] ${borderStyle}`} />
        ))}
      </div>

      {/* Top HUD Row */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            <span className="font-bold text-xs" style={{ color }}>SYS.VAISHNAVI.ACTIVE</span>
          </div>
          <span className={textColor}>CRYO-STATION: SEC-04B</span>
        </div>

        {/* Center Tech Header */}
        <div className="hidden md:flex flex-col items-center text-center">
          <span style={{ color }} className="font-bold">ORBITAL PROPULSION ANALYSIS</span>
          <span className={labelColor}>FPS: 30.00 / STATUS: NOMINAL</span>
        </div>

        <div className="flex flex-col items-end space-y-1">
          <span className={textColor}>LAT: 12.9716° N</span>
          <span className={textColor}>LON: 77.5946° E</span>
        </div>
      </div>

      {/* Bottom HUD Row */}
      <div className="flex justify-between items-end">
        {/* Left Side: System status & circular scanner */}
        <div className="flex items-center space-x-4">
          <svg className="w-10 h-10 animate-spin-slow" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="1" fill="none" strokeDasharray="5,15" opacity="0.3" />
            <circle cx="50" cy="50" r="35" stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="40,10" opacity="0.6" />
            <circle cx="50" cy="50" r="25" stroke={color} strokeWidth="2" fill="none" strokeDasharray="5,2" opacity="0.4" />
            <circle cx="50" cy="50" r="5" fill={color} opacity="0.8" />
          </svg>
          <div className="flex flex-col space-y-0.5">
            <span className={labelColor}>SPICE DENSITY</span>
            <span className="font-bold text-xs" style={{ color }}>{systemValue}% PURE</span>
          </div>
        </div>

        {/* Center Telemetry Data */}
        <div className="hidden lg:flex space-x-12">
          <div className="flex flex-col">
            <span className={labelColor}>PRESSURE</span>
            <span className="font-bold text-xs text-white" style={{ color: theme === "dark" ? COLORS.white : COLORS.black }}>
              1,013.25 HPA
            </span>
          </div>
          <div className="flex flex-col">
            <span className={labelColor}>VELOCITY</span>
            <span className="font-bold text-xs text-white" style={{ color: theme === "dark" ? COLORS.white : COLORS.black }}>
              {orbitalSpeed} M/S
            </span>
          </div>
          <div className="flex flex-col">
            <span className={labelColor}>TEMP MATRIX</span>
            <span className="font-bold text-xs text-white" style={{ color: theme === "dark" ? COLORS.white : COLORS.black }}>
              CRYOGENIC LOCK
            </span>
          </div>
        </div>

        {/* Right Side: Design labels */}
        <div className="flex flex-col items-end space-y-1">
          <div className="flex space-x-2 items-center">
            <span className={labelColor}>T+</span>
            <span className="font-bold text-xs text-white" style={{ color: theme === "dark" ? COLORS.white : COLORS.black }}>
              {(frame / 30).toFixed(2)}s
            </span>
          </div>
          <span style={{ color }} className="font-bold">SPACEX.AI // OP-01</span>
        </div>
      </div>

      {/* Frame Corners (SpaceX style) */}
      <div className="absolute inset-4 pointer-events-none">
        {/* Top Left */}
        <div className={`absolute top-0 left-0 w-4 h-4 border-t border-l ${borderStyle}`} />
        {/* Top Right */}
        <div className={`absolute top-0 right-0 w-4 h-4 border-t border-r ${borderStyle}`} />
        {/* Bottom Left */}
        <div className={`absolute bottom-0 left-0 w-4 h-4 border-b border-l ${borderStyle}`} />
        {/* Bottom Right */}
        <div className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r ${borderStyle}`} />
      </div>
    </div>
  );
};
