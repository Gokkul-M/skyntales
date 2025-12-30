import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Advertisement {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
}

const AdvertisementPopup = () => {
  const [open, setOpen] = useState(false);
  const [ad, setAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    const fetchActiveAd = async () => {
      try {
        const adsRef = collection(db, "advertisements");
        const q = query(adsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        
        let activeAd: Advertisement | null = null;
        snapshot.forEach((doc) => {
          if (!activeAd) {
            const data = doc.data();
            if (data.isActive === true) {
              activeAd = {
                id: doc.id,
                title: data.title || "",
                description: data.description || "",
                image: data.image || "",
                buttonText: data.buttonText || "Shop Now",
                buttonLink: data.buttonLink || "/shop",
                isActive: true,
              };
            }
          }
        });
        
        if (activeAd) {
          setAd(activeAd);
          setTimeout(() => setOpen(true), 1500);
        }
      } catch (error) {
        console.error("Error fetching advertisement:", error);
      }
    };

    fetchActiveAd();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  if (!ad) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl p-0 overflow-hidden border-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-background via-background to-secondary/30 shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>{ad.title}</DialogTitle>
        </VisuallyHidden>
        
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 z-20 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl rounded-full h-8 w-8 sm:h-10 sm:w-10 transition-all duration-300 hover:rotate-90"
                onClick={handleClose}
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </Button>
              
              <div className="relative">
                {ad.image && (
                  <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                    <motion.img
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm text-primary-foreground px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg"
                      >
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Special Offer</span>
                      </motion.div>
                    </div>
                  </div>
                )}
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="p-4 sm:p-6 md:p-8 text-center space-y-3 sm:space-y-4"
                >
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-semibold text-foreground leading-tight">
                    {ad.title}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
                    {ad.description}
                  </p>
                  <div className="pt-2 sm:pt-4">
                    <Button 
                      asChild 
                      size="lg"
                      className="w-full sm:w-auto min-w-[200px] rounded-full text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                      onClick={handleClose}
                    >
                      <Link to={ad.buttonLink}>
                        {ad.buttonText}
                      </Link>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground/60 pt-2">
                    Click anywhere outside to close
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AdvertisementPopup;
