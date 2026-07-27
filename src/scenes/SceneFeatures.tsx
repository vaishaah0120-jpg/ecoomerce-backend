import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { TextScroller } from "../components/TextScroller";

const { fontFamily: poppinsFamily } = loadPoppins("normal", {
  weights: ["500", "700", "800"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
});

export const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const blueColor = "#0071e3";

  // Easing zoom (camera push: 0.98 -> 1.03)
  const scale = interpolate(frame, [0, durationInFrames], [0.98, 1.03], {
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

  // Left Column animations (Title)
  const titleTranslateY = interpolate(frame, [5, 40], [30, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [5, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const descTranslateY = interpolate(frame, [15, 50], [25, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });
  const descOpacity = interpolate(frame, [15, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Timeline line reveal animation: draws from 0% to 100% of height (620px)
  const lineRevealHeight = interpolate(frame, [15, 150], [0, 620], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Staggered card animation generator
  const getCardAnimations = (startFrame: number) => {
    // Card slide-in from right & fade in
    const slideX = interpolate(frame, [startFrame, startFrame + 25], [40, 0], {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const cardOpacity = interpolate(frame, [startFrame, startFrame + 25], [0, 1], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });

    // Icon pop scale using easeOutBack: bezier(0.175, 0.885, 0.32, 1.275) for bounce/overshoot
    const iconScale = interpolate(frame, [startFrame + 5, startFrame + 30], [0, 1], {
      easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });

    return { slideX, cardOpacity, iconScale };
  };

  const card1 = getCardAnimations(20);
  const card2 = getCardAnimations(50);
  const card3 = getCardAnimations(80);
  const card4 = getCardAnimations(110);

  return (
    <div
      className="absolute inset-0 bg-[#fafafa] flex flex-col justify-between p-24 overflow-hidden"
      style={{
        opacity: combinedOpacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Subtle backdrop SpaceX gridlines */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.02] pointer-events-none">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-black" />
        ))}
      </div>



      {/* Centered layout: Text top, Features list bottom */}
      <div className="flex flex-col flex-1 justify-center items-center z-20 my-auto w-full max-w-4xl mx-auto gap-10">
        
        {/* Top Column: Copy & Voiceover text */}
        <div className="flex flex-col space-y-4 max-w-2xl text-center items-center -translate-y-20">
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleTranslateY}px)`,
            }}
          >
            <h1
              style={{
                fontFamily: poppinsFamily,
                color: "#111111",
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
              }}
              className="text-5xl md:text-6xl font-extrabold"
            >
              Everything You Need
            </h1>
          </div>

          <p
            style={{
              fontFamily: interFamily,
              opacity: descOpacity,
              transform: `translateY(${descTranslateY}px)`,
            }}
            className="text-black/60 text-xl leading-relaxed font-light"
          >
            Everything you need to begin your investing journey.
          </p>
        </div>

        {/* Right Side Column: Vertical Interactive Timeline of Glass Cards */}
        <div className="relative flex items-stretch w-[900px] min-h-[680px] -translate-y-8">
          
          {/* Vertical Timeline Track Line */}
          <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-black/5 rounded-full pointer-events-none">
            {/* Animated blue timeline fill */}
            <div
              className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-[#0071e3] to-indigo-500 shadow-[0_0_8px_rgba(0,113,227,0.5)]"
              style={{ height: `${lineRevealHeight}px` }}
            />
            {/* Glowing tip pointer */}
            {lineRevealHeight > 0 && lineRevealHeight < 620 && (
              <div
                className="absolute left-1/2 rounded-full pointer-events-none bg-[#0071e3] shadow-[0_0_12px_4px_rgba(0,113,227,0.6)]"
                style={{
                  width: 8,
                  height: 8,
                  top: `${lineRevealHeight}px`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>

          {/* Cards vertical stack */}
          <div className="flex flex-col justify-between w-full pl-16 space-y-8">
            
            {/* Card 1: Easy Account Setup */}
            <div
              className="rounded-2xl p-8 flex items-center gap-8 transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.03)",
                opacity: card1.cardOpacity,
                transform: `translateX(${card1.slideX}px)`,
              }}
            >
              <div
                className="w-20 h-20 rounded-xl bg-blue-50/50 flex items-center justify-center border border-blue-100/50 flex-shrink-0"
                style={{ transform: `scale(${card1.iconScale})` }}
              >
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  style={{ fontFamily: poppinsFamily }}
                  className="text-2xl font-bold text-slate-800"
                >
                  <TextScroller text="Easy Account Setup" startFrame={20} duration={20} />
                </span>
                <span
                  style={{ fontFamily: interFamily }}
                  className="text-lg text-slate-500 font-light mt-0.5"
                >
                  <TextScroller text="Get verified and start investing in minutes." startFrame={28} duration={20} />
                </span>
              </div>
            </div>

            {/* Card 2: Clean Dashboard */}
            <div
              className="rounded-2xl p-8 flex items-center gap-8 transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.03)",
                opacity: card2.cardOpacity,
                transform: `translateX(${card2.slideX}px)`,
              }}
            >
              <div
                className="w-20 h-20 rounded-xl bg-indigo-50/50 flex items-center justify-center border border-indigo-100/50 flex-shrink-0"
                style={{ transform: `scale(${card2.iconScale})` }}
              >
                <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  style={{ fontFamily: poppinsFamily }}
                  className="text-2xl font-bold text-slate-800"
                >
                  <TextScroller text="Clean Dashboard" startFrame={50} duration={20} />
                </span>
                <span
                  style={{ fontFamily: interFamily }}
                  className="text-lg text-slate-500 font-light mt-0.5"
                >
                  <TextScroller text="Intuitive and clutter-free interface." startFrame={58} duration={20} />
                </span>
              </div>
            </div>

            {/* Card 3: Portfolio Tracking */}
            <div
              className="rounded-2xl p-8 flex items-center gap-8 transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.03)",
                opacity: card3.cardOpacity,
                transform: `translateX(${card3.slideX}px)`,
              }}
            >
              <div
                className="w-20 h-20 rounded-xl bg-emerald-50/50 flex items-center justify-center border border-emerald-100/50 flex-shrink-0"
                style={{ transform: `scale(${card3.iconScale})` }}
              >
                <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  style={{ fontFamily: poppinsFamily }}
                  className="text-2xl font-bold text-slate-800"
                >
                  <TextScroller text="Portfolio Tracking" startFrame={80} duration={20} />
                </span>
                <span
                  style={{ fontFamily: interFamily }}
                  className="text-lg text-slate-500 font-light mt-0.5"
                >
                  <TextScroller text="Real-time analytics and asset performance." startFrame={88} duration={20} />
                </span>
              </div>
            </div>

            {/* Card 4: Market Insights */}
            <div
              className="rounded-2xl p-8 flex items-center gap-8 transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.03)",
                opacity: card4.cardOpacity,
                transform: `translateX(${card4.slideX}px)`,
              }}
            >
              <div
                className="w-20 h-20 rounded-xl bg-amber-50/50 flex items-center justify-center border border-amber-100/50 flex-shrink-0"
                style={{ transform: `scale(${card4.iconScale})` }}
              >
                <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  style={{ fontFamily: poppinsFamily }}
                  className="text-2xl font-bold text-slate-800"
                >
                  <TextScroller text="Market Insights" startFrame={110} duration={20} />
                </span>
                <span
                  style={{ fontFamily: interFamily }}
                  className="text-lg text-slate-500 font-light mt-0.5"
                >
                  <TextScroller text="Expert analysis and custom stock alerts." startFrame={118} duration={20} />
                </span>
              </div>
            </div>
            
          </div>
        </div>

      </div>



    </div>
  );
};
