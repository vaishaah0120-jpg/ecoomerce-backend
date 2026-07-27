import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: poppinsFamily } = loadPoppins("normal", {
  weights: ["500", "700", "800"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["300", "400", "600", "700"],
});

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const blueColor = "#0071e3";

  // 1. Global Camera Zoom Out & Fade In
  const sceneScale = interpolate(frame, [0, durationInFrames], [1.04, 0.99], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  });

  const sceneOpacity = interpolate(frame, [0, 20], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  // 2. Central Glass Card Entrance
  const cardScale = interpolate(frame, [10, 45], [0.93, 1.0], {
    easing: Easing.bezier(0.175, 0.885, 0.32, 1.1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [10, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. SVG Logo Animations (Kite + Ring)
  const ringDashoffset = interpolate(frame, [10, 45], [314, 0], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const kiteScale = interpolate(frame, [18, 48], [0.5, 1.0], {
    easing: Easing.bezier(0.175, 0.885, 0.32, 1.15),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const kiteOpacity = interpolate(frame, [18, 43], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4. Text & Button Entrances (Slide up + Fade)
  const textOpacity = interpolate(frame, [28, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textTranslateY = interpolate(frame, [28, 58], [20, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const buttonOpacity = interpolate(frame, [38, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const buttonTranslateY = interpolate(frame, [38, 68], [15, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 5. Shine Sweep diagonal offset
  const shineTranslate = interpolate(frame, [65, 115], [-400, 800], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 6. Disclaimer Entrance
  const disclaimerOpacity = interpolate(frame, [75, 105], [0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 7. Staggered Social Share Badges
  const getBadgeAnim = (delay: number) => {
    const start = 48 + delay;
    const scaleVal = interpolate(frame, [start, start + 15], [0, 1], {
      easing: Easing.bezier(0.175, 0.885, 0.32, 1.275), // Bouncy pop
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const opacityVal = interpolate(frame, [start, start + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { scale: scaleVal, opacity: opacityVal };
  };

  const badge1 = getBadgeAnim(0);
  const badge2 = getBadgeAnim(4);
  const badge3 = getBadgeAnim(8);
  const badge4 = getBadgeAnim(12);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden w-full h-full"
      style={{
        opacity: sceneOpacity,
        transform: `scale(${sceneScale})`,
        background: "#ffffff",
      }}
    >
      {/* Background SpaceX-style grid overlay in dark */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.02] pointer-events-none">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-black" />
        ))}
      </div>

      {/* Main Glassmorphism container */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden py-14 px-20 rounded-3xl bg-white/70 border border-black/[0.04]"
        style={{
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          width: 780,
          height: 600,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05), 0 4px 20px -2px rgba(0, 0, 0, 0.02)",
        }}
      >
        {/* Glow behind the logo */}
        <div
          className="absolute w-[200px] h-[200px] rounded-full blur-[60px] opacity-[0.08] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${blueColor} 0%, rgba(0,113,227,0) 70%)`,
            top: 20,
          }}
        />

        {/* Diagonal Shine Sweep Overlay */}
        <div
          className="absolute top-0 bottom-0 w-36 bg-gradient-to-r from-transparent via-black/[0.03] to-transparent skew-x-[-25deg] blur-md pointer-events-none"
          style={{
            left: shineTranslate,
          }}
        />

        {/* Custom SVG Kite Logo Animation */}
        <svg viewBox="0 0 120 120" className="w-32 h-32 overflow-visible z-20">
          {/* Animated Circle Ring */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={blueColor}
            strokeWidth="2.5"
            strokeDasharray="314.16"
            strokeDashoffset={ringDashoffset}
            strokeLinecap="round"
            className="opacity-70"
          />

          {/* Animated Kite Group */}
          <g
            style={{
              transform: `scale(${kiteScale})`,
              transformOrigin: "60px 60px",
              opacity: kiteOpacity,
            }}
          >
            {/* Left wing (slightly translucent) */}
            <path
              d="M 60 25 L 35 58 L 60 91 Z"
              fill={blueColor}
              fillOpacity="0.8"
            />
            {/* Right wing (fully solid) */}
            <path
              d="M 60 25 L 85 58 L 60 91 Z"
              fill={blueColor}
              fillOpacity="1"
            />
            {/* Spine line */}
            <line
              x1="60"
              y1="25"
              x2="60"
              y2="91"
              stroke="white"
              strokeWidth="1.5"
            />
            {/* Horizontal crossbar curve */}
            <path
              d="M 35 58 Q 60 52 85 58"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
            {/* Tail triangle */}
            <path
              d="M 60 91 L 53 103 L 67 103 Z"
              fill={blueColor}
            />
          </g>
        </svg>

        {/* Text Container */}
        <div
          className="flex flex-col items-center text-center mt-6 z-20"
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
          }}
        >
          <h1
            style={{
              fontFamily: poppinsFamily,
              color: "#111111",
              letterSpacing: "-1px",
              lineHeight: 1.25,
            }}
            className="text-[38px] font-extrabold"
          >
            Share Your Investing
            <br />
            Journey Today
          </h1>
        </div>

        {/* Action Button & Badges Container */}
        <div
          style={{
            opacity: buttonOpacity,
            transform: `translateY(${buttonTranslateY}px)`,
          }}
          className="z-20 mt-8 flex flex-col items-center space-y-6"
        >
          <div
            style={{
              fontFamily: interFamily,
              boxShadow: "0 10px 25px rgba(0, 113, 227, 0.15)",
            }}
            className="px-10 py-3.5 bg-[#0071e3] text-white font-bold rounded-xl text-base tracking-wider select-none active:scale-95 transition-transform"
          >
            Share Portfolio
          </div>

          {/* Social share icons row */}
          <div className="flex items-center justify-center space-x-4 pt-1">
            {/* Twitter / X */}
            <div
              className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer"
              style={{
                transform: `scale(${badge1.scale})`,
                opacity: badge1.opacity,
              }}
            >
              𝕏
            </div>
            {/* WhatsApp */}
            <div
              className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center text-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer"
              style={{
                transform: `scale(${badge2.scale})`,
                opacity: badge2.opacity,
              }}
            >
              💬
            </div>
            {/* LinkedIn */}
            <div
              className="w-11 h-11 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-base shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer"
              style={{
                transform: `scale(${badge3.scale})`,
                opacity: badge3.opacity,
              }}
            >
              💼
            </div>
            {/* Copy Link */}
            <div
              className="w-11 h-11 rounded-full bg-[#fafafa] border border-slate-200 text-slate-700 flex items-center justify-center text-base shadow-[0_4px_12px_rgba(0,0,0,0.05)] cursor-pointer"
              style={{
                transform: `scale(${badge4.scale})`,
                opacity: badge4.opacity,
              }}
            >
              🔗
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Disclaimer */}
      <p
        style={{
          fontFamily: interFamily,
          opacity: disclaimerOpacity,
        }}
        className="absolute bottom-10 text-[10px] md:text-xs text-black/50 tracking-wide text-center max-w-2xl px-8 leading-relaxed font-light z-20"
      >
        Investing in securities is subject to market risks. Read all related documents carefully before investing.
      </p>
    </div>
  );
};
