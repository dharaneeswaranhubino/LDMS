import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileMenu from "../components/MobileMenu";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import ServicesSection from "../components/ServicesSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  // console.log("scrollY: ",scrollY);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080c14] text-slate-200 scroll-smooth">
      <Navbar scrollY={scrollY} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {menuOpen && <MobileMenu setMenuOpen={setMenuOpen} />}
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;