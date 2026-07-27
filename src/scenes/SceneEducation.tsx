import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: poppinsFamily } = loadPoppins("normal", {
  weights: ["500", "700", "800"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
});

// Chart points relative to Card 1 coordinate space
const CHART_POINTS = [
  { x: 40, y: 240 },
  { x: 100, y: 210 },
  { x: 160, y: 230 },
  { x: 220, y: 170 },
  { x: 280, y: 195 },
  { x: 340, y: 135 },
  { x: 400, y: 155 },
  { x: 460, y: 95 },
];

const getChartY = (xVal: number) => {
  for (let i = 0; i < CHART_POINTS.length - 1; i++) {
    const p1 = CHART_POINTS[i];
    const p2 = CHART_POINTS[i + 1];
    if (xVal >= p1.x && xVal <= p2.x) {
      const ratio = (xVal - p1.x) / (p2.x - p1.x);
      return p1.y + ratio * (p2.y - p1.y);
    }
  }
  return CHART_POINTS[CHART_POINTS.length - 1].y;
};

export const SceneEducation: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const blueColor = "#0071e3";

  // Camera Zoom (Smooth push zoom)
  const scale = interpolate(frame, [0, durationInFrames], [0.98, 1.03], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
  });

  // Soft fade entrance and exit
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

  // Left Column copy reveal
  const textTranslateY = interpolate(frame, [5, 40], [30, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [5, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ----------------------------------------------------
  // CARD DECK POSITIONING AND TRANSITIONS
  // ----------------------------------------------------

  // Card 3 (Article - Top Card) Entrance & Dismissal
  const card3EntranceY = interpolate(frame, [25, 45], [150, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card3EntranceOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const card3DismissX = interpolate(frame, [80, 98], [0, -600], {
    easing: Easing.bezier(0.34, 1.3, 0.64, 1), // Snappy swipe left
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card3DismissOpacity = interpolate(frame, [80, 95], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card3DismissRotate = interpolate(frame, [80, 98], [0, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const card3FinalX = card3DismissX;
  const card3FinalY = card3EntranceY;
  const card3FinalOpacity = card3EntranceOpacity * card3DismissOpacity;

  // Card 2 (Watchlist - Middle Card) Entrance, Stage Shift, and Dismissal
  const card2EntranceY = interpolate(frame, [18, 38], [150, 40], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card2EntranceOpacity = interpolate(frame, [18, 38], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shifts forward to top position (0px offset, scale 1.0, full opacity) when Card 3 is swiped
  const card2ShiftX = interpolate(frame, [80, 95], [20, 0], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card2ShiftY = interpolate(frame, [80, 95], [card2EntranceY, 0], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card2ShiftScale = interpolate(frame, [80, 95], [0.95, 1.0], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card2ShiftOpacity = interpolate(frame, [80, 95], [0.85, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Swipe away to the right
  const card2DismissX = interpolate(frame, [130, 148], [0, 600], {
    easing: Easing.bezier(0.34, 1.3, 0.64, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card2DismissOpacity = interpolate(frame, [130, 145], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card2DismissRotate = interpolate(frame, [130, 148], [0, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const card2FinalX = card2ShiftX + card2DismissX;
  const card2FinalY = card2ShiftY;
  const card2FinalScale = card2ShiftScale;
  const card2FinalOpacity = (frame < 80 ? card2EntranceOpacity : card2ShiftOpacity) * card2DismissOpacity;

  // Card 1 (Chart - Bottom Card) Entrance, Stage Shifts
  const card1EntranceY = interpolate(frame, [10, 30], [150, 80], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card1EntranceOpacity = interpolate(frame, [10, 30], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shift Stage 1 (shifts to middle spot when Card 3 swiped)
  const card1Shift1X = interpolate(frame, [80, 95], [40, 20], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card1Shift1Y = interpolate(frame, [80, 95], [card1EntranceY, 40], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card1Shift1Scale = interpolate(frame, [80, 95], [0.9, 0.95], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card1Shift1Opacity = interpolate(frame, [80, 95], [0.7, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shift Stage 2 (shifts to front spot when Card 2 swiped)
  const card1Shift2X = interpolate(frame, [130, 145], [card1Shift1X, 0], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card1Shift2Y = interpolate(frame, [130, 145], [card1Shift1Y, 0], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card1Shift2Scale = interpolate(frame, [130, 145], [card1Shift1Scale, 1.0], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card1Shift2Opacity = interpolate(frame, [130, 145], [card1Shift1Opacity, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const card1FinalX = frame < 130 ? card1Shift1X : card1Shift2X;
  const card1FinalY = frame < 80 ? card1EntranceY : (frame < 130 ? card1Shift1Y : card1Shift2Y);
  const card1FinalScale = frame < 80 ? 0.9 : (frame < 130 ? card1Shift1Scale : card1Shift2Scale);
  const card1FinalOpacity = frame < 80 ? card1EntranceOpacity : (frame < 130 ? card1Shift1Opacity : card1Shift2Opacity);

  // ----------------------------------------------------
  // VIRTUAL CURSOR TIMELINE COORDINATES
  // ----------------------------------------------------

  const cursorCoords = useMemo(() => {
    // Stage 1: Move to Card 3 button (Start Lesson)
    if (frame >= 45 && frame < 75) {
      const x = interpolate(frame, [45, 75], [600, 390], {
        easing: Easing.bezier(0.25, 1, 0.5, 1),
      });
      const y = interpolate(frame, [45, 75], [520, 290], {
        easing: Easing.bezier(0.25, 1, 0.5, 1),
      });
      return { x, y, click: false };
    }
    // Stage 2: Click on Card 3 button
    if (frame >= 75 && frame <= 80) {
      return { x: 390, y: 290, click: true };
    }
    // Stage 3: Hold/Drift slightly after click
    if (frame > 80 && frame < 95) {
      return { x: 390, y: 290, click: false };
    }
    // Stage 4: Move to Card 2 Watchlist TSLA row
    if (frame >= 95 && frame < 125) {
      const x = interpolate(frame, [95, 125], [390, 240], {
        easing: Easing.bezier(0.25, 1, 0.5, 1),
      });
      const y = interpolate(frame, [95, 125], [290, 160], {
        easing: Easing.bezier(0.25, 1, 0.5, 1),
      });
      return { x, y, click: false };
    }
    // Stage 5: Click on Card 2 TSLA row
    if (frame >= 125 && frame <= 130) {
      return { x: 240, y: 160, click: true };
    }
    // Stage 6: Hold/Drift slightly
    if (frame > 130 && frame < 145) {
      return { x: 240, y: 160, click: false };
    }
    // Stage 7: Move to Card 1 Chart hover start
    if (frame >= 145 && frame < 170) {
      const x = interpolate(frame, [145, 170], [240, 100], {
        easing: Easing.bezier(0.25, 1, 0.5, 1),
      });
      const y = interpolate(frame, [145, 170], [160, getChartY(100)], {
        easing: Easing.bezier(0.25, 1, 0.5, 1),
      });
      return { x, y, click: false };
    }
    // Stage 8: Hover and track along the line chart
    if (frame >= 170 && frame <= 220) {
      const x = interpolate(frame, [170, 220], [100, 460], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const y = getChartY(x);
      return { x, y, click: false };
    }
    // Stage 9: Move out / fade away
    if (frame > 220) {
      const x = interpolate(frame, [220, 240], [460, 520], {
        easing: Easing.out(Easing.ease),
      });
      const y = interpolate(frame, [220, 240], [95, 140], {
        easing: Easing.out(Easing.ease),
      });
      return { x, y, click: false };
    }

    // Default starting point (off-screen)
    return { x: 600, y: 520, click: false };
  }, [frame]);

  // Click ripples
  const ripple1Scale = interpolate(frame, [75, 87], [0, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ripple1Opacity = interpolate(frame, [75, 87], [0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ripple2Scale = interpolate(frame, [125, 137], [0, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ripple2Opacity = interpolate(frame, [125, 137], [0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ----------------------------------------------------
  // CARD 1: CHART DRAWING & HOVER TOOLTIP CALCULATIONS
  // ----------------------------------------------------

  // Chart path string
  const chartPathD = useMemo(() => {
    return CHART_POINTS.reduce((acc, p, index) => {
      return acc + (index === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
    }, "");
  }, []);

  // Gradient fill area path
  const chartFillD = useMemo(() => {
    return `${chartPathD} L ${CHART_POINTS[CHART_POINTS.length - 1].x} 320 L ${CHART_POINTS[0].x} 320 Z`;
  }, [chartPathD]);

  // Animate drawing: from frame 140 to 190, clip width increases from 0 to 480
  const clipWidth = interpolate(frame, [140, 190], [0, 480], {
    easing: Easing.bezier(0.25, 1, 0.45, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dynamic price lookup for the tooltip
  const activeTooltipPrice = useMemo(() => {
    if (frame >= 170 && frame <= 220) {
      const priceVal = interpolate(cursorCoords.x, [100, 460], [225.40, 241.50], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return priceVal.toFixed(2);
    }
    return "241.50";
  }, [frame, cursorCoords.x]);

  return (
    <div
      className="absolute inset-0 bg-[#fafafa] flex flex-col justify-between p-24 overflow-hidden"
      style={{
        opacity: combinedOpacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Background grid overlays (SpaceX / fintech clean aesthetic) */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.02] pointer-events-none">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-black" />
        ))}
      </div>

      <div className="flex flex-1 justify-between items-center z-20 my-auto w-full max-w-7xl mx-auto gap-16">
        
        {/* Left Side: Typography */}
        <div className="flex flex-col space-y-6 max-w-xl text-left -ml-12">
          <div
            style={{
              opacity: textOpacity,
              transform: `translateY(${textTranslateY}px)`,
            }}
          >
            <span
              style={{ fontFamily: interFamily, color: blueColor }}
              className="text-sm md:text-base font-bold tracking-[8px] uppercase pl-[2px]"
            >
              Smart Investing
            </span>
            <h1
              style={{
                fontFamily: poppinsFamily,
                color: "#111111",
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
              }}
              className="text-6xl md:text-7xl font-extrabold mt-4"
            >
              Learn Before
              <br />
              You Invest
            </h1>
          </div>

          <p
            style={{
              fontFamily: interFamily,
              opacity: textOpacity,
              transform: `translateY(${textTranslateY * 0.8}px)`,
            }}
            className="text-black/60 text-xl md:text-2xl leading-relaxed font-light"
          >
            Knowledge helps you make informed decisions.
          </p>
        </div>

        {/* Right Side: Virtual Interactive Deck container */}
        <div
          className="relative w-[500px] h-[360px] flex-shrink-0"
          style={{
            transform: "scale(1.2)",
            transformOrigin: "center",
          }}
        >
          
          {/* ----------------------------------------------------
              CARD 1: MARKET CHART CARD (Bottom Card)
              ---------------------------------------------------- */}
          <div
            className="absolute bg-white rounded-2xl border border-black/[0.04] p-5 flex flex-col justify-between"
            style={{
              width: 500,
              height: 360,
              left: card1FinalX,
              top: card1FinalY,
              transform: `scale(${card1FinalScale})`,
              opacity: card1FinalOpacity,
              boxShadow: "0 20px 45px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.01)",
              zIndex: 10,
            }}
          >
            {/* Header detail */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  📈
                </span>
                <div className="flex flex-col">
                  <span style={{ fontFamily: poppinsFamily }} className="text-xs font-bold text-slate-800">
                    TSLA • Tesla Inc.
                  </span>
                  <span style={{ fontFamily: interFamily }} className="text-[10px] text-slate-400">
                    NASDAQ Stock Market
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span style={{ fontFamily: poppinsFamily }} className="text-sm font-bold text-slate-900 block">
                  $241.50
                </span>
                <span style={{ fontFamily: interFamily }} className="text-[10px] font-bold text-emerald-500 block mt-0.5">
                  +4.12%
                </span>
              </div>
            </div>

            {/* Sparkline chart box */}
            <div className="relative w-full h-[220px] bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100/50 mt-3">
              {/* Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-[0.03]">
                <hr className="border-black border-dashed" />
                <hr className="border-black border-dashed" />
                <hr className="border-black border-dashed" />
              </div>

              {/* Animated SVGs */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={blueColor} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={blueColor} stopOpacity="0.0" />
                  </linearGradient>
                  
                  {/* Clip path for drawing reveal */}
                  <clipPath id="chart-reveal-clip">
                    <rect x="0" y="0" width={clipWidth} height="220" />
                  </clipPath>
                </defs>

                {/* Gradient area */}
                <path
                  d={chartFillD}
                  fill="url(#chart-grad)"
                  clipPath="url(#chart-reveal-clip)"
                />

                {/* Stroke line path */}
                <path
                  d={chartPathD}
                  fill="none"
                  stroke={blueColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  clipPath="url(#chart-reveal-clip)"
                />
              </svg>

              {/* Live tooltip & reference line tracking cursor */}
              {frame >= 170 && frame <= 220 && (
                <>
                  {/* Vertical dashed tracker */}
                  <div
                    className="absolute top-0 bottom-0 w-[1px] border-l border-dashed border-blue-400/40 pointer-events-none"
                    style={{ left: cursorCoords.x }}
                  />
                  {/* Glowing intersection point */}
                  <div
                    className="absolute w-3.5 h-3.5 rounded-full bg-blue-600 border border-white shadow-[0_0_8px_rgba(0,113,227,0.6)] pointer-events-none"
                    style={{
                      left: cursorCoords.x,
                      top: cursorCoords.y,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                  {/* Text price bubble tooltip */}
                  <div
                    className="absolute bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none flex items-center justify-center"
                    style={{
                      left: cursorCoords.x,
                      top: cursorCoords.y - 35,
                      transform: "translateX(-50%)",
                    }}
                  >
                    ${activeTooltipPrice}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ----------------------------------------------------
              CARD 2: WATCHLIST CARD (Middle Card)
              ---------------------------------------------------- */}
          {frame < 145 && (
            <div
              className="absolute bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 p-5 flex flex-col justify-between"
              style={{
                width: 500,
                height: 360,
                left: card2FinalX,
                top: card2FinalY,
                transform: `scale(${card2FinalScale}) rotate(${card2DismissRotate}deg)`,
                opacity: card2FinalOpacity,
                boxShadow: "0 20px 45px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.01)",
                zIndex: 20,
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <span style={{ fontFamily: poppinsFamily }} className="text-sm font-bold text-slate-800">
                  Your Watchlist
                </span>
                <span
                  style={{ fontFamily: interFamily, color: blueColor }}
                  className="text-[10px] font-bold uppercase tracking-wider"
                >
                  Edit List
                </span>
              </div>

              {/* Rows */}
              <div className="flex flex-col space-y-2 flex-1 justify-center">
                {/* AAPL */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/30 border border-slate-100/30">
                  <div className="flex items-center space-x-3">
                    <span className="text-base">🍎</span>
                    <div className="flex flex-col text-left">
                      <span style={{ fontFamily: poppinsFamily }} className="text-xs font-bold text-slate-700">
                        AAPL
                      </span>
                      <span style={{ fontFamily: interFamily }} className="text-[9px] text-slate-400 font-light">
                        Apple Inc.
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span style={{ fontFamily: poppinsFamily }} className="text-xs font-bold text-slate-800">
                      $189.84
                    </span>
                    <span style={{ fontFamily: interFamily }} className="text-[9px] font-bold text-emerald-500 ml-2">
                      +1.84%
                    </span>
                  </div>
                </div>

                {/* TSLA Row - clicked by cursor */}
                <div
                  className={`flex items-center justify-between p-2.5 rounded-xl border ${
                    frame >= 125 && frame <= 135
                      ? "bg-slate-100/80 border-slate-200"
                      : "bg-white border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-base">⚡</span>
                    <div className="flex flex-col text-left">
                      <span style={{ fontFamily: poppinsFamily }} className="text-xs font-bold text-slate-800">
                        TSLA
                      </span>
                      <span style={{ fontFamily: interFamily }} className="text-[9px] text-slate-400 font-light">
                        Tesla Inc.
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-2">
                    <span style={{ fontFamily: poppinsFamily }} className="text-xs font-bold text-slate-800">
                      $241.50
                    </span>
                    <span style={{ fontFamily: interFamily }} className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      +4.12%
                    </span>
                  </div>
                </div>

                {/* NVDA */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/30 border border-slate-100/30">
                  <div className="flex items-center space-x-3">
                    <span className="text-base">🟢</span>
                    <div className="flex flex-col text-left">
                      <span style={{ fontFamily: poppinsFamily }} className="text-xs font-bold text-slate-700">
                        NVDA
                      </span>
                      <span style={{ fontFamily: interFamily }} className="text-[9px] text-slate-400 font-light">
                        NVIDIA Corp.
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span style={{ fontFamily: poppinsFamily }} className="text-xs font-bold text-slate-800">
                      $485.20
                    </span>
                    <span style={{ fontFamily: interFamily }} className="text-[9px] font-bold text-red-500 ml-2">
                      -0.45%
                    </span>
                  </div>
                </div>

                {/* MSFT */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/30 border border-slate-100/30">
                  <div className="flex items-center space-x-3">
                    <span className="text-base">💻</span>
                    <div className="flex flex-col text-left">
                      <span style={{ fontFamily: poppinsFamily }} className="text-xs font-bold text-slate-700">
                        MSFT
                      </span>
                      <span style={{ fontFamily: interFamily }} className="text-[9px] text-slate-400 font-light">
                        Microsoft Corp.
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span style={{ fontFamily: poppinsFamily }} className="text-xs font-bold text-slate-800">
                      $374.30
                    </span>
                    <span style={{ fontFamily: interFamily }} className="text-[9px] font-bold text-emerald-500 ml-2">
                      +1.10%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              CARD 3: LEARNING ARTICLE CARD (Top Card)
              ---------------------------------------------------- */}
          {frame < 95 && (
            <div
              className="absolute bg-white/95 backdrop-blur-md rounded-2xl border border-white p-6 flex flex-col justify-between text-left"
              style={{
                width: 500,
                height: 360,
                left: card3FinalX,
                top: card3FinalY,
                transform: `rotate(${card3DismissRotate}deg)`,
                opacity: card3FinalOpacity,
                boxShadow: "0 25px 50px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.015)",
                zIndex: 30,
              }}
            >
              {/* Badge & Meta */}
              <div className="flex justify-between items-center">
                <span
                  style={{ fontFamily: interFamily, color: blueColor }}
                  className="bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
                >
                  Education Hub
                </span>
                <span style={{ fontFamily: interFamily }} className="text-[10px] text-slate-400">
                  5 min read
                </span>
              </div>

              {/* Title & Description */}
              <div className="my-auto space-y-2.5">
                <h3
                  style={{ fontFamily: poppinsFamily, lineHeight: 1.25 }}
                  className="text-lg font-bold text-slate-900"
                >
                  How Compounding Works: The Key to Wealth
                </h3>
                <p
                  style={{ fontFamily: interFamily }}
                  className="text-xs text-slate-500 leading-relaxed font-light"
                >
                  Discover how reinvesting dividends and earnings accelerates portfolio growth over long-term timelines.
                </p>
              </div>

              {/* Bottom Action Section */}
              <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs">📖</span>
                  <span style={{ fontFamily: interFamily }} className="text-[10px] text-slate-500 font-medium">
                    Lesson 1 of 4
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: interFamily,
                    transform: `scale(${interpolate(frame, [74, 75, 80, 81], [1, 0.95, 0.95, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                  }}
                  className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md select-none ${
                    frame >= 75 && frame <= 80 ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Start Lesson
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              CLICK RIPPLES (Overlay at Click coordinates)
              ---------------------------------------------------- */}
          {frame >= 75 && frame <= 87 && (
            <div
              className="absolute rounded-full border border-blue-400 bg-blue-400/20 pointer-events-none z-40"
              style={{
                width: 32,
                height: 32,
                left: 390,
                top: 290,
                transform: `translate(-50%, -50%) scale(${ripple1Scale})`,
                opacity: ripple1Opacity,
              }}
            />
          )}

          {frame >= 125 && frame <= 137 && (
            <div
              className="absolute rounded-full border border-blue-400 bg-blue-400/20 pointer-events-none z-40"
              style={{
                width: 32,
                height: 32,
                left: 240,
                top: 160,
                transform: `translate(-50%, -50%) scale(${ripple2Scale})`,
                opacity: ripple2Opacity,
              }}
            />
          )}

          {/* ----------------------------------------------------
              VIRTUAL MOUSE CURSOR
              ---------------------------------------------------- */}
          <div
            className="absolute pointer-events-none z-50"
            style={{
              left: cursorCoords.x,
              top: cursorCoords.y,
              transform: `translate(-3px, -2px) scale(${cursorCoords.click ? 0.85 : 1})`,
            }}
          >
            {/* Elegant SVG arrow cursor */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 20 20"
              fill="none"
              className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)]"
            >
              <path
                d="M3 3L10.5 17L12.5 12L17.5 10L3 3Z"
                fill="black"
                stroke="white"
                strokeWidth="1.8"
                strokeLinejoin="miter"
              />
            </svg>
          </div>

        </div>

      </div>

      {/* Footer layout consistency spacer */}
      <div className="h-6" />
    </div>
  );
};
