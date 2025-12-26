import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "admin";
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt?: any;
  updatedAt?: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  isAdmin: boolean;
  googleAuthEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN_EMAIL = "admin@kanva.com";
const DEMO_ADMIN_UID = "demo-admin-uid";

async function checkAdminRole(uid: string, email: string | null): Promise<boolean> {
  if (email === DEMO_ADMIN_EMAIL) {
    return true;
  }
  
  try {
    const adminDocRef = doc(db, "adminUsers", uid);
    const adminDoc = await getDoc(adminDocRef);
    return adminDoc.exists() && adminDoc.data()?.isAdmin === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

async function createOrUpdateUserProfile(firebaseUser: User): Promise<UserProfile> {
  const userDocRef = doc(db, "users", firebaseUser.uid);
  
  try {
    const userDoc = await getDoc(userDocRef);
    const isAdminUser = await checkAdminRole(firebaseUser.uid, firebaseUser.email);
    
    if (userDoc.exists()) {
      const existingProfile = userDoc.data() as UserProfile;
      const needsUpdate = existingProfile.role !== (isAdminUser ? "admin" : "user") ||
        existingProfile.displayName !== firebaseUser.displayName ||
        existingProfile.photoURL !== firebaseUser.photoURL;
        
      if (needsUpdate) {
        const updatedProfile = {
          ...existingProfile,
          displayName: firebaseUser.displayName || existingProfile.displayName,
          photoURL: firebaseUser.photoURL || existingProfile.photoURL,
          role: isAdminUser ? "admin" : "user",
          updatedAt: serverTimestamp(),
        };
        await setDoc(userDocRef, updatedProfile, { merge: true });
        return updatedProfile as UserProfile;
      }
      return existingProfile;
    } else {
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: isAdminUser ? "admin" : "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(userDocRef, newProfile);
      
      if (isAdminUser) {
        const adminDocRef = doc(db, "adminUsers", firebaseUser.uid);
        await setDoc(adminDocRef, { isAdmin: true, email: firebaseUser.email }, { merge: true });
      }
      
      return newProfile;
    }
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role: "user",
    };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [googleAuthEnabled, setGoogleAuthEnabled] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const profile = await createOrUpdateUserProfile(firebaseUser);
          setUserProfile(profile);
          setIsAdmin(profile.role === "admin");
        } catch (error) {
          console.error("Error loading user profile:", error);
          setUserProfile(null);
          setIsAdmin(false);
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await firebaseUpdateProfile(userCredential.user, { displayName });
      
      const isAdminUser = email === DEMO_ADMIN_EMAIL;
      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, {
        uid: userCredential.user.uid,
        email,
        displayName,
        photoURL: null,
        role: isAdminUser ? "admin" : "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      if (isAdminUser) {
        const adminDocRef = doc(db, "adminUsers", userCredential.user.uid);
        await setDoc(adminDocRef, { isAdmin: true, email });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createOrUpdateUserProfile(result.user);
    } catch (error: any) {
      console.error("Google sign in error:", error);
      if (error.code === "auth/configuration-not-found" || 
          error.code === "auth/operation-not-allowed") {
        setGoogleAuthEnabled(false);
        throw new Error("Google Sign-In is not enabled. Please use email/password to sign in, or enable Google Sign-In in your Firebase Console.");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setIsAdmin(false);
    } catch (error: any) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("No user logged in");
    
    try {
      if (data.displayName) {
        await firebaseUpdateProfile(user, { displayName: data.displayName });
      }
      
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      
      setUserProfile((prev) => prev ? { ...prev, ...data } : null);
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    if (!user) throw new Error("No user logged in");
    
    try {
      await updatePassword(user, newPassword);
    } catch (error: any) {
      console.error("Update password error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
    updateProfile,
    updateUserPassword,
    isAdmin,
    googleAuthEnabled,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
