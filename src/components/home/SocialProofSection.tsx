import { useEffect, useRef } from "react";
import { Star, Recycle, Check, Sparkles } from "lucide-react";
import skinCloseup from "@/assets/skin-closeup.jpg";
import product2 from "@/assets/product-2.jpg";

const SocialProofSection = () => {
  const sectionRef = useRef(null);

  // ✅ SCROLL REVEAL ANIMATION
  useEffect(() => {
    const el = sectionRef.current;
    const cards = el?.querySelectorAll(".social-card");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        el.classList.add("animate-social-reveal");

        cards.forEach((card, i) => {
          card.style.animationDelay = `${i * 0.15}s`;
          card.classList.add("animate-social-card");
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
      className="lg:mx-20 section-padding bg-background overflow-hidden opacity-0"
    >
      <div className="container-kanva">
        {/* ✅ HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-display font-heading max-w-lg">
            Why Your Skin
            <br />
            <span className="italic">Deserves the Best</span>
          </h2>

          {/* ✅ RATING BLOCK */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex gap-1 justify-end mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-foreground text-foreground"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                4.7 (1,109 reviews)
              </span>
            </div>
            <div className="flex -space-x-3">
              <img
                src={skinCloseup}
                alt="Customer"
                className="w-10 h-10 rounded-full border-2 border-background object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
                alt="Customer"
                className="w-10 h-10 rounded-full border-2 border-background object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"
                alt="Customer"
                className="w-10 h-10 rounded-full border-2 border-background object-cover"
              />
            </div>
          </div>
        </div>

        {/* ✅ BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ✅ LEFT LARGE IMAGE */}
          <div className="social-card relative h-[360px] sm:h-[480px] lg:h-[620px] rounded-3xl overflow-hidden lg:row-span-2 shadow-xl">
            <img
              src={skinCloseup}
              alt="Proven effectiveness"
              className="social-image w-full h-full object-cover"
            />

            {/* ✅ OVERLAY CARD */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-background/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 max-w-[210px] shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-sage" />
                <span className="text-sm font-semibold text-foreground">
                  Proven
                </span>
              </div>
              <h4 className="font-heading text-base sm:text-lg text-foreground mb-1">
                Effectiveness
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every product is carefully crafted to meet the highest quality
                standards.
              </p>
            </div>
          </div>

          {/* ✅ TOP RIGHT CARD */}
          <div className="social-card bg-secondary rounded-3xl p-6 lg:p-8 flex flex-col lg:col-span-2 
          hover:-translate-y-1 hover:shadow-2xl transition-all">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <Recycle
                  className="h-8 w-8 text-sage mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl sm:text-2xl md:text-h2 font-heading mb-3">
                  Eco-Friendly
                  <br />
                  <span className="italic">Packaging</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Eco-friendly materials designed to care for the planet as much
                  as your skin.
                </p>
              </div>
              <div className="flex-shrink-0">
                <img
                  src={product2}
                  alt="Product"
                  className="w-24 sm:w-32 md:w-40 h-auto rounded-2xl shadow-md"
                />
              </div>
            </div>
          </div>

          {/* ✅ BOTTOM RIGHT CARD */}
          <div className="social-card bg-sage rounded-3xl p-6 lg:p-8 lg:col-span-2 
          hover:-translate-y-1 hover:shadow-2xl transition-all">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl md:text-h2 font-heading text-sage-foreground mb-2">
                  100% Natural
                  <br />
                  <span className="italic">100% You</span>
                </h3>
                <div className="space-y-2 mt-4">
                  {[
                    "No Harsh Chemicals",
                    "Plant-Based Goodness",
                    "Ethically Sourced",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check
                        className="h-4 w-4 text-sage-foreground/80"
                        strokeWidth={2}
                      />
                      <span className="text-sm text-sage-foreground/80">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
