import { useEffect, useRef, useState } from "react";
import { Chart, ArcElement, DoughnutController, Tooltip } from "chart.js";

Chart.register(ArcElement, DoughnutController, Tooltip);

interface DonutChartProps {
  labels: string[];
  values: number[];
  colors: string[];
  legendColors: string[];
  bgColors: string[];
}

const DonutChart = ({ labels, values, colors, legendColors, bgColors }: DonutChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [hiddenIndexes, setHiddenIndexes] = useState<number[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 3,
            borderColor: "#fff",
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0c4a6e",
            titleColor: "#bae6fd",
            bodyColor: "#fff",
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [labels, values, colors]);

  const handleLegendClick = (index: number) => {
    const chart = chartRef.current;
    if (!chart) return;

    chart.toggleDataVisibility(index);
    chart.update();

    setHiddenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const total = values.reduce((sum, value) => sum + value, 0);
if (total === 0) {
  return (
    <>
      <div className="relative h-[180px] w-full flex items-center justify-center">
        {/* Colored ripple rings */}
        <div className="absolute w-16 h-16 rounded-full border-2 border-blue-200 animate-ping" style={{ animationDuration: "1.5s" }} />
        <div className="absolute w-24 h-24 rounded-full border border-purple-200 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.3s" }} />
        <div className="absolute w-32 h-32 rounded-full border border-cyan-300 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.6s" }} />

        {/* Spinning gradient arc */}
        <svg viewBox="0 0 100 100" className="absolute h-[150px] w-[150px] animate-spin" style={{ animationDuration: "4s" }}>
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Base ring */}
          <circle cx="50" cy="50" r="36" fill="none" stroke="#f1f5f9" strokeWidth="8" />
          {/* Gradient arc */}
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="8"
            strokeDasharray="80 196"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 4px #6366f1)" }}
          />
        </svg>

        {/* Center */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shadow-sm">
            <i className="fa-solid fa-chart-pie text-indigo-400 text-[26px]" />
          </div>
          <span className="text-[12px] text-slate-400 font-medium animate-pulse">No data</span>
        </div>
      </div>

      <div className="mt-[18px] flex flex-col gap-2.5">
        {labels.map((label, index) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`inline-block h-[10px] w-[10px] rounded-[3px] ${legendColors[index]}`} />
              <span className="text-[13px] text-slate-600">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${bgColors[index]}`}>0</span>
              <span className="text-xs text-slate-400">0%</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

  return (
    <>
      <div className="relative h-[180px] w-full">
        <canvas ref={canvasRef} />
      </div>

      <div className="mt-[18px] flex flex-col gap-2.5">
        {labels.map((label, index) => {
          const isHidden = hiddenIndexes.includes(index);
          return (
            <div
              key={label}
              onClick={() => handleLegendClick(index)}
              className={`flex items-center justify-between cursor-pointer rounded-lg px-2 py-1 transition-all select-none
                ${isHidden ? "opacity-40" : "opacity-100 hover:bg-slate-50"}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-[10px] w-[10px] rounded-[3px] transition-all
                    ${isHidden ? "bg-slate-300" : legendColors[index]}`}
                />
                <span className={`text-[13px] transition-all ${isHidden ? "line-through text-slate-400" : "text-slate-600"}`}>
                  {label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold transition-all
                  ${isHidden ? "bg-slate-100 text-slate-400" : bgColors[index]}`}>
                  {isHidden ? "-" : values[index]}
                </span>
                <span className="text-xs text-slate-400">
                  {isHidden ? "–" : `${Math.round((values[index] / total) * 100)}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DonutChart;