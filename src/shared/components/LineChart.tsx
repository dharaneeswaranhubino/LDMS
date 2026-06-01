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

const LineChart = ({ data }: { data: { label: string; value: number }[] }) => {
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
            label: "Revenue (₹)",
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
              label: (ctx) => " ₹" + ctx?.parsed?.y?.toLocaleString("en-IN"),
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
              callback: (v) => "₹" + Number(v) / 1000 + "k",
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  return (
    <div className="relative h-[220px] w-full">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default LineChart;
