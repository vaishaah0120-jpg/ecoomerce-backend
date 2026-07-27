import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface ParticleSystemProps {
  count: number;
  colors: string[];
  seed?: number;
  speed?: number;
  sizeRange?: [number, number];
  opacityRange?: [number, number];
}

// Simple deterministic pseudo-random number generator
const createRandom = (seed: number) => {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
};

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count,
  colors,
  seed = 42,
  speed = 0.5,
  sizeRange = [2, 8],
  opacityRange = [0.1, 0.7],
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo(() => {
    const random = createRandom(seed);
    return Array.from({ length: count }).map(() => {
      const size = sizeRange[0] + random() * (sizeRange[1] - sizeRange[0]);
      const initialX = random() * width;
      const initialY = random() * height;
      const driftSpeedX = (random() - 0.5) * speed * 2;
      const driftSpeedY = -(random() * 0.5 + 0.5) * speed * 2; // drift upwards
      const pulseSpeed = 0.02 + random() * 0.03;
      const pulsePhase = random() * Math.PI * 2;
      const color = colors[Math.floor(random() * colors.length)];
      const baseOpacity = opacityRange[0] + random() * (opacityRange[1] - opacityRange[0]);
      const glow = random() > 0.7; // some particles have extra glow

      return {
        size,
        initialX,
        initialY,
        driftSpeedX,
        driftSpeedY,
        pulseSpeed,
        pulsePhase,
        color,
        baseOpacity,
        glow,
      };
    });
  }, [count, colors, seed, speed, sizeRange, opacityRange, width, height]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => {
        // Calculate current position with wrap-around
        let x = p.initialX + p.driftSpeedX * frame;
        let y = p.initialY + p.driftSpeedY * frame;

        // Wrap around boundaries
        x = ((x % width) + width) % width;
        y = ((y % height) + height) % height;

        // Calculate opacity pulse
        const pulse = Math.sin(frame * p.pulseSpeed + p.pulsePhase) * 0.15;
        const opacity = Math.max(0.01, Math.min(1, p.baseOpacity + pulse));

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: x,
              top: y,
              backgroundColor: p.color,
              opacity,
              boxShadow: p.glow ? `0 0 ${p.size * 2}px ${p.color}` : "none",
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
};
