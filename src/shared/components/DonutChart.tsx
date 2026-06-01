// import { useEffect, useRef } from "react";
// import { Chart, ArcElement, DoughnutController, Tooltip } from "chart.js";

// Chart.register(ArcElement, DoughnutController, Tooltip);

// const DonutChart = ({
//   paid,
//   pending,
//   failed,
// }: {
//   paid: number;
//   pending: number;
//   failed: number;
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     if (!canvasRef.current) return;
//     const chart = new Chart(canvasRef.current, {
//       type: "doughnut",
//       data: {
//         labels: ["Paid", "Pending", "Failed"],
//         datasets: [
//           {
//             data: [paid, pending, failed],
//             backgroundColor: ["#0891b2", "#f59e0b", "#ef4444"],
//             borderWidth: 3,
//             borderColor: "#fff",
//             hoverOffset: 6,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         cutout: "72%",
//         plugins: {
//           legend: { display: false },
//           tooltip: {
//             backgroundColor: "#0c4a6e",
//             titleColor: "#bae6fd",
//             bodyColor: "#fff",
//           },
//         },
//       },
//     });
//     return () => chart.destroy();
//   }, [paid, pending, failed]);

//   return (
//     <div className="relative h-[180px] w-full">
//       <canvas ref={canvasRef} />
//     </div>
//   );
// };

// export default DonutChart;
import { useEffect, useRef } from "react";
import { Chart, ArcElement, DoughnutController, Tooltip } from "chart.js";

Chart.register(ArcElement, DoughnutController, Tooltip);

interface DonutChartProps {
  labels: string[];
  values: number[];
  colors: string[];
  legendColors: string[];
  bgColors:string[];
}

const DonutChart = ({ labels, values, colors,legendColors, bgColors }: DonutChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
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

    return () => chart.destroy();
  }, [labels, values, colors]);

  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <>
      <div className="relative h-[180px] w-full">
        <canvas ref={canvasRef} />
      </div>

      <div className="mt-[18px] flex flex-col gap-2.5">
        {labels.map((label, index) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-[10px] w-[10px] rounded-[3px] ${legendColors[index]}`}
              />

              <span className="text-[13px] text-slate-600">{label}</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${bgColors[index]}`}
              >
                {values[index]}
              </span>

              <span className="text-xs text-slate-400">
                {total > 0 ? Math.round((values[index] / total) * 100) : 0}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DonutChart;
