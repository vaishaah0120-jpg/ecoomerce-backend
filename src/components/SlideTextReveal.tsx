import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface SlideTextRevealProps {
  text: string;
  startFrame: number;
  duration?: number;
  stagger?: number;
  color?: string;
  fontFamily?: string;
  className?: string;
  direction?: "up" | "down";
}

export const SlideTextReveal: React.FC<SlideTextRevealProps> = ({
  text,
  startFrame,
  duration = 20,
  stagger = 2,
  color,
  fontFamily,
  className = "",
  direction = "up",
}) => {
  const frame = useCurrentFrame();
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <span
      className={`inline-flex flex-wrap justify-center ${className}`}
      style={{ fontFamily, color }}
    >
      {words.map((word, wordIdx) => {
        const wordStart = startFrame + wordIdx * stagger;
        
        const progress = interpolate(
          frame,
          [wordStart, wordStart + duration],
          [0, 1],
          {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const slidePercent = direction === "up" ? (1 - progress) * 100 : -(1 - progress) * 100;
        const opacity = progress;

        return (
          <span
            key={wordIdx}
            className="inline-block overflow-hidden mr-[0.2em] last:mr-0 py-[0.1em] -my-[0.1em]"
          >
            <span
              className="inline-block"
              style={{
                translate: `0px ${slidePercent}%`,
                opacity,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </span>
  );
};
