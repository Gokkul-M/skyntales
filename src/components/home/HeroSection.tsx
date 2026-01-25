import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { collection, query, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeAnimations from "@/components/animations/ThemeAnimations";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import heroVideo1 from "@/assets/hero-video-1.mp4";
import heroVideo2 from "@/assets/hero-video-2.mp4";
import heroVideo3 from "@/assets/hero-video-3.mp4";

interface FeaturedProduct {
  productId: string;
  productName: string;
  productImage: string;
  position: string;
  slideIndex: number;
}

interface ProductData {
  id: string | number;
  name: string;
  image: string;
  price: number | string;
  position: { top: string; left: string };
}

interface SlideData {
  video: string;
  title: [string, string];
  description: string;
  products: ProductData[];
}

const getPositionCoordinates = (
  position: string,
): { top: string; left: string } => {
  const positions: Record<string, { top: string; left: string }> = {
    center: { top: "50%", left: "50%" },
    top_left: { top: "30%", left: "20%" },
    top_right: { top: "30%", left: "80%" },
    bottom_left: { top: "70%", left: "20%" },
    bottom_right: { top: "70%", left: "80%" },
  };
  return positions[position] || positions.center;
};

const defaultSlides: SlideData[] = [
  {
    video: heroVideo1,
    title: ["Natural", "Skincare"],
    description:
      "Start your day with gentle care and nourishing ingredients designed to awaken your skin naturally.",
    products: [],
  },
  {
    video: heroVideo2,
    title: ["Refresh", "Your Skin"],
    description:
      "Skincare stripped to the essentials — clean, effective, and made with nature in mind.",
    products: [],
  },
  {
    video: heroVideo3,
    title: ["Daily", "Rituals"],
    description:
      "Elevate your routine with products that care for your skin and the planet.",
    products: [],
  },
];

const HeroSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);
  const [slides, setSlides] = useState<SlideData[]>(defaultSlides);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const { activeTheme } = useTheme();

  useEffect(() => {
    const featuredRef = collection(db, "featuredProducts");
    const unsubscribe = onSnapshot(
      featuredRef,
      async (snapshot) => {
        const featuredData: FeaturedProduct[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as FeaturedProduct;
          featuredData.push(data);
        });

        if (featuredData.length === 0) {
          setSlides(defaultSlides);
          setLoading(false);
          return;
        }

        const productPromises = featuredData.map(async (f) => {
          try {
            const productDoc = await getDoc(doc(db, "products", f.productId));
            if (productDoc.exists()) {
              const productData = productDoc.data();
              return {
                ...f,
                productName: productData.name || f.productName,
                productImage:
                  productData.image ||
                  productData.images?.[0] ||
                  f.productImage,
                productPrice: productData.price || 0,
              };
            }
            return { ...f, productPrice: 0 };
          } catch (error) {
            console.error("Error fetching product:", error);
            return { ...f, productPrice: 0 };
          }
        });

        const enrichedFeatured = await Promise.all(productPromises);

        const newSlides = defaultSlides.map((slide, slideIndex) => {
          const slideProducts = enrichedFeatured
            .filter((f) => f.slideIndex === slideIndex)
            .map((f) => ({
              id: f.productId,
              name: f.productName,
              image: f.productImage,
              price: f.productPrice || 0,
              position: getPositionCoordinates(f.position),
            }));

          return {
            ...slide,
            products: slideProducts,
          };
        });

        setSlides(newSlides);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching featured products:", error);
        setSlides(defaultSlides);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Manage video playback
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === selectedIndex) {
          video.play().catch((err) => console.log("Video play error:", err));
        }
      }
    });
  }, [selectedIndex]);

  const scrollPrev = useCallback(() => {
    emblaApi && emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi && emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi && emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setAnimateKey((prev) => prev + 1);
    };

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="relative h-screen w-screen overflow-hidden">
      {activeTheme && activeTheme.animation !== "none" && (
        <ThemeAnimations 
          type={activeTheme.animation as any} 
          color={activeTheme.colors.primary} 
        />
      )}
      
      {activeTheme?.bannerText && (
        <div 
          className="absolute top-0 left-0 right-0 z-40 py-2 px-4 text-center text-sm font-medium"
          style={{ 
            backgroundColor: activeTheme.colors.primary,
            color: activeTheme.colors.textColor 
          }}
        >
          {activeTheme.bannerText}
        </div>
      )}
      
      <div ref={emblaRef} className="h-screen w-screen overflow-hidden">
        <div className="flex h-screen w-screen">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative h-screen w-screen flex-shrink-0"
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={slide.video}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover object-center"
                onLoadedData={(e) => {
                  const video = e.currentTarget;
                  if (index === selectedIndex) {
                    video
                      .play()
                      .catch((err) => console.log("Video play error:", err));
                  }
                }}
              />

              <div className="absolute inset-0 bg-black/30" />

              {index === selectedIndex && (
                <div
                  key={animateKey}
                  className="relative z-10 h-full flex items-center px-6 sm:px-16 max-w-7xl"
                >
                  <div className="max-w-md animate-hero-text">
                    <h1 className="mb-6">
                      <span 
                        className="block text-[clamp(3rem,10vw,6.5rem)] font-heading leading-none"
                        style={{ color: activeTheme?.colors?.textColor || '#ffffff' }}
                      >
                        {slide.title[0]}
                      </span>
                      <span 
                        className="block text-[clamp(3rem,10vw,6.5rem)] font-heading italic leading-none"
                        style={{ color: activeTheme?.colors?.textColor ? `${activeTheme.colors.textColor}cc` : 'rgba(255,255,255,0.8)' }}
                      >
                        {slide.title[1]}
                      </span>
                    </h1>

                    <p 
                      className="text-base md:text-lg mb-10 max-w-sm leading-relaxed"
                      style={{ color: activeTheme?.colors?.textColor ? `${activeTheme.colors.textColor}e6` : 'rgba(255,255,255,0.9)' }}
                    >
                      {slide.description}
                    </p>

                    <Link
                      to="/shop"
                      className="inline-block text-sm font-medium underline underline-offset-4 hover:opacity-80 transition"
                      style={{ color: activeTheme?.colors?.textColor || '#ffffff' }}
                      data-testid="link-shop-now"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              )}

              <div className="hidden md:block">
                {slide.products.map((product, productIndex) => (
                  <Popover key={productIndex}>
                    <PopoverTrigger asChild>
                      <button
                        className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.9)] animate-ping z-20"
                        style={{
                          top: product.position.top,
                          left: product.position.left,
                        }}
                        data-testid={`button-hotspot-${product.id}`}
                      />
                    </PopoverTrigger>

                    <Link to={`/shop/product/${product.id}`}>
                      <PopoverContent side="top" className="w-auto z-30">
                        <div className="flex gap-4 items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <h4 className="font-bold text-sm">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {typeof product.price === "number" &&
                              product.price > 0
                                ? `₹${product.price.toFixed(2)}`
                                : typeof product.price === "string" &&
                                    product.price
                                  ? product.price
                                  : "View Product"}
                            </p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Link>
                  </Popover>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 
        backdrop-blur-xl rounded-full flex items-center justify-center 
        hover:scale-110 transition-all duration-300 shadow-lg z-30"
        style={{ 
          backgroundColor: activeTheme?.colors?.textColor ? `${activeTheme.colors.textColor}4d` : 'rgba(255,255,255,0.3)',
        }}
        data-testid="button-hero-prev"
      >
        <ChevronLeft className="h-6 w-6" style={{ color: activeTheme?.colors?.textColor || '#ffffff' }} />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 
        backdrop-blur-xl rounded-full flex items-center justify-center 
        hover:scale-110 transition-all duration-300 shadow-lg z-30"
        style={{ 
          backgroundColor: activeTheme?.colors?.textColor ? `${activeTheme.colors.textColor}4d` : 'rgba(255,255,255,0.3)',
        }}
        data-testid="button-hero-next"
      >
        <ChevronRight className="h-6 w-6" style={{ color: activeTheme?.colors?.textColor || '#ffffff' }} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{
              backgroundColor: selectedIndex === index 
                ? (activeTheme?.colors?.textColor || '#ffffff')
                : (activeTheme?.colors?.textColor ? `${activeTheme.colors.textColor}66` : 'rgba(255,255,255,0.4)'),
              transform: selectedIndex === index ? 'scale(1.25)' : 'scale(1)',
              boxShadow: selectedIndex === index ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
            }}
            data-testid={`button-dot-${index}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
