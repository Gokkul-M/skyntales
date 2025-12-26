import { Link } from "react-router-dom";
import { Check, Star, Leaf, Sparkles, Package, Truck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import heroImage from "@/assets/hero-model.jpg";
import ecoProduct from "@/assets/eco-product.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import skinCloseup from "@/assets/skin-closeup.jpg";
import NewsletterSection from "@/components/home/NewsletterSection";

const stats = [
  { value: "62%", label: "Natural Ingredients", description: "Pure, clean and ethically sourced skincare." },
  { value: "60%", label: "Customer Satisfaction", description: "Trusted by beauty-conscious customers worldwide." },
  { value: "53%", label: "Less Packaging", description: "Eco-friendly design for a greener planet." },
  { value: "6/10", label: "Recommend Us", description: "Loved and recommended by our customers." },
];

const simpleRitualsBenefits = [
  "100% Natural Ingredients",
  "Sustainable Packaging",
  "Cruelty-Free Commitment",
];

const skinDeservesBenefits = [
  "Backed for Dermatologists",
  "Powered by Natural Ingredients",
  "Driven by Innovation",
];

const packagingFeatures = [
  { icon: Leaf, title: "Natural Formula", description: "Crafted with pure, nurturing ingredients for skin that glows." },
  { icon: Sparkles, title: "Cruelty-Free", description: "Our products are never tested on animals, ever. Humane." },
  { icon: Package, title: "Expert Approved", description: "Carefully tested for skincare solutions with visible results." },
  { icon: Truck, title: "Free Shipping", description: "Delivered to your doorstep fast free, within most locations." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[100vh] bg-primary overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImage} alt="About Kanva" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
          </div>
          <div className="relative container-kanva section-padding flex items-center top-30 min-h-[60vh]">
            <div className="max-w-xl">
              <h1 className="text-h1 md:text-display font-heading text-primary-foreground mb-4">
                Redefining
                <br />
                <span className="italic">Skincare</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed mb-6">
                At Kanva, we blend nature and science to create skincare that transforms, empowers, and respects the planet.
              </p>
              <Link to="/about" className="text-primary-foreground flex items-center gap-2 hover:gap-3 transition-all">
                Our Story <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-secondary">
          <div className="container-kanva">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-10 rounded-2xl bg-background">
                  <div className="text-3xl md:text-4xl font-heading font-bold mb-2">{stat.value}</div>
                  <div className="font-medium text-foreground mb-1">{stat.label}</div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Driven by Care Section */}
        <section className="section-padding bg-secondary">
          <div className="container-kanva">
            <div className="flex flex-col lg:flex-row items-start gap-8 mb-8">
              <div className="lg:w-1/2">
                <h2 className="text-h2 md:text-h1 font-heading">
                  Driven by Care
                  <br />
                  <span className="italic">Rooted in Nature</span>
                </h2>
              </div>
              <div className="lg:w-1/2 flex justify-end">
                <div className="bg-secondary rounded-full px-4 py-2 flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.7 (3.5K reviews)</span>
                  <div className="flex -space-x-2 ml-2">
                    <div className="w-6 h-6 rounded-full bg-sage overflow-hidden">
                      <img src={skinCloseup} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-primary overflow-hidden">
                      <img src={heroImage} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Rituals Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden">
                  <img src={heroImage} alt="Simple rituals" className="w-full h-[600px] object-cover" />
                </div>
              </div>
              <div className="bg-white h-150 p-10 rounded-3xl">
                <span className="text-sm font-medium text-sage tracking-wide uppercase mb-4 block">About Us</span>
                <h3 className="text-h2 font-heading mb-4">
                  Simple Rituals
                  <br />
                  <span className="italic">Powerful Results</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Kanva is built on the belief that skincare should enhance your natural beauty, not mask it. By combining the best of science with natural ingredients, we bring effective and beautiful products to your skincare journey.
                </p>
                <div className="space-y-3">
                  {simpleRitualsBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center">
                        <Check className="h-3 w-3 text-sage" strokeWidth={2} />
                      </div>
                      <span className="text-foreground font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Your Skin Deserves Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 bg-white h-150 p-10 rounded-3xl">
                <span className="text-sm font-medium text-sage tracking-wide uppercase mb-4 block">Our Promise</span>
                <h3 className="text-h2 font-heading mb-4">
                  Why Your Skin
                  <br />
                  <span className="italic">Deserves the Best</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Kanva embodies a simple goal: skincare that works in harmony with your skin and the planet. From handpicked ingredients to beautiful blends, every product tells a story of clean beauty, natural efficiency, and sustainable skincare solutions.
                </p>
                <div className="space-y-3">
                  {skinDeservesBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center">
                        <Check className="h-3 w-3 text-sage" strokeWidth={2} />
                      </div>
                      <span className="text-foreground font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="rounded-3xl overflow-hidden">
                  <img src={ecoProduct} alt="Why your skin deserves the best" className="w-full h-[600px] object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement Section */}
        <section className="section-padding bg-secondary">
          <div className="container-kanva text-center">
            <div className="flex justify-center mb-6">
              <svg className="w-12 h-12 text-sage" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10C30 30 20 50 20 70C20 85 35 95 50 95C65 95 80 85 80 70C80 50 70 30 50 10Z" opacity="0.3" />
                <path d="M50 25C35 40 28 55 28 72C28 82 38 88 50 88C62 88 72 82 72 72C72 55 65 40 50 25Z" />
              </svg>
            </div>
            <h2 className="text-h1 md:text-display font-heading leading-tight max-w-3xl mx-auto">
              Natural Beauty.
              <br />
              Sustainable Future.
              <br />
              Effective Skincare. 🌿
            </h2>
            <div className="mt-8">
              <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase block mb-2">Our Mission</span>
              <Link to="/shop" className="text-foreground hover:text-sage transition-colors">
                Learn More →
              </Link>
            </div>
          </div>
        </section>

        {/* Sustainability & Quality Section */}
        <section className="relative min-h-[60vh] bg-black overflow-hidden">
          <div className="absolute inset-0">
            <img src={ecoProduct} alt="Sustainability" className="w-full h-full object-cover opacity-30" />
          </div>
          <div className="relative container-kanva section-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[50vh]">
              <div>
                <h2 className="text-h1 md:text-display font-heading text-primary-foreground mb-6">
                  Sustainability
                  <br />
                  <span className="italic">& Quality</span>
                </h2>
                <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8 max-w-md">
                  Every product is made with 100% natural, carefully sourced ingredients to ensure safe, effective, and gentle care for your skin.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary-foreground/70" strokeWidth={2} />
                    <span className="text-primary-foreground">Clean Ingredients</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary-foreground/70" strokeWidth={2} />
                    <span className="text-primary-foreground">Nature-Driven Solutions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary-foreground/70" strokeWidth={2} />
                    <span className="text-primary-foreground">Conscious Choices</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex justify-end">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img src={product1} alt="Quality products" className="w-80 h-96 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Eco-Friendly Packaging Section */}
        <section className="section-padding bg-background lg:pr-12">
          <div className="container-kanva">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="rounded-3xl overflow-hidden lg:p-22">
                <img src={product2} alt="Eco-friendly packaging" className="w-full h-auto rounded-2xl" />
              </div>
              <div>
                <h2 className="text-h1 md:text-display font-heading mb-4">
                  Eco-Friendly
                  <br />
                  <span className="italic">Packaging</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  At Kanva, sustainability drives every decision we make. Our packaging is designed to reduce waste and protect the planet while maintaining the quality and freshness of our products.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {packagingFeatures.map((feature) => (
                    <div key={feature.title} className="bg-secondary rounded-xl p-4">
                      <feature.icon className="h-12 w-12 text-sage mb-3" strokeWidth={1.5} />
                      <h4 className="font-heading font-medium mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
