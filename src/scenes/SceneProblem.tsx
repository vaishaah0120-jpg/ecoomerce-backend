import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { SlideTextReveal } from "../components/SlideTextReveal";

const { fontFamily: poppinsFamily } = loadPoppins("normal", {
  weights: ["700", "800"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "600"],
});

export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const redColor = "#D62828";

  // Easing zoom (camera push: 0.98 -> 1.03)
  const scale = interpolate(frame, [0, durationInFrames], [0.98, 1.03], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
  });

  // Fade in and out transitions
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

  // Morph line width animation
  const lineWidth = interpolate(frame, [5, 20], [0, 900], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Morph line height animation
  const lineHeight = interpolate(frame, [20, 38], [2, 200], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Content opacity & translate
  const contentOpacity = interpolate(frame, [22, 38], [0, 1], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const contentTranslateY = interpolate(frame, [22, 38], [15, 0], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      className="absolute inset-0 bg-white flex flex-col justify-center items-center p-24 overflow-hidden"
      style={{
        opacity: combinedOpacity,
        scale: `${scale}`,
      }}
    >
      {/* Morphing container */}
      <div
        className="relative flex flex-col justify-center items-center overflow-hidden border-t-2 border-b-2"
        style={{
          borderColor: redColor,
          width: lineWidth,
          height: lineHeight,
        }}
      >
        <div
          className="flex flex-col items-center text-center z-20 space-y-4 w-[900px] py-4"
          style={{
            opacity: contentOpacity,
            transform: `translateY(${contentTranslateY}px)`,
          }}
        >
          <SlideTextReveal
            text="Negative Yield Risk"
            startFrame={15}
            duration={20}
            color={redColor}
            fontFamily={interFamily}
            className="text-2xl font-bold tracking-[10px] uppercase pl-[10px]"
          />
          <h1
            style={{
              fontFamily: poppinsFamily,
              color: "#111111",
              letterSpacing: "-0.5px",
              lineHeight: 1.15,
            }}
            className="text-5xl md:text-6xl font-extrabold leading-none select-none"
          >
            <SlideTextReveal
              text="Savings Alone Aren't Enough"
              startFrame={30}
              duration={25}
              color="#111111"
              fontFamily={poppinsFamily}
            />
          </h1>
        </div>
      </div>
    </div>
  );
};
