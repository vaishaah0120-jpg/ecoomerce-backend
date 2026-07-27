import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { SlideTextReveal } from "../components/SlideTextReveal";

const { fontFamily: poppinsFamily } = loadPoppins("normal", {
  weights: ["500", "600", "700", "800"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
});

// A helper for inline formatting of currency in INR format
const formatINR = (value: number) => {
  return "₹" + Math.floor(value).toLocaleString("en-IN");
};

export const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const accentColor = "#387ED1"; // Zerodha-inspired blue

  // ==========================================
  // CAMERA ANIMATION & PARALLAX
  // ==========================================
  
  // Normal slow camera push-in (scale 0.98 -> 1.02)
  const cameraScale = interpolate(frame, [0, durationInFrames], [0.98, 1.02], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
  });

  // Subtle left-to-right camera pan (translateX: -10px to 10px)
  const cameraTranslateX = interpolate(frame, [0, durationInFrames], [-8, 8], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateRight: "clamp",
  });

  // Zoom into the Investment Growth chart at the end (frames 200-240)
  const zoomProgress = interpolate(frame, [200, 240], [0, 1], {
    easing: Easing.bezier(0.7, 0, 0.84, 0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final combined transform values
  const finalScale = cameraScale + zoomProgress * 8; // Deep 9x zoom
  const finalOpacity = interpolate(frame, [230, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Zoom focal point on the grid (approximate center of the Investment Growth card)
  const zoomOriginX = "45%";
  const zoomOriginY = "55%";

  // ==========================================
  // OPENING TRANSITIONS (Frames 0 - 60)
  // ==========================================

  // Thin blue growing line (0-1 sec)
  const blueLineWidth = interpolate(frame, [5, 35], [0, 100], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blueLineOpacity = interpolate(frame, [30, 45], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Browser window scale & opacity entrance
  const browserScale = interpolate(frame, [20, 50], [0.95, 1.0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const browserOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ==========================================
  // HERO TEXT ANIMATIONS (Inside Browser Viewport)
  // ==========================================
  

  // Exit transition for the Hero elements to make space for the dashboard (frames 55-75)
  const heroExitTranslateY = interpolate(frame, [55, 75], [0, -100], {
    easing: Easing.bezier(0.3, 0.0, 0.1, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heroExitOpacity = interpolate(frame, [55, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ==========================================
  // DASHBOARD TRANSITIONS & CARDS STAGGER (Frames 60 - 200)
  // ==========================================

  // Dashboard overall entrance (slides up and fades in)
  const dashboardTranslateY = interpolate(frame, [60, 85], [100, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dashboardOpacity = interpolate(frame, [60, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cards stagger animation generator
  // 8 Cards with 5 frames (0.16s) delay between each
  const getCardStyle = (start: number) => {
    const cardOpacity = interpolate(frame, [start, start + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const cardY = interpolate(frame, [start, start + 15], [30, 0], {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const cardScale = interpolate(frame, [start, start + 15], [0.95, 1], {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return {
      opacity: cardOpacity,
      transform: `translateY(${cardY}px) scale(${cardScale})`,
    };
  };

  const c1Style = getCardStyle(65); // Portfolio Value
  const c2Style = getCardStyle(70); // Today's Gain
  const c3Style = getCardStyle(75); // Investment Growth (Chart)
  const c4Style = getCardStyle(80); // Portfolio Allocation (Pie)
  const c5Style = getCardStyle(85); // Market Overview
  const c6Style = getCardStyle(90); // Watchlist
  const c7Style = getCardStyle(95); // Recent Transactions
  const c8Style = getCardStyle(100); // Quick Actions

  // ==========================================
  // COUNTERS & GROWTH GRAPHS (Frames 70 - 160)
  // ==========================================

  // Counter 1: Portfolio Value (₹0 -> ₹8,45,320)
  const portfolioVal = interpolate(frame, [70, 130], [0, 845320], {
    easing: Easing.bezier(0.25, 1, 0.33, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Counter 2: Today's Gain (₹0 -> ₹12,540)
  const todaysGain = interpolate(frame, [75, 135], [0, 12540], {
    easing: Easing.bezier(0.25, 1, 0.33, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Counter 3: Returns (0% -> 18.6%)
  const returnsVal = interpolate(frame, [80, 140], [0, 18.6], {
    easing: Easing.bezier(0.25, 1, 0.33, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line & Area graph progress (0 to 1)
  const chartProgress = interpolate(frame, [80, 150], [0, 1], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SVG Chart path geometry
  const chartHeight = 110;
  const linePath = "M 10 95 Q 110 80, 190 70 T 320 40 T 450 30 T 580 15";
  const areaPath = `${linePath} L 580 ${chartHeight} L 10 ${chartHeight} Z`;

  // Pie chart progress & rotation
  const pieProgress = interpolate(frame, [85, 150], [0, 1], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pieRotation = interpolate(frame, [85, 150], [-90, 90], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pie chart segment lengths
  // Radius R = 38. Circumference = 2 * Math.PI * 38 = 238.76
  const R = 38;
  const C = 2 * Math.PI * R;
  
  // Allocations: Stocks (50%), Mutual Funds (25%), ETFs (15%), SIPs/Cash (10%)
  const segment1Length = C * 0.50;
  const segment2Length = C * 0.25;
  const segment3Length = C * 0.15;
  const segment4Length = C * 0.10;

  // Staggered bounce scales for allocation labels
  const getIconScale = (start: number) => {
    return interpolate(frame, [start, start + 12], [0, 1], {
      easing: Easing.bezier(0.175, 0.885, 0.32, 1.15), // overshoot bounce
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const label1Scale = getIconScale(105);
  const label2Scale = getIconScale(110);
  const label3Scale = getIconScale(115);
  const label4Scale = getIconScale(120);

  // Parallax shifts for background grid
  const bgGridTranslateY = interpolate(frame, [0, durationInFrames], [-20, 20], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  });

  return (
    <div
      className="absolute inset-0 bg-[#ffffff] overflow-hidden flex flex-col justify-center items-center select-none"
      style={{
        width: "100%",
        height: "100%",
        fontFamily: interFamily,
        opacity: finalOpacity,
      }}
    >
      {/* 1. Growing Blue Accent Line */}
      {frame < 45 && (
        <div
          className="absolute top-1/2 left-1/2 h-[2px] bg-[#387ED1] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          style={{
            width: `${blueLineWidth}%`,
            opacity: blueLineOpacity,
          }}
        />
      )}

      {/* 2. Parallax background grid */}
      <div 
        className="absolute inset-0 grid grid-cols-24 grid-rows-12 opacity-[0.03] pointer-events-none"
        style={{
          transform: `translateY(${bgGridTranslateY}px)`,
        }}
      >
        {Array.from({ length: 288 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-slate-900" />
        ))}
      </div>

      {/* Soft Glow Ambient Lighting */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[220px] opacity-[0.06] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #387ED1 0%, rgba(255,255,255,0) 70%)",
          top: "10%",
          left: "20%",
        }}
      />

      {/* Camera Frame Zoom and Pan Container */}
      <div
        className="w-[1600px] h-[920px] flex flex-col justify-center items-center relative"
        style={{
          transform: `scale(${finalScale}) translateX(${cameraTranslateX}px)`,
          transformOrigin: `${zoomOriginX} ${zoomOriginY}`,
        }}
      >
        {/* Mock Browser Container */}
        <div
          className="w-full h-full bg-[#ffffff]/80 backdrop-blur-md rounded-[24px] border border-slate-100 flex flex-col overflow-hidden relative"
          style={{
            scale: `${browserScale}`,
            opacity: browserOpacity,
            boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.06), 0 12px 40px -15px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Browser Header Bar */}
          <div className="h-12 border-b border-slate-50 flex items-center justify-between px-6 bg-white shrink-0">
            {/* Window control dots */}
            <div className="flex items-center space-x-2 w-20">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/80" />
            </div>
            {/* Address Bar */}
            <div className="flex items-center space-x-2 bg-slate-50/80 border border-slate-100/50 px-6 py-1 rounded-full text-slate-400 text-xs w-[500px] justify-center">
              <span className="text-emerald-500 font-bold">🔒</span>
              <span className="font-medium tracking-wide">invest.platform.com/dashboard</span>
            </div>
            {/* Right mock tools */}
            <div className="flex items-center space-x-3 w-20 justify-end">
              <div className="w-4 h-4 rounded-full bg-slate-200" />
              <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-[10px] text-white font-bold">U</div>
            </div>
          </div>

          {/* Browser Main Body */}
          <div className="flex flex-1 overflow-hidden relative bg-[#fafafa]/50">
            
            {/* ==========================================
                HERO OVERLAY (Frames 0 - 75)
                ========================================== */}
            {frame < 80 && (
              <div 
                className="absolute inset-0 flex flex-col justify-center items-center bg-white z-30"
                style={{
                  transform: `translateY(${heroExitTranslateY}px)`,
                  opacity: heroExitOpacity,
                }}
              >
                <div className="text-center space-y-5">
                  <SlideTextReveal
                    text="Track • Analyse • Invest"
                    startFrame={15}
                    duration={20}
                    color={accentColor}
                    fontFamily={interFamily}
                    className="text-sm font-bold tracking-[8px] uppercase pl-[8px]"
                  />
                  
                  <h1
                    style={{
                      fontFamily: poppinsFamily,
                      letterSpacing: "-1.5px",
                    }}
                    className="text-6xl font-extrabold text-slate-900 leading-none select-none"
                  >
                    <SlideTextReveal
                      text="Start Investing with Confidence"
                      startFrame={25}
                      duration={20}
                      color="#0f172a"
                    />
                  </h1>

                  <p
                    style={{
                      fontFamily: interFamily,
                    }}
                    className="text-slate-500 text-xl font-light max-w-2xl mx-auto"
                  >
                    <SlideTextReveal
                      text="Manage your portfolio with a simple and powerful dashboard."
                      startFrame={35}
                      duration={20}
                      color="#64748b"
                      stagger={1.5}
                    />
                  </p>
                </div>
              </div>
            )}

            {/* ==========================================
                MAIN DASHBOARD VIEWPORT (Slides up at frame 60)
                ========================================== */}
            <div
              className="flex-1 flex overflow-hidden relative"
              style={{
                transform: `translateY(${dashboardTranslateY}px)`,
                opacity: dashboardOpacity,
              }}
            >
              {/* Sidebar Navigation */}
              <div className="w-[230px] border-r border-slate-100 bg-white p-5 flex flex-col justify-between shrink-0">
                <div className="space-y-8">
                  {/* Logo */}
                  <div className="flex items-center space-x-2.5 px-2">
                    <div className="w-7 h-7 rounded-lg bg-[#387ED1] flex items-center justify-center text-white font-bold text-sm">
                      P
                    </div>
                    <span style={{ fontFamily: poppinsFamily }} className="text-lg font-bold text-slate-800 tracking-tight">
                      PulseInvest
                    </span>
                  </div>

                  {/* Menu Links */}
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-blue-50/50 text-[#387ED1] font-semibold text-sm">
                      <span className="text-base">📊</span>
                      <span>Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-500 font-medium text-sm hover:bg-slate-50">
                      <span className="text-base">📈</span>
                      <span>Market Analysis</span>
                    </div>
                    <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-500 font-medium text-sm hover:bg-slate-50">
                      <span className="text-base">💼</span>
                      <span>Holdings</span>
                    </div>
                    <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-500 font-medium text-sm hover:bg-slate-50 relative">
                      <span className="text-base">🔔</span>
                      <span>Alerts</span>
                      {/* Notification Badge */}
                      <span className="absolute right-3 w-4 h-4 rounded-full bg-[#387ED1] text-white text-[9px] font-bold flex items-center justify-center">
                        2
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-500 font-medium text-sm hover:bg-slate-50">
                      <span className="text-base">⚙️</span>
                      <span>Settings</span>
                    </div>
                  </div>
                </div>

                {/* Live System Indicator Badge */}
                <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-slate-500 font-bold tracking-widest font-mono">LIVE FEED</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold font-mono">100% OK</span>
                </div>
              </div>

              {/* Main Content Dashboard Area */}
              <div className="flex-1 p-6 flex flex-col overflow-hidden space-y-5">
                
                {/* Dashboard Grid Container */}
                <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
                  
                  {/* Card 1: Portfolio Value */}
                  <div
                    style={c1Style}
                    className="col-span-3 bg-white rounded-[20px] p-5 border border-slate-100/50 flex flex-col justify-between font-sans shadow-[0_4px_20px_-2px_rgba(0,0,0,0.015)]"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span style={{ fontFamily: interFamily }} className="text-xs font-semibold uppercase tracking-wider">
                        Portfolio Value
                      </span>
                      <span className="text-lg">💼</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span style={{ fontFamily: poppinsFamily }} className="text-2xl font-extrabold text-slate-800 tracking-tight">
                        {formatINR(portfolioVal)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Invested: ₹7,12,400
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Today's Gain */}
                  <div
                    style={c2Style}
                    className="col-span-3 bg-white rounded-[20px] p-5 border border-slate-100/50 flex flex-col justify-between font-sans shadow-[0_4px_20px_-2px_rgba(0,0,0,0.015)]"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span style={{ fontFamily: interFamily }} className="text-xs font-semibold uppercase tracking-wider">
                        Today's Gain
                      </span>
                      <span className="text-lg">⚡</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span style={{ fontFamily: poppinsFamily }} className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                        +{formatINR(todaysGain)}
                      </span>
                      {/* Green Percentage Animate Upward */}
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center space-x-0.5 animate-bounce">
                        <span>↑</span>
                        <span>+{returnsVal.toFixed(1)}% All-Time</span>
                      </span>
                    </div>
                  </div>

                  {/* Card 5: Market Overview */}
                  <div
                    style={c5Style}
                    className="col-span-6 bg-white rounded-[20px] p-4 border border-slate-100/50 flex flex-col justify-between font-sans shadow-[0_4px_20px_-2px_rgba(0,0,0,0.015)]"
                  >
                    <div className="flex justify-between items-center text-slate-400">
                      <span style={{ fontFamily: interFamily }} className="text-xs font-semibold uppercase tracking-wider">
                        Market Indices
                      </span>
                      <span className="text-[10px] text-emerald-500 font-bold tracking-widest font-mono flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        <span>LIVE</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50/50 border border-slate-100/50 rounded-xl p-2 flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 font-bold">NIFTY 50</span>
                        <div className="flex justify-between items-baseline mt-1">
                          <span className="text-[11px] font-bold text-slate-800">24,320.15</span>
                          <span className="text-[9px] font-bold text-emerald-500">+0.8%</span>
                        </div>
                      </div>
                      <div className="bg-slate-50/50 border border-slate-100/50 rounded-xl p-2 flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 font-bold">SENSEX</span>
                        <div className="flex justify-between items-baseline mt-1">
                          <span className="text-[11px] font-bold text-slate-800">79,845.50</span>
                          <span className="text-[9px] font-bold text-emerald-500">+0.7%</span>
                        </div>
                      </div>
                      <div className="bg-slate-50/50 border border-slate-100/50 rounded-xl p-2 flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 font-bold">BANK NIFTY</span>
                        <div className="flex justify-between items-baseline mt-1">
                          <span className="text-[11px] font-bold text-slate-800">52,410.30</span>
                          <span className="text-[9px] font-bold text-red-500">-0.2%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Investment Growth Chart (Focal Point of Zoom Transition) */}
                  <div
                    style={c3Style}
                    className="col-span-8 bg-white rounded-[20px] p-5 border border-slate-100/50 flex flex-col justify-between overflow-hidden relative font-sans shadow-[0_4px_20px_-2px_rgba(0,0,0,0.015)]"
                  >
                    <div className="flex items-center justify-between z-10 shrink-0">
                      <div className="flex flex-col">
                        <span style={{ fontFamily: interFamily }} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Investment Growth
                        </span>
                        <span style={{ fontFamily: poppinsFamily }} className="text-lg font-bold text-slate-800">
                          ₹8,45,320
                        </span>
                      </div>
                      <div className="flex space-x-1.5 text-[10px] font-bold font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-400">1W</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-400">1M</span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#387ED1]">ALL TIME</span>
                      </div>
                    </div>

                    {/* SVG Line / Area Graph */}
                    <div className="h-[120px] w-full relative z-10 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 600 120" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#387ED1" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#387ED1" stopOpacity="0" />
                          </linearGradient>
                          <clipPath id="chart-reveal-clip">
                            <rect x="0" y="0" width={600 * chartProgress} height="120" />
                          </clipPath>
                        </defs>

                        {/* Area Fill */}
                        <path
                          d={areaPath}
                          fill="url(#chart-area-grad)"
                          clipPath="url(#chart-reveal-clip)"
                        />

                        {/* Drawing Line */}
                        <path
                          d={linePath}
                          fill="none"
                          stroke="#387ED1"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          clipPath="url(#chart-reveal-clip)"
                          style={{
                            filter: "drop-shadow(0 4px 6px rgba(56, 126, 209, 0.15))",
                          }}
                        />

                        {/* Graph Point marker at progress edge */}
                        {chartProgress > 0 && chartProgress < 1 && (
                          <circle
                            cx={600 * chartProgress}
                            cy={interpolate(chartProgress, [0, 1], [95, 15])}
                            r="5"
                            fill="#387ED1"
                            stroke="white"
                            strokeWidth="1.5"
                            className="shadow"
                          />
                        )}
                      </svg>
                    </div>
                  </div>

                  {/* Card 4: Portfolio Allocation */}
                  <div
                    style={c4Style}
                    className="col-span-4 bg-white rounded-[20px] p-5 border border-slate-100/50 flex flex-col justify-between font-sans shadow-[0_4px_20px_-2px_rgba(0,0,0,0.015)]"
                  >
                    <span style={{ fontFamily: interFamily }} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Asset Allocation
                    </span>
                    <div className="flex items-center justify-between flex-1 mt-2">
                      {/* SVG Doughnut Pie Chart */}
                      <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                        <svg
                          className="w-full h-full"
                          viewBox="0 0 100 100"
                          style={{
                            transform: `rotate(${pieRotation}deg)`,
                          }}
                        >
                          <circle cx="50" cy="50" r={R} fill="transparent" stroke="#f1f5f9" strokeWidth="11" />
                          
                          {/* Segment 1: Stocks (50%) - Blue */}
                          <circle
                            cx="50"
                            cy="50"
                            r={R}
                            fill="transparent"
                            stroke="#387ED1"
                            strokeWidth="11"
                            strokeDasharray={`${segment1Length} ${C}`}
                            strokeDashoffset={segment1Length * (1 - pieProgress)}
                          />

                          {/* Segment 2: Mutual Funds (25%) - Emerald */}
                          <circle
                            cx="50"
                            cy="50"
                            r={R}
                            fill="transparent"
                            stroke="#10B981"
                            strokeWidth="11"
                            strokeDasharray={`${segment2Length} ${C}`}
                            strokeDashoffset={-segment1Length - (segment2Length * (1 - pieProgress))}
                          />

                          {/* Segment 3: ETFs (15%) - Orange */}
                          <circle
                            cx="50"
                            cy="50"
                            r={R}
                            fill="transparent"
                            stroke="#F59E0B"
                            strokeWidth="11"
                            strokeDasharray={`${segment3Length} ${C}`}
                            strokeDashoffset={-segment1Length - segment2Length - (segment3Length * (1 - pieProgress))}
                          />

                          {/* Segment 4: SIPs / Cash (10%) - Purple */}
                          <circle
                            cx="50"
                            cy="50"
                            r={R}
                            fill="transparent"
                            stroke="#8B5CF6"
                            strokeWidth="11"
                            strokeDasharray={`${segment4Length} ${C}`}
                            strokeDashoffset={-segment1Length - segment2Length - segment3Length - (segment4Length * (1 - pieProgress))}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span style={{ fontFamily: poppinsFamily }} className="text-sm font-bold text-slate-800">
                            100%
                          </span>
                          <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">Assets</span>
                        </div>
                      </div>

                      {/* Legend Details with Stagger Bounce Icons */}
                      <div className="flex flex-col space-y-1.5 ml-4 flex-1">
                        {/* Stocks */}
                        <div className="flex items-center justify-between" style={{ transform: `scale(${label1Scale})` }}>
                          <div className="flex items-center space-x-1.5 font-sans">
                            <span className="w-2 h-2 rounded-full bg-[#387ED1] shrink-0" />
                            <span className="text-[10px] font-bold text-slate-600">Stocks</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 font-mono">50%</span>
                        </div>
                        {/* Mutual Funds */}
                        <div className="flex items-center justify-between" style={{ transform: `scale(${label2Scale})` }}>
                          <div className="flex items-center space-x-1.5 font-sans">
                            <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
                            <span className="text-[10px] font-bold text-slate-600">Mutual Funds</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 font-mono">25%</span>
                        </div>
                        {/* ETFs */}
                        <div className="flex items-center justify-between" style={{ transform: `scale(${label3Scale})` }}>
                          <div className="flex items-center space-x-1.5 font-sans">
                            <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />
                            <span className="text-[10px] font-bold text-slate-600">ETFs</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 font-mono">15%</span>
                        </div>
                        {/* SIPs */}
                        <div className="flex items-center justify-between" style={{ transform: `scale(${label4Scale})` }}>
                          <div className="flex items-center space-x-1.5 font-sans">
                            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0" />
                            <span className="text-[10px] font-bold text-slate-600">SIPs</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 font-mono">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 6: Watchlist */}
                  <div
                    style={c6Style}
                    className="col-span-4 bg-white rounded-[20px] p-5 border border-slate-100/50 flex flex-col justify-between font-sans shadow-[0_4px_20px_-2px_rgba(0,0,0,0.015)]"
                  >
                    <span style={{ fontFamily: interFamily }} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Watchlist
                    </span>
                    <div className="flex flex-col space-y-2 mt-2">
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                        <span className="text-[11px] font-bold text-slate-700">RELIANCE</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold text-slate-800">₹2,950.40</span>
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1 py-0.5 rounded">+2.1%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                        <span className="text-[11px] font-bold text-slate-700">HDFC BANK</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold text-slate-800">₹1,642.50</span>
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1 py-0.5 rounded">+1.2%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-[11px] font-bold text-slate-700">INFOSYS</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold text-slate-800">₹1,510.20</span>
                          <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 py-0.5 rounded">-0.5%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 7: Recent Transactions */}
                  <div
                    style={c7Style}
                    className="col-span-4 bg-white rounded-[20px] p-5 border border-slate-100/50 flex flex-col justify-between font-sans shadow-[0_4px_20px_-2px_rgba(0,0,0,0.015)]"
                  >
                    <span style={{ fontFamily: interFamily }} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Recent Activity
                    </span>
                    <div className="flex flex-col space-y-2 mt-2">
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-700">Bought VOO ETF</span>
                          <span className="text-[8px] text-slate-400">Stocks & Equities</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-800">-₹15,000</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-700">SIP Debit - UTI Nifty</span>
                          <span className="text-[8px] text-slate-400">Mutual Fund</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-800">-₹5,000</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-700">Dividend: TCS</span>
                          <span className="text-[8px] text-slate-400">Direct Equity</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-500">+₹1,200</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 8: Quick Actions */}
                  <div
                    style={c8Style}
                    className="col-span-4 bg-white rounded-[20px] p-5 border border-slate-100/50 flex flex-col justify-between font-sans shadow-[0_4px_20px_-2px_rgba(0,0,0,0.015)]"
                  >
                    <span style={{ fontFamily: interFamily }} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Quick Actions
                    </span>
                    <div className="grid grid-cols-2 gap-3 mt-2 flex-1">
                      <div className="border border-slate-100 hover:border-slate-200 rounded-xl p-2.5 flex flex-col justify-between cursor-pointer bg-[#fafafa]/50 transition-colors">
                        <span className="text-sm">➕</span>
                        <span className="text-[10px] font-semibold text-slate-600">Invest Now</span>
                      </div>
                      <div className="border border-slate-100 hover:border-slate-200 rounded-xl p-2.5 flex flex-col justify-between cursor-pointer bg-[#fafafa]/50 transition-colors">
                        <span className="text-sm">🔄</span>
                        <span className="text-[10px] font-semibold text-slate-600">Start SIP</span>
                      </div>
                      <div className="border border-slate-100 hover:border-slate-200 rounded-xl p-2.5 flex flex-col justify-between cursor-pointer bg-[#fafafa]/50 transition-colors">
                        <span className="text-sm">📊</span>
                        <span className="text-[10px] font-semibold text-slate-600">Analyze</span>
                      </div>
                      <div className="border border-slate-100 hover:border-slate-200 rounded-xl p-2.5 flex flex-col justify-between cursor-pointer bg-[#fafafa]/50 transition-colors">
                        <span className="text-sm">📥</span>
                        <span className="text-[10px] font-semibold text-slate-600">Withdraw</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
