import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface InstagramPost {
  id: string;
  embedCode: string;
  order: number;
}

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const InstagramSection = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const postsRef = collection(db, "instagramPosts");
    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      const postsData: InstagramPost[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        postsData.push({ 
          id: doc.id, 
          embedCode: data.embedCode || "",
          order: data.order || 0
        });
      });
      postsData.sort((a, b) => a.order - b.order);
      setPosts(postsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching Instagram posts:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      } else if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
      
      const timer = setTimeout(() => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [posts]);

  if (isLoading) {
    return null;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="section-padding-sm bg-background overflow-hidden py-12 md:py-16">
      <div className="text-center mb-8 sm:mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading inline-flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          Follow On
          <span className="italic">Instagram</span>
        </h2>
      </div>

      <div className="container-kanva">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center">
          {posts.map((post) => (
            <div
              key={post.id}
              className="w-full max-w-[326px] instagram-embed-container"
              dangerouslySetInnerHTML={{ __html: post.embedCode }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
