import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  image: string;
  excerpt: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        const q = query(blogsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const blogsData: BlogPost[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === "published") {
            blogsData.push({
              id: doc.id,
              title: data.title || "",
              category: data.category || "",
              image: data.image || "",
              excerpt: data.excerpt || "",
            });
          }
        });
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="pt-32 pb-8">
          <div className="container-kanva text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading italic">Blog</h1>
          </div>
        </section>

        <section className="pb-36 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">No blog posts available yet.</p>
                <p className="text-sm mt-2">Check back soon for skincare tips and insights!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {blogs.map((post) => (
                  <article key={post.id} className="group">
                    <Link to={`/blog/${post.id}`}>
                      <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4 bg-muted">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                          </div>
                        )}
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
