import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  discount?: string;
  image: string;
  images?: string[];
  category: string;
  tags?: string[];
  stock: number;
  isPublished: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

const productsRef = collection(db, "products");
const categoriesRef = collection(db, "categories");

export const productService = {
  async getProducts(options?: {
    search?: string;
    category?: string;
    limit?: number;
  }): Promise<Product[]> {
    let q = query(productsRef, where("isPublished", "==", true));
    
    if (options?.category) {
      q = query(q, where("category", "==", options.category));
    }
    
    if (options?.limit) {
      q = query(q, limit(options.limit));
    }
    
    const snapshot = await getDocs(q);
    let products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    
    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.tags?.some((t) => t.toLowerCase().includes(searchLower))
      );
    }
    
    return products;
  },

  async getProductById(id: string): Promise<Product | null> {
    const docRef = doc(db, "products", id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return null;
    
    return { id: snapshot.id, ...snapshot.data() } as Product;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const q = query(productsRef, where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Product;
  },

  async createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const docRef = await addDoc(productsRef, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return { id: docRef.id, ...product } as Product;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<void> {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteProduct(id: string): Promise<void> {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  },

  async getCategories(): Promise<Category[]> {
    const snapshot = await getDocs(categoriesRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  },

  async createCategory(category: Omit<Category, "id">): Promise<Category> {
    const docRef = await addDoc(categoriesRef, category);
    return { id: docRef.id, ...category };
  },

  async searchProducts(searchTerm: string): Promise<Product[]> {
    const q = query(productsRef, where("isPublished", "==", true));
    const snapshot = await getDocs(q);
    
    const searchLower = searchTerm.toLowerCase();
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Product))
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.tags?.some((t) => t.toLowerCase().includes(searchLower))
      );
  },
};
