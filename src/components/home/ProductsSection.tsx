import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { collection, query, where, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import ecoProduct from "@/assets/eco-product.jpg";
import skinCloseup from "@/assets/skin-closeup.jpg";
import heroModel from "@/assets/hero-model.jpg";

const fallbackImages = [
  { src: product1, alt: "Product 1" },
  { src: product2, alt: "Product 2" },
  { src: product3, alt: "Product 3" },
  { src: ecoProduct, alt: "Eco Product" },
  { src: skinCloseup, alt: "Skin Care" },
  { src: heroModel, alt: "Hero Model" },
  { src: product1, alt: "Product 7" },
  { src: product2, alt: "Product 8" },
  { src: product3, alt: "Product 9" },
  { src: ecoProduct, alt: "Product 10" },
  { src: skinCloseup, alt: "Product 11" },
  { src: heroModel, alt: "Product 12" },
  { src: product1, alt: "Product 13" },
  { src: product2, alt: "Product 14" },
];

interface ProductImage {
  src: string;
  alt: string;
}

const ProductsSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [circleImages, setCircleImages] = useState<ProductImage[]>(fallbackImages);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("status", "==", "Active"), limit(14));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products: ProductImage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const image = data.image || data.images?.[0];
        if (image && image !== "/placeholder.svg") {
          products.push({
            src: image,
            alt: data.name || "Product",
          });
        }
      });
      
      setProductCount(snapshot.size);
      
      if (products.length >= 6) {
        while (products.length < 14) {
          products.push(...products.slice(0, 14 - products.length));
        }
        setCircleImages(products.slice(0, 14));
      } else {
        setCircleImages(fallbackImages);
      }
    }, (error) => {
      console.error("Error fetching products for section:", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && el) {
          el.classList.add("animate-products-reveal");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getImagePosition = (index: number, total: number, radius: number) => {
    const startAngle = 180;
    const endAngle = 360;
    const angle = startAngle + ((endAngle - startAngle) / (total - 1)) * index;
    const rad = (angle * Math.PI) / 180;

    return {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius,
    };
  };

  const size = isMobile ? 52 : 96;
  const radius = isMobile ? 200 : 480;
  const displayCount = productCount > 0 ? `${productCount}+` : "1200+";

  return (
    <section
      ref={sectionRef}
      className="pt-36 sm:pt-56 md:pt-72 section-padding bg-background overflow-hidden opacity-0"
    >
      <div className="container-kanva">
        <div className="relative flex items-center justify-center min-h-[420px] sm:min-h-[580px] md:min-h-[720px]">

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {circleImages.map((image, i) => {
              const pos = getImagePosition(i, circleImages.length, radius);
              const finalY = pos.y + size * 0.3;

              return (
                <div
                  key={i}
                  className={`absolute rounded-full overflow-hidden 
                  border-[3px] border-white bg-white shadow-xl
                  animate-float-${i % 3} transition-transform duration-700`}
                  style={{
                    width: size,
                    height: size,
                    transform: `translate(${pos.x}px, ${finalY}px)`
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = product1;
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="relative z-10 text-center max-w-xl px-4">

            <span className="inline-block px-4 py-2 rounded-full bg-secondary text-foreground 
            text-xs sm:text-sm font-medium mb-5 sm:mb-7 shadow-sm animate-products-tag">
              Stats
            </span>

            <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-1 animate-products-title">
              {displayCount} Products Got
            </h2>

            <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-muted-foreground mb-5 sm:mb-7 animate-products-title delay-150">
              Sold Last Month
            </h2>

            <p className="text-muted-foreground text-sm sm:text-lg mb-7 sm:mb-9 max-w-md mx-auto animate-products-fade delay-300">
              "At Skyntales, we believe beauty should feel effortless and empowering."
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-foreground text-background 
              px-6 sm:px-9 py-3.5 sm:py-4.5 rounded-full font-medium 
              hover:bg-foreground/90 hover:scale-105 transition-all 
              text-xs sm:text-base animate-products-button delay-500"
              data-testid="link-shop-from-home"
            >
              Store
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
