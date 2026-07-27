import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface StatCounterProps {
  value: number;
  startValue?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  startValue = 0,
  duration = 60,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();

  const currentValue = interpolate(frame, [0, duration], [startValue, value], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <span className={className} style={style}>
      {prefix}
      {currentValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};
