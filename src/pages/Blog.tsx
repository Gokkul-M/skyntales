import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import skinCloseup from "@/assets/skin-closeup.jpg";
import ecoProduct from "@/assets/eco-product.jpg";
import heroImage from "@/assets/hero-model.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const blogPosts = [
  {
    id: 1,
    title: "The Art of Relaxation: Skincare as Self-Care",
    category: "Self-Care & Wellness",
    image: heroImage,
  },
  {
    id: 2,
    title: "Nature's Inspiration: Sustainable Skincare Rituals",
    category: "Sustainable Beauty",
    image: ecoProduct,
  },
  {
    id: 3,
    title: "Hydration Secrets: How to Keep Your Skin Soft and Smooth",
    category: "Sustainable Beauty",
    image: skinCloseup,
  },
  {
    id: 4,
    title: "Fresh Starts: Morning Skincare Tips for Radiant Skin",
    category: "Sustainable Beauty",
    image: product1,
  },
  {
    id: 5,
    title: "Effortless Glow: Skincare Tips for Natural Beauty",
    category: "Self-Care & Wellness",
    image: product2,
  },
  {
    id: 6,
    title: "Your Daily Routine: Skincare Essentials for Every Skin Type",
    category: "Self-Care & Wellness",
    image: product3,
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <main>
        {/* Header */}
        <section className="pt-32 pb-8">
          <div className="container-kanva text-center">
            <h1 className="text-5xl md:text-6xl font-heading italic">Blog</h1>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="pb-36 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="group">
                  <Link to={`/blog/${post.id}`}>
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-2">
                      {post.category}
                    </p>
                    <h2 className="font-heading text-lg md:text-xl italic mb-3 leading-snug">
                      {post.title}
                    </h2>
                    <span className="text-sm text-foreground underline underline-offset-4 hover:text-sage transition-colors">
                      Read Article
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="px-4 md:px-8 lg:px-16 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-sage rounded-3xl overflow-hidden relative">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="p-8 md:p-12 lg:p-16">
                  <h2 className="text-4xl md:text-5xl font-heading text-cream mb-2">
                    Stay Updated,
                  </h2>
                  <h2 className="text-4xl md:text-5xl font-heading text-cream/80 italic mb-6">
                    Stay Radiant
                  </h2>
                  <p className="text-cream/70 mb-8 max-w-sm">
                    Be the first to know about new products, offers, and skincare tips.
                  </p>
                  <form className="flex gap-2 max-w-md">
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="flex-1 px-5 py-3 rounded-full bg-cream/90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cream"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
                <div className="hidden lg:flex items-end justify-end relative">
                  <img
                    src={ecoProduct}
                    alt="Product"
                    className="w-80 h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
