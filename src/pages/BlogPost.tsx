import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Facebook, Instagram } from "lucide-react";
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
    date: "May 19, 2025",
    readTime: "8 Min",
    image: heroImage,
    author: "Jana Johnson",
    content: {
      intro: "Skincare is often seen as a practical task—a way to cleanse, hydrate, and protect. But beneath the surface, it holds the power to do something more. It can become a personal ritual, a quiet space where you reconnect with yourself, even if just for a few minutes a day. When done with intention, skincare transforms into a meaningful form of self-care.",
      sections: [
        {
          title: "More Than Skin Deep",
          paragraphs: [
            "Skincare is often seen as a practical task—a way to cleanse, hydrate, and protect. But beneath the surface, it holds the power to do something more. It can become a personal ritual, a quiet space where you reconnect with yourself, even if just for a few minutes a day. When done with intention, skincare transforms into a meaningful form of self-care.",
            "This shift in mindset begins by slowing down. Applying a warm cleanser in the evening, pressing a serum gently into your skin, or taking a moment to inhale the calming scent of botanical ingredients—all of it invites stillness. These gestures create a rhythm that soothes both the body and the mind, offering calm in an often chaotic world.",
            "Choosing skincare as self-care also means being kind to yourself. It's about noticing what your skin needs, accepting where you are today, and honoring yourself through care. The simple act of tending to your skin can remind you that you're worth the time, the effort, and the softness you offer others."
          ]
        },
        {
          title: "Creating a Ritual That Restores",
          paragraphs: [
            "To make skincare truly restorative, consistency matters more than complexity. You don't need dozens of steps—just a few that feel good, are gentle, and serve your unique needs. This kind of routine becomes a daily check-in, a moment of presence that rebalances you before or after the day.",
            "The environment you create plays a role too. Turning off harsh lights, playing soft music, and taking your time can make your evening skincare feel like a quiet retreat. Even a short ritual can shift your energy—easing tension in your face, calming your thoughts, and preparing your body for rest.",
            "Self-care isn't about perfection. It's about intention. Let your skincare ritual be flexible, forgiving, and personal. Some days it might be five minutes; other days, it's more. What matters is that it's yours—a regular reminder that your wellbeing deserves attention, not just productivity."
          ]
        },
        {
          title: "Nourishing the Skin, Nurturing the Soul",
          paragraphs: [
            "The products you choose are part of the experience. Natural, calming ingredients like chamomile, lavender, or rose can support both your skin and your senses. These gentle elements soothe irritation, reduce stress, and create a deeper connection to nature within your routine.",
            "But beyond ingredients, it's the moment you create that leaves the lasting impression. Skincare becomes a language of care—a way to express tenderness toward yourself when life feels too rushed. It grounds you in your body and helps release the pressure to always be doing."
          ]
        }
      ],
      conclusion: "In the end, skincare as self-care is about balance. It's a pause, a breath, a signal to slow down. Through this art of relaxation, you're not just nourishing your skin—you're making space to care for your whole self. And that, in itself, is a beautiful and necessary thing."
    }
  },
  {
    id: 2,
    title: "Nature's Inspiration: Sustainable Skincare Rituals",
    category: "Sustainable Beauty",
    date: "May 15, 2025",
    readTime: "6 Min",
    image: ecoProduct,
    author: "Jana Johnson",
    content: {
      intro: "Sustainability in skincare goes beyond ingredients—it's about creating rituals that honor both your skin and the planet.",
      sections: [
        {
          title: "Embracing Nature's Wisdom",
          paragraphs: [
            "Nature has always been the best teacher when it comes to skincare. Plants, minerals, and botanicals offer gentle yet effective solutions that work in harmony with your skin's natural processes.",
            "By choosing sustainable products, you're not just caring for yourself—you're participating in a larger movement toward environmental responsibility."
          ]
        }
      ],
      conclusion: "Sustainable skincare is a commitment to both personal wellness and planetary health. Every choice matters."
    }
  },
  {
    id: 3,
    title: "Hydration Secrets: How to Keep Your Skin Soft and Smooth",
    category: "Sustainable Beauty",
    date: "May 10, 2025",
    readTime: "7 Min",
    image: skinCloseup,
    author: "Jana Johnson",
    content: {
      intro: "Hydration is the foundation of healthy, glowing skin. Understanding how to properly hydrate can transform your skincare routine.",
      sections: [
        {
          title: "The Science of Hydration",
          paragraphs: [
            "Your skin is made up of cells that require water to function optimally. When properly hydrated, skin appears plump, smooth, and radiant.",
            "Dehydration can affect all skin types, causing dullness, fine lines, and increased sensitivity."
          ]
        }
      ],
      conclusion: "Consistent hydration, both internally and externally, is key to maintaining healthy, beautiful skin."
    }
  },
  {
    id: 4,
    title: "Fresh Starts: Morning Skincare Tips for Radiant Skin",
    category: "Sustainable Beauty",
    date: "May 5, 2025",
    readTime: "5 Min",
    image: product1,
    author: "Jana Johnson",
    content: {
      intro: "Your morning skincare routine sets the tone for the entire day. Start right, and your skin will thank you.",
      sections: [
        {
          title: "The Perfect Morning Routine",
          paragraphs: [
            "A simplified morning routine can be just as effective as an elaborate one. Focus on cleansing, hydrating, and protecting.",
            "Remember that your morning routine should complement what you did the night before."
          ]
        }
      ],
      conclusion: "Consistency in your morning routine leads to lasting results and naturally radiant skin."
    }
  },
  {
    id: 5,
    title: "Effortless Glow: Skincare Tips for Natural Beauty",
    category: "Self-Care & Wellness",
    date: "April 28, 2025",
    readTime: "6 Min",
    image: product2,
    author: "Jana Johnson",
    content: {
      intro: "Achieving a natural glow doesn't require complicated routines or expensive products. Sometimes, simplicity is key.",
      sections: [
        {
          title: "Less Is More",
          paragraphs: [
            "The beauty industry often tells us we need more products, more steps, more everything. But your skin often thrives with less.",
            "Focus on quality over quantity, and let your natural beauty shine through."
          ]
        }
      ],
      conclusion: "True beauty comes from within, supported by simple, intentional skincare practices."
    }
  },
  {
    id: 6,
    title: "Your Daily Routine: Skincare Essentials for Every Skin Type",
    category: "Self-Care & Wellness",
    date: "April 20, 2025",
    readTime: "8 Min",
    image: product3,
    author: "Jana Johnson",
    content: {
      intro: "Understanding your skin type is the first step toward creating an effective daily routine that works for you.",
      sections: [
        {
          title: "Know Your Skin",
          paragraphs: [
            "Whether you have oily, dry, combination, or sensitive skin, the basics remain the same: cleanse, treat, moisturize, protect.",
            "Listen to your skin—it will tell you what it needs."
          ]
        }
      ],
      conclusion: "A personalized routine based on your unique skin type will always outperform generic advice."
    }
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === Number(id));
  const relatedPosts = blogPosts.filter((p) => p.id !== Number(id)).slice(0, 2);

  if (!post) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <main className="py-20 text-center">
          <h1 className="text-2xl font-heading">Post not found</h1>
          <Link to="/blog" className="text-sage underline mt-4 inline-block">
            Back to Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px]">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="max-w-7xl mx-auto flex justify-between items-end">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white max-w-2xl leading-tight">
                {post.title}
              </h1>
              <a
                href="#article"
                className="hidden md:flex items-center gap-2 text-white text-sm hover:opacity-80 transition-opacity"
              >
                Read Article <span className="text-lg">↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article id="article" className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4">
            {/* Meta Info */}
            <div className="flex gap-12 mb-12 pb-8 border-b border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Date</p>
                <p className="text-sm text-muted-foreground">{post.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Category</p>
                <p className="text-sm text-muted-foreground italic">{post.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Reading Time</p>
                <p className="text-sm text-muted-foreground">{post.readTime}</p>
              </div>
            </div>

            {/* Article Sections */}
            {post.content.sections.map((section, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-2xl md:text-3xl font-heading mb-6">{section.title}</h2>
                {section.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}

            {/* Conclusion Card */}
            <div className="bg-background rounded-2xl p-8 mt-12">
              <h3 className="text-2xl font-heading mb-4">Conclusion</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {post.content.conclusion}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sage/20 overflow-hidden">
                    <img
                      src={heroImage}
                      alt={post.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{post.author}</p>
                    <p className="text-xs text-muted-foreground">Author</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Share Article</span>
                  <div className="flex gap-2">
                    <a href="#" className="text-foreground hover:text-sage transition-colors">
                      <Facebook size={18} />
                    </a>
                    <a href="#" className="text-foreground hover:text-sage transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a href="#" className="text-foreground hover:text-sage transition-colors">
                      <Instagram size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading italic text-center mb-12">
              You might like
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="group">
                  <Link to={`/blog/${relatedPost.id}`}>
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-2">
                      {relatedPost.category}
                    </p>
                    <h3 className="font-heading text-lg md:text-xl italic mb-3 leading-snug">
                      {relatedPost.title}
                    </h3>
                    <span className="text-sm text-foreground underline underline-offset-4 hover:text-sage transition-colors">
                      Read Article
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
