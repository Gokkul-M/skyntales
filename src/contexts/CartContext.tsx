import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string;
  productId: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  discount?: string;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Omit<CartItem, "id" | "quantity">, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "kanva_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const cartRef = collection(db, "carts", user.uid, "items");
      const unsubscribe = onSnapshot(
        cartRef, 
        (snapshot) => {
          const cartItems: CartItem[] = [];
          snapshot.forEach((doc) => {
            cartItems.push({ id: doc.id, ...doc.data() } as CartItem);
          });
          setItems(cartItems);
          setLoading(false);
        },
        (error) => {
          console.error("Error listening to cart:", error);
          setLoading(false);
        }
      );

      const localCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localCart) {
        try {
          const localItems: CartItem[] = JSON.parse(localCart);
          Promise.all(
            localItems.map(async (item) => {
              try {
                const itemRef = doc(db, "carts", user.uid, "items", `product_${item.productId}`);
                await setDoc(itemRef, {
                  productId: item.productId,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: item.quantity,
                  discount: item.discount || null,
                  updatedAt: serverTimestamp(),
                }, { merge: true });
              } catch (error) {
                console.error("Error syncing cart item:", error);
              }
            })
          ).then(() => {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          });
        } catch (error) {
          console.error("Error parsing local cart:", error);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }

      return () => unsubscribe();
    } else {
      try {
        const localCart = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localCart) {
          setItems(JSON.parse(localCart));
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error loading local cart:", error);
        setItems([]);
      }
      setLoading(false);
    }
  }, [user]);

  const saveToLocalStorage = (cartItems: CartItem[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const addToCart = async (product: Omit<CartItem, "id" | "quantity">, quantity = 1) => {
    try {
      if (user) {
        const itemRef = doc(db, "carts", user.uid, "items", `product_${product.productId}`);
        const existingItem = items.find((i) => i.productId === product.productId);
        
        await setDoc(itemRef, {
          productId: product.productId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: (existingItem?.quantity || 0) + quantity,
          discount: product.discount || null,
          updatedAt: serverTimestamp(),
        });
      } else {
        const existingIndex = items.findIndex((i) => i.productId === product.productId);
        let newItems: CartItem[];
        
        if (existingIndex >= 0) {
          newItems = [...items];
          newItems[existingIndex].quantity += quantity;
        } else {
          newItems = [...items, { ...product, id: `local_${product.productId}`, quantity }];
        }
        
        setItems(newItems);
        saveToLocalStorage(newItems);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (user) {
        const itemRef = doc(db, "carts", user.uid, "items", itemId);
        await deleteDoc(itemRef);
      } else {
        const newItems = items.filter((i) => i.id !== itemId);
        setItems(newItems);
        saveToLocalStorage(newItems);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      if (user) {
        const itemRef = doc(db, "carts", user.uid, "items", itemId);
        await updateDoc(itemRef, { quantity, updatedAt: serverTimestamp() });
      } else {
        const newItems = items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        );
        setItems(newItems);
        saveToLocalStorage(newItems);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        const cartRef = collection(db, "carts", user.uid, "items");
        const snapshot = await getDocs(cartRef);
        const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
      } else {
        setItems([]);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
