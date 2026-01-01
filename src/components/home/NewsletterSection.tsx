import { useState, useEffect, useRef } from "react";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";
import ecoProduct from "@/assets/eco-product.jpg";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const sectionRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    try {
      const subscribersRef = collection(db, "newsletterSubscribers");
      const existingQuery = query(subscribersRef, where("email", "==", email.toLowerCase().trim()));
      const existingDocs = await getDocs(existingQuery);
      
      if (!existingDocs.empty) {
        toast({
          title: "Already subscribed",
          description: "This email is already on our newsletter list.",
        });
        setIsSubmitting(false);
        return;
      }
      
      await addDoc(subscribersRef, {
        email: email.toLowerCase().trim(),
        subscribedAt: serverTimestamp(),
        status: "active",
      });
      
      setIsSubscribed(true);
      setEmail("");
      toast({
        title: "Welcome aboard!",
        description: "You've successfully subscribed to our newsletter.",
      });
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

              {isSubscribed ? (
                <div className="newsletter-item flex items-center gap-3 max-w-md opacity-0">
                  <div className="flex items-center gap-2 px-5 py-3 bg-cream/95 rounded-full">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-foreground font-medium">You're subscribed!</span>
                  </div>
                </div>
              ) : (
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
                    disabled={isSubmitting}
                    className="flex-1 px-5 py-3 rounded-full 
                    bg-cream/95 text-foreground placeholder:text-muted-foreground 
                    focus:outline-none focus:ring-2 focus:ring-cream/70
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 bg-foreground text-background 
                    rounded-full font-medium 
                    hover:bg-foreground/90 hover:scale-105 
                    transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </form>
              )}
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
