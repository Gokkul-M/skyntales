import { useEffect, useRef } from "react";
import { Leaf, Heart, Shield, Truck } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Natural Formula",
    description: "Made with high-quality, natural ingredients that are gentle on your skin.",
  },
  {
    icon: Heart,
    title: "Cruelty Free",
    description: "Carefully formulated to address a variety of skin concerns.",
  },
  {
    icon: Shield,
    title: "Expert Approved",
    description: "A diverse range of products suitable for all skin types & conditions.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Delivered to your doorstep with no extra costs worldwide.",
  },
];

const FeatureBadges = () => {
  const sectionRef = useRef(null);

  // ✅ SCROLL REVEAL + STAGGER
  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".feature-card");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        cards.forEach((card, i) => {
          card.style.animationDelay = `${i * 0.15}s`;
          card.classList.add("animate-feature-reveal");
        });

        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-14 sm:py-20 bg-background overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card opacity-0 flex flex-col items-center text-center p-7 sm:p-8 
              rounded-2xl bg-secondary/40 backdrop-blur-xl border border-border/30
              hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-14 w-14 mb-5 rounded-full flex items-center justify-center 
              bg-primary/10 text-primary shadow-inner">
                <feature.icon className="h-7 w-7" strokeWidth={1.5} />
              </div>

              <h3 className="font-heading text-base sm:text-lg mb-2 text-foreground">
                {feature.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureBadges;
