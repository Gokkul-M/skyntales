import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Facebook, Instagram, ArrowLeft, Loader2 } from "lucide-react";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  image: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: any;
}

interface RelatedPost {
  id: string;
  title: string;
  category: string;
  image: string;
}

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const blogPost: BlogPost = {
            id: docSnap.id,
            title: data.title || "",
            category: data.category || "",
            image: data.image || "",
            content: data.content || "",
            excerpt: data.excerpt || "",
            author: data.author || "Team Skyntales",
            createdAt: data.createdAt,
          };
          setPost(blogPost);

          const relatedQuery = query(
            collection(db, "blogs"),
            orderBy("createdAt", "desc"),
            limit(10),
          );
          const relatedSnap = await getDocs(relatedQuery);
          const related: RelatedPost[] = [];
          relatedSnap.forEach((doc) => {
            const data = doc.data();
            if (
              doc.id !== id &&
              data.status === "published" &&
              data.category === blogPost.category
            ) {
              related.push({
                id: doc.id,
                title: data.title || "",
                category: data.category || "",
                image: data.image || "",
              });
            }
          });
          setRelatedPosts(related.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container-kanva flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container-kanva text-center">
            <h1 className="text-3xl font-heading mb-4">Blog post not found</h1>
            <Link to="/blog" className="text-primary underline">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="pt-28 pb-8">
          <div className="container-kanva max-w-4xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <p className="text-sm text-muted-foreground italic mb-4">
              {post.category}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading italic leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>

            {post.image && (
              <div className="rounded-2xl overflow-hidden mb-10">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <article className="prose prose-lg max-w-none">
              {post.content.split("\n").map(
                (paragraph, index) =>
                  paragraph.trim() && (
                    <p
                      key={index}
                      className="mb-4 text-foreground/90 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ),
              )}
            </article>

            <div className="flex items-center gap-4 mt-12 pt-8 border-t">
              <span className="text-sm text-muted-foreground">Share:</span>
              <a
                href="#"
                className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="py-16 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-heading italic mb-8">
                Related Articles
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {relatedPosts.map((related) => (
                  <article key={related.id} className="group">
                    <Link to={`/blog/${related.id}`}>
                      <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4 bg-muted">
                        {related.image ? (
                          <img
                            src={related.image}
                            alt={related.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground italic mb-2">
                        {related.category}
                      </p>
                      <h3 className="font-heading text-lg italic mb-3 leading-snug">
                        {related.title}
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
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
