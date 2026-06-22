import { useEffect, useRef } from "react";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  LineController,
} from "chart.js";
Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  LineController,
);

interface LineChartProps {
  data: { label: string; value: number }[];
  datasetLabel?: string;
  tooltipFormatter?: (value: number | null) => string;
  yAxisFormatter?: (value: number | null) => string;
}

const LineChart = ({
  data,
  datasetLabel = "Data",
  // tooltipFormatter = (value) => value.toString() ?? "0",
  // yAxisFormatter = (value) => value.toString() ?? "0",
  tooltipFormatter = (value) => (value !== null ? value.toString() : "-"),
  yAxisFormatter = (value) => (value !== null ? value.toString() : "0"),
}: LineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: datasetLabel,
            data: data.map((d) => d.value),
            borderColor: "#0891b2",
            backgroundColor: "rgba(8,145,178,0.08)",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#0891b2",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0c4a6e",
            titleColor: "#bae6fd",
            bodyColor: "#fff",
            callbacks: {
              label: (ctx) => tooltipFormatter(ctx.parsed.y),
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(186,230,253,0.4)" },
            ticks: { color: "#64748b", font: { size: 11 } },
          },
          y: {
            grid: { color: "rgba(186,230,253,0.4)" },
            ticks: {
              color: "#64748b",
              font: { size: 11 },
              stepSize: 1,
              callback: (v) => yAxisFormatter(Number(v)),
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data, datasetLabel, tooltipFormatter, yAxisFormatter]);

  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

if (totalValue === 0) {
  return (
    <div className="relative h-[220px] w-full flex items-center justify-center">
      {/* Ripple rings - same feel */}
      <div className="absolute w-20 h-20 rounded-full border-2 border-blue-200 animate-ping" style={{ animationDuration: "1.5s" }} />
      <div className="absolute w-26 h-26 rounded-full border border-purple-200 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.3s" }} />
      <div className="absolute w-36 h-36 rounded-full border border-cyan-300 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.6s" }} />

      {/* Animated SVG line chart representation */}
      <svg viewBox="0 0 120 60" className="absolute h-[130px] w-[200px]">
        {/* Grid lines */}
        <line x1="0" y1="15" x2="120" y2="15" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="0" y1="30" x2="120" y2="30" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="0" y1="45" x2="120" y2="45" stroke="#f1f5f9" strokeWidth="1" />

        {/* Animated wavy line */}
        <polyline
          points="0,45 20,35 40,40 60,20 80,30 100,15 120,25"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 300,
            strokeDashoffset: 300,
            animation: "drawLine 2s ease-in-out infinite alternate",
            filter: "drop-shadow(0 0 4px #6366f1)",
          }}
        />

        {/* Fill area */}
        <polyline
          points="0,45 20,35 40,40 60,20 80,30 100,15 120,25 120,60 0,60"
          fill="url(#fillGrad)"
          stroke="none"
          style={{
            opacity: 0.15,
            animation: "drawLine 2s ease-in-out infinite alternate",
          }}
        />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#0891b2" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Animated dots on line */}
        {[[0,45],[20,35],[40,40],[60,20],[80,30],[100,15],[120,25]].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2.5"
            fill="#0891b2"
            stroke="#fff"
            strokeWidth="1.5"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </svg>

      {/* keyframes */}
      <style>{`
        @keyframes drawLine {
          0% { stroke-dashoffset: 300; opacity: 0.3; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>

      {/* Center label */}
      <div className="absolute bottom-4 flex flex-col items-center gap-1">
        <span className="text-[12px] text-slate-400 font-medium animate-pulse">
          No data for this range
        </span>
      </div>
    </div>
  );
}

  return (
    <div className="relative h-[220px] w-full">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default LineChart;
