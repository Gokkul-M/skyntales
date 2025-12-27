import { useEffect, useRef, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import skinCloseup from "@/assets/skin-closeup.jpg";

interface InstagramPost {
  id: string;
  imageUrl: string;
  postUrl: string;
  order: number;
}

const InstagramSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [posts, setPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    const q = query(collection(db, "instagramPosts"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: InstagramPost[] = [];
      snapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as InstagramPost);
      });
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && el) {
          el.classList.add("animate-instagram-reveal");
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (posts.length === 0) {
    return null;
  }

  const displayPosts = [...posts, ...posts];

  return (
    <section
      ref={sectionRef}
      className="section-padding-sm bg-background overflow-hidden opacity-0"
    >
      <div className="text-center mb-8 sm:mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-h1 font-heading 
        inline-flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          Follow On
          <span className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
          rounded-xl overflow-hidden inline-block shadow-kanva-md">
            <img
              src={posts[0]?.imageUrl || skinCloseup}
              alt="Instagram"
              className="w-full h-full object-cover"
            />
          </span>
          <span className="italic">Instagram</span>
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="instagram-marquee flex">
          {displayPosts.map((post, index) => (
            <a
              key={`${post.id}-${index}`}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex-shrink-0 
              w-40 h-56 sm:w-52 sm:h-72 md:w-64 md:h-80 
              mx-2 sm:mx-3 overflow-hidden rounded-2xl shadow-xl"
            >
              <img
                src={post.imageUrl}
                alt={`Instagram ${index + 1}`}
                className="w-full h-full object-cover 
                transition-transform duration-700 group-hover:scale-110"
              />

              <div
                className="absolute inset-0 bg-black/10 opacity-0 
                group-hover:opacity-100 transition-opacity flex 
                items-center justify-center"
              >
                <span
                  className="text-white text-xs sm:text-sm font-medium 
                  bg-black/50 px-4 py-2 rounded-full backdrop-blur"
                >
                  View Post
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
