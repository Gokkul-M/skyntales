import { useState, useEffect, useRef } from "react";
import ecoProduct from "@/assets/eco-product.jpg";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const sectionRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribing:", email);
  };

  // ✅ SCROLL REVEAL ANIMATION
  useEffect(() => {
    const el = sectionRef.current;
    const items = el?.querySelectorAll(".newsletter-item");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        el.classList.add("animate-newsletter-reveal");

        items.forEach((item, i) => {
          item.style.animationDelay = `${i * 0.15}s`;
          item.classList.add("animate-newsletter-item");
        });

        observer.disconnect();
      },
      { threshold: 0.25 }
    );

    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 overflow-hidden opacity-0"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className="bg-sage rounded-3xl overflow-hidden relative 
          shadow-2xl border border-sage-foreground/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">

            {/* ✅ LEFT CONTENT */}
            <div className="p-7 sm:p-10 md:p-14 lg:p-16">
              <h2 className="newsletter-item text-3xl sm:text-4xl md:text-5xl font-heading text-cream mb-2 opacity-0">
                Stay Updated,
              </h2>
              <h2 className="newsletter-item text-3xl sm:text-4xl md:text-5xl font-heading text-cream/80 italic mb-6 opacity-0">
                Stay Radiant
              </h2>

              <p className="newsletter-item text-cream/75 mb-8 max-w-sm text-sm sm:text-base opacity-0">
                Be the first to know about new products, exclusive offers, and
                expert skincare tips delivered straight to your inbox.
              </p>

              <form
                onSubmit={handleSubmit}
                className="newsletter-item flex flex-col sm:flex-row gap-3 max-w-md opacity-0"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                  className="flex-1 px-5 py-3 rounded-full 
                  bg-cream/95 text-foreground placeholder:text-muted-foreground 
                  focus:outline-none focus:ring-2 focus:ring-cream/70"
                />
                <button
                  type="submit"
                  className="px-7 py-3 bg-foreground text-background 
                  rounded-full font-medium 
                  hover:bg-foreground/90 hover:scale-105 
                  transition-all"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* ✅ RIGHT IMAGE (HIDDEN ON MOBILE) */}
            <div className="newsletter-image hidden lg:flex items-end justify-end relative pr-10 pb-6">
              <img
                src={ecoProduct}
                alt="Product"
                className="w-80 h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* ✅ SOFT GLOW BACKDROP */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-cream/10 via-transparent to-cream/10" />
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
