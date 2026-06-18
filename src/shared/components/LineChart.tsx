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

  return (
    <div className="relative h-[220px] w-full">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default LineChart;
