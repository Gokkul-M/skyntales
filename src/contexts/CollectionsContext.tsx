import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
  createdAt?: any;
}

interface CollectionsContextType {
  collections: Collection[];
  loading: boolean;
  addCollection: (data: Omit<Collection, "id" | "createdAt">) => Promise<void>;
  updateCollection: (id: string, data: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  getActiveCollections: () => Collection[];
}

const CollectionsContext = createContext<CollectionsContextType | null>(null);

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return context;
};

export const CollectionsProvider = ({ children }: { children: ReactNode }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collectionsRef = collection(db, "collections");
    const q = query(collectionsRef, orderBy("order", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collectionsData: Collection[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        collectionsData.push({
          id: doc.id,
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          image: data.image || "",
          isActive: data.isActive !== false,
          order: data.order || 0,
          createdAt: data.createdAt,
        });
      });
      setCollections(collectionsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching collections:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addCollection = async (data: Omit<Collection, "id" | "createdAt">) => {
    await addDoc(collection(db, "collections"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  };

  const updateCollection = async (id: string, data: Partial<Collection>) => {
    const collectionRef = doc(db, "collections", id);
    await updateDoc(collectionRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteCollection = async (id: string) => {
    const collectionRef = doc(db, "collections", id);
    await deleteDoc(collectionRef);
  };

  const getActiveCollections = () => {
    return collections.filter(c => c.isActive);
  };

  return (
    <CollectionsContext.Provider value={{
      collections,
      loading,
      addCollection,
      updateCollection,
      deleteCollection,
      getActiveCollections,
    }}>
      {children}
    </CollectionsContext.Provider>
  );
};
