import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface TextScrollerProps {
  text: string;
  startFrame: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const TextScroller: React.FC<TextScrollerProps> = ({
  text,
  startFrame,
  duration = 20,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <span className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, wordIdx) => {
        // Stagger each word slightly
        const wordStart = startFrame + wordIdx * 1.5;
        
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

        // Translate from 100% down (hidden) to 0% (revealed)
        const translateY = (1 - progress) * 100;
        const opacity = progress;

        return (
          <span key={wordIdx} className="inline-block overflow-hidden mr-[0.25em] py-[0.1em] -my-[0.1em]">
            <span
              className="inline-block"
              style={{
                transform: `translateY(${translateY}%)`,
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
