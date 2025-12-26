import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CartItem } from "@/contexts/CartContext";

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  recipientName: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  createdAt?: any;
  updatedAt?: any;
}

const ordersRef = collection(db, "orders");

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KNV-${timestamp}-${random}`;
}

export const orderService = {
  async createOrder(
    userId: string,
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
    billingAddress?: ShippingAddress
  ): Promise<Order> {
    const items: OrderItem[] = cartItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const orderData = {
      userId,
      orderNumber: generateOrderNumber(),
      items,
      subtotal,
      shipping,
      tax,
      total,
      status: "pending" as const,
      paymentStatus: "pending" as const,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(ordersRef, orderData);
    return { id: docRef.id, ...orderData };
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const docRef = doc(db, "orders", orderId);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return null;
    
    return { id: snapshot.id, ...snapshot.data() } as Order;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const q = query(ordersRef, where("orderNumber", "==", orderNumber));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Order;
  },

  async getAllOrders(): Promise<Order[]> {
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  },

  async updateOrderStatus(
    orderId: string,
    status: Order["status"]
  ): Promise<void> {
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  },

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: Order["paymentStatus"]
  ): Promise<void> {
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, {
      paymentStatus,
      updatedAt: serverTimestamp(),
    });
  },
};
