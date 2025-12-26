import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import ecoProduct from "@/assets/eco-product.jpg";

const benefits = [
  "No Harsh Chemicals",
  "Plant-Based Goodness",
  "Ethically Sourced",
];

const EcoFriendlySection = () => {
  const sectionRef = useRef(null);

  // ✅ SCROLL REVEAL ANIMATION
  useEffect(() => {
    const el = sectionRef.current;
    const items = el?.querySelectorAll(".eco-item");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        el.classList.add("animate-eco-reveal");

        items.forEach((item, i) => {
          item.style.animationDelay = `${i * 0.15}s`;
          item.classList.add("animate-eco-item");
        });

        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative my-8 mt-0 lg:mx-20 opacity-0"
    >
      {/* ✅ GLOBAL-CONTAINER MATCH (THIS FIXES YOUR SPACING ISSUE) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl overflow-hidden min-h-[70vh] grid grid-cols-1 lg:grid-cols-2">

          {/* ✅ LEFT CONTENT */}
          <div
            className="bg-sage p-7 sm:p-10 md:p-14 lg:p-16 
            flex flex-col justify-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-display 
            font-heading text-sage-foreground mb-6 leading-tight">
              <span className="block">Eco-Friendly,</span>
              <span className="block italic">Skin-Friendly</span>
            </h2>

            <p className="text-base sm:text-lg text-sage-foreground/85 
            mb-8 leading-relaxed max-w-md">
              100% natural means every ingredient is carefully selected from
              nature to provide safe, effective, and gentle care for your skin.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="eco-item opacity-0 flex items-center gap-3"
                >
                  <div
                    className="w-6 h-6 rounded-full bg-sage-foreground/20 
                    flex items-center justify-center shadow-inner"
                  >
                    <Check
                      className="h-3.5 w-3.5 text-sage-foreground"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-sage-foreground font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ RIGHT IMAGE */}
          <div className="relative h-[280px] sm:h-[380px] lg:h-auto overflow-hidden">
            <img
              src={ecoProduct}
              alt="Eco-friendly skincare product with natural botanicals"
              className="eco-image w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default EcoFriendlySection;
