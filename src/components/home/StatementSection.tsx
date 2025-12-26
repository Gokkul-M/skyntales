import { useEffect, useRef } from "react";
import skinCloseup from "@/assets/skin-closeup.jpg";
import ecoProduct from "@/assets/eco-product.jpg";
import { Leaf } from "lucide-react";

const StatementSection = () => {
  const sectionRef = useRef(null);

  // ✅ SCROLL REVEAL ANIMATION
  useEffect(() => {
    const el = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("animate-statement-reveal");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 opacity-0"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <p
          className="text-center font-serif text-stone-800 leading-snug sm:leading-relaxed
          text-[clamp(2rem,5vw,3.75rem)]"
        >
          <span className="inline-block mr-1">Refresh your skin,</span>

          {/* ✅ FLOATING IMAGE 1 */}
          <span className="statement-float inline-block relative w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 
          -rotate-6 align-middle mx-1 sm:mx-2">
            <img
              src={skinCloseup}
              alt="Skin closeup"
              className="rounded-2xl object-cover w-full h-full border-2 sm:border-4 
              border-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
            />
          </span>

          <span className="inline-block ml-1">love yourself,</span>

          <br className="sm:hidden" />

          {/* ✅ FLOATING IMAGE 2 */}
          <span className="statement-float inline-block relative w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 
          rotate-6 align-middle mx-1 sm:mx-2">
            <img
              src={ecoProduct}
              alt="Eco product"
              className="rounded-2xl object-cover w-full h-full border-2 sm:border-4 
              border-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
            />
          </span>

          <br className="hidden lg:block" />

          <span className="inline-block">renew your glow.</span>

          {/* ✅ LEAF ICON */}
          <span className="inline-block text-green-600/60 rotate-12 align-bottom ml-1 sm:ml-2 statement-leaf">
            <Leaf className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16" strokeWidth={1.2} />
          </span>
        </p>
      </div>
    </section>
  );
};

export default StatementSection;
