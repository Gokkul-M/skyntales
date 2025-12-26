import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "admin";
  phone?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Address {
  id: string;
  label?: string;
  recipientName: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

const usersRef = collection(db, "users");

export const userService = {
  async getAllUsers(): Promise<UserProfile[]> {
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as UserProfile[];
  },

  async getUserById(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, "users", uid);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return null;
    
    return { uid: snapshot.id, ...snapshot.data() } as UserProfile;
  },

  async updateUser(uid: string, data: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async setUserRole(uid: string, role: "user" | "admin"): Promise<void> {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      role,
      updatedAt: serverTimestamp(),
    });
  },

  async getAddresses(userId: string): Promise<Address[]> {
    const addressesRef = collection(db, "users", userId, "addresses");
    const snapshot = await getDocs(addressesRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Address[];
  },

  async addAddress(userId: string, address: Omit<Address, "id">): Promise<Address> {
    const addressesRef = collection(db, "users", userId, "addresses");
    const docRef = await addDoc(addressesRef, {
      ...address,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...address };
  },

  async updateAddress(userId: string, addressId: string, data: Partial<Address>): Promise<void> {
    const docRef = doc(db, "users", userId, "addresses", addressId);
    await updateDoc(docRef, data);
  },

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const docRef = doc(db, "users", userId, "addresses", addressId);
    await deleteDoc(docRef);
  },
};
