import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link } from "react-router-dom";

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
        const q = query(
          adsRef,
          where("isActive", "==", true),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();
          setAd({
            id: doc.id,
            title: data.title || "",
            description: data.description || "",
            image: data.image || "",
            buttonText: data.buttonText || "Shop Now",
            buttonLink: data.buttonLink || "/shop",
            isActive: data.isActive || false,
          });
          
          setTimeout(() => setOpen(true), 1000);
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
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 bg-white/80 hover:bg-white rounded-full"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {ad.image && (
          <div className="aspect-[4/3] w-full">
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 text-center">
          <h2 className="text-2xl font-heading font-semibold mb-2">{ad.title}</h2>
          <p className="text-muted-foreground mb-6">{ad.description}</p>
          <Button asChild className="w-full" onClick={handleClose}>
            <Link to={ad.buttonLink}>{ad.buttonText}</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvertisementPopup;
