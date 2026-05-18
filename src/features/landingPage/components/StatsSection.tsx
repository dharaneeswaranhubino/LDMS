import { useEffect, useRef, useState } from "react";
import deliveryBox from "../../../assets/delivery_box.jfif";
import countries from "../../../assets/Countries_image.jfif";
import successRate from "../../../assets/success_rate.webp";
import supportBell from "../../../assets/support_img.jfif";

const stats = [
  {
    value: 10,
    suffix: "K+",
    label: "Deliveries",
    imgs: deliveryBox,
    altValue: "deliveryBox",
  },
  {
    value: 150,
    suffix: "+",
    label: "Countries",
    imgs: countries,
    altValue: "countries",
  },
  {
    value: 99,
    suffix: "%",
    label: "Success Rate",
    imgs: successRate,
    altValue: "successRate",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Support",
    imgs: supportBell,
    altValue: "supportBell",
  },
];

const Counter = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    //newly learned syntax: new IntersectionObserver(callback, options)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      {
        threshold: 0.4,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  useEffect(() => {
    if (!started) return;

    let start = 0;

    const duration = 1800;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [started, end]);

  return (
    <div ref={ref}>
      {count}
      {suffix}
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="relative overflow-hidden py-24 bg-[#0d1220] border-y border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[140px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-300 tracking-tight">
            Trusted Worldwide
          </h2>

          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg">
            Fast, secure, and reliable logistics powering thousands of
            successful deliveries every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item) => (
            <div
              key={item.label}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-2 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-500 hover:-translate-y-1 shadow-[0_0_30px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10" />
              <div className="flex items-center gap-5">
                <div className="overflow-hidden rounded-2xl w-12 h-12 bg-white/5 border border-white/10 shrink-0">
                  <img
                    src={item.imgs}
                    alt={item.altValue}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-80"
                  />
                </div>

                <div className="grid grid-cols-2 items-center text-slate-500">
                  <p className="text-3xl font-black tracking-tight">
                    <Counter end={item.value} suffix={item.suffix} />
                  </p>
                  <p className="text-slate-400 text-lg  font-medium">
                    {item.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
