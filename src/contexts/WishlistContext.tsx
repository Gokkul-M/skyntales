import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

export interface WishlistItem {
  id: string;
  productId: string | number;
  name: string;
  price: number;
  image: string;
  discount?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  addToWishlist: (product: Omit<WishlistItem, "id">) => Promise<void>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  isInWishlist: (productId: string | number) => boolean;
  toggleWishlist: (product: Omit<WishlistItem, "id">) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "kanva_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const wishlistRef = collection(db, "wishlists", user.uid, "items");
      const unsubscribe = onSnapshot(
        wishlistRef, 
        (snapshot) => {
          const wishlistItems: WishlistItem[] = [];
          snapshot.forEach((doc) => {
            wishlistItems.push({ id: doc.id, ...doc.data() } as WishlistItem);
          });
          setItems(wishlistItems);
          setLoading(false);
        },
        (error) => {
          console.error("Error listening to wishlist:", error);
          setLoading(false);
        }
      );

      const localWishlist = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localWishlist) {
        try {
          const localItems: WishlistItem[] = JSON.parse(localWishlist);
          Promise.all(
            localItems.map(async (item) => {
              try {
                const itemRef = doc(db, "wishlists", user.uid, "items", `product_${item.productId}`);
                await setDoc(itemRef, {
                  productId: item.productId,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  discount: item.discount || null,
                  createdAt: serverTimestamp(),
                });
              } catch (error) {
                console.error("Error syncing wishlist item:", error);
              }
            })
          ).then(() => {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          });
        } catch (error) {
          console.error("Error parsing local wishlist:", error);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }

      return () => unsubscribe();
    } else {
      try {
        const localWishlist = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localWishlist) {
          setItems(JSON.parse(localWishlist));
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error loading local wishlist:", error);
        setItems([]);
      }
      setLoading(false);
    }
  }, [user]);

  const saveToLocalStorage = (wishlistItems: WishlistItem[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const addToWishlist = async (product: Omit<WishlistItem, "id">) => {
    try {
      if (user) {
        const itemRef = doc(db, "wishlists", user.uid, "items", `product_${product.productId}`);
        await setDoc(itemRef, {
          productId: product.productId,
          name: product.name,
          price: product.price,
          image: product.image,
          discount: product.discount || null,
          createdAt: serverTimestamp(),
        });
      } else {
        const newItems = [...items, { ...product, id: `local_${product.productId}` }];
        setItems(newItems);
        saveToLocalStorage(newItems);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      if (user) {
        const itemRef = doc(db, "wishlists", user.uid, "items", itemId);
        await deleteDoc(itemRef);
      } else {
        const newItems = items.filter((i) => i.id !== itemId);
        setItems(newItems);
        saveToLocalStorage(newItems);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  };

  const isInWishlist = (productId: string | number) => {
    return items.some((item) => String(item.productId) === String(productId));
  };

  const toggleWishlist = async (product: Omit<WishlistItem, "id">) => {
    try {
      const existingItem = items.find((i) => String(i.productId) === String(product.productId));
      if (existingItem) {
        await removeFromWishlist(existingItem.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      throw error;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
