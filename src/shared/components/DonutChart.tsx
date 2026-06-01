import { useEffect, useRef } from "react";
import { Chart, ArcElement, DoughnutController, Tooltip } from "chart.js";

Chart.register(ArcElement, DoughnutController, Tooltip);

const DonutChart = ({
  paid,
  pending,
  failed,
}: {
  paid: number;
  pending: number;
  failed: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["Paid", "Pending", "Failed"],
        datasets: [
          {
            data: [paid, pending, failed],
            backgroundColor: ["#0891b2", "#f59e0b", "#ef4444"],
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
    return () => chart.destroy();
  }, [paid, pending, failed]);

  return (
    <div className="relative h-[180px] w-full">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default DonutChart;
