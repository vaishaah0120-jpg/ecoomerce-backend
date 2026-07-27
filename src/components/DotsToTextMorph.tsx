import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface DotsToTextMorphProps {
  text: string;
  startFrame: number;
  duration: number;
  color: string;
  fontFamily?: string;
  className?: string;
}

export const DotsToTextMorph: React.FC<DotsToTextMorphProps> = ({
  text,
  startFrame,
  duration,
  color,
  fontFamily,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const chars = useMemo(() => text.split(""), [text]);

  return (
    <span className={`inline-block ${className}`} style={{ fontFamily }}>
      {chars.map((char, charIdx) => {
        // Stagger each character from left to right
        const charStart = startFrame + charIdx * 1.5;
        
        // Progress of the morph animation for this character (from 0 to 1)
        const progress = interpolate(
          frame,
          [charStart, charStart + duration],
          [0, 1],
          {
            easing: Easing.bezier(0.25, 1, 0.5, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // Generate deterministic initial scatter offsets for this character
        const dots = Array.from({ length: 6 }).map((_, dotIdx) => {
          const seed = charIdx * 17 + dotIdx * 41;
          const angle = (dotIdx * (2 * Math.PI) / 6) + (seed % 10) * 0.15;
          const distance = 35 + (seed % 25); // distance in pixels
          return {
            dx: Math.cos(angle) * distance,
            dy: Math.sin(angle) * distance,
            size: 2.5 + (seed % 3) * 0.8, // size in pixels
          };
        });

        // Text character opacity
        // The character fades in during the last 30% of its morph timeline
        const charOpacity = interpolate(progress, [0.7, 1.0], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // The characters will scale up with overshoot bounce as they reveal
        const charScale = interpolate(progress, [0.7, 1.0], [0.7, 1], {
          easing: Easing.bezier(0.175, 0.885, 0.32, 1.2),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <span key={charIdx} className="relative inline-block text-nowrap">
            {/* Solid character */}
            <span
              className="inline-block"
              style={{
                opacity: charOpacity,
                transform: `scale(${charScale})`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
            
            {/* Morphing dots */}
            {char !== " " && progress < 1 && (
              <>
                {dots.map((dot, dotIdx) => {
                  const currentDx = dot.dx * (1 - progress);
                  const currentDy = dot.dy * (1 - progress);
                  
                  // Dots fade in at start, fade out/shrink at end
                  const dotOpacity = interpolate(progress, [0, 0.2, 0.7, 1.0], [0, 1, 1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });

                  return (
                    <div
                      key={dotIdx}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: dot.size,
                        height: dot.size,
                        backgroundColor: color,
                        opacity: dotOpacity,
                        left: `calc(50% + ${currentDx}px)`,
                        top: `calc(50% + ${currentDy}px)`,
                        transform: "translate(-50%, -50%)",
                        boxShadow: `0 0 6px ${color}88`,
                      }}
                    />
                  );
                })}
              </>
            )}
          </span>
        );
      })}
    </span>
  );
};
