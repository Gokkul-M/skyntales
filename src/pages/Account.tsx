import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Package, Heart, MapPin, Settings, Shield, Loader2, Trash2, ChevronRight, LogOut, ShoppingBag, Lock } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import OrderDetailsPopup from "@/components/popups/OrderDetailsPopup";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  createdAt: any;
  items: any[];
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentDetails?: {
    paymentId: string;
    orderId: string;
    status: string;
  };
  awbCode?: string;
}

type PageView = "overview" | "orders" | "wishlist" | "addresses" | "settings";

const Account = () => {
  const { user, userProfile, loading, signIn, signUp, signInWithGoogle, resetPassword, isAdmin, updateProfile, updateUserPassword, googleAuthEnabled, logout } = useAuth();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    displayName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false);

  const currentPage = (searchParams.get("view") as PageView) || "overview";

  const setCurrentPage = (page: PageView) => {
    setSearchParams({ view: page });
  };

  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        displayName: userProfile.displayName || "",
        phone: userProfile.phone || "",
        street: userProfile.address?.street || "",
        city: userProfile.address?.city || "",
        state: userProfile.address?.state || "",
        zipCode: userProfile.address?.zipCode || "",
        country: userProfile.address?.country || "",
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (!user) return;
    setLoadingOrders(true);
    
    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("userId", "==", user.uid));
      
      // Use onSnapshot for real-time updates
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        // Sort client-side to avoid composite index requirement
        fetchedOrders.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        setOrders(fetchedOrders);
        setLoadingOrders(false);
      }, (error) => {
        console.error("Error fetching orders:", error);
        setLoadingOrders(false);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up orders listener:", error);
      setLoadingOrders(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
        toast({ title: "Account created successfully!" });
      } else {
        await signIn(email, password);
        toast({ title: "Signed in successfully!" });
      }
    } catch (error: any) {
      let message = error.message || "Something went wrong";
      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered. Please sign in instead.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-credential") {
        message = "Invalid email or password.";
      }
      toast({ 
        title: "Error", 
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!googleAuthEnabled) {
      toast({ 
        title: "Google Sign-In Not Available", 
        description: "Please use email/password to sign in. Google Sign-In needs to be enabled in Firebase Console.",
        variant: "destructive"
      });
      return;
    }
    try {
      await signInWithGoogle();
      toast({ title: "Signed in successfully!" });
    } catch (error: any) {
      toast({ 
        title: "Google Sign-In Error", 
        description: error.message || "Could not sign in with Google. Please use email/password instead.",
        variant: "destructive"
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: "Please enter your email address", variant: "destructive" });
      return;
    }
    try {
      await resetPassword(email);
      toast({ title: "Password reset email sent!" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateProfile({
        displayName: profileForm.displayName,
        phone: profileForm.phone,
        address: {
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          zipCode: profileForm.zipCode,
          country: profileForm.country,
        }
      });
      toast({ title: "Profile updated successfully!" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    try {
      await updateUserPassword(newPassword);
      setNewPassword("");
      toast({ title: "Password changed successfully!" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Signed out successfully!" });
      navigate("/");
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAddToCart = async (item: typeof wishlistItems[0]) => {
    try {
      await addToCart({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        discount: item.discount,
      });
      toast({ title: "Added to cart!" });
    } catch (error) {
      toast({ title: "Failed to add to cart", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "shipped": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "processing": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Header />
        <main className="container-kanva py-24">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl font-heading" data-testid="text-auth-title">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </CardTitle>
                <CardDescription className="text-base">
                  {isSignUp 
                    ? "Join Skyntales for exclusive offers and easy checkout" 
                    : "Sign in to access your account"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Full Name</Label>
                      <Input
                        id="displayName"
                        type="text"
                        placeholder="Jane Doe"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required={isSignUp}
                        className="h-11"
                        data-testid="input-name"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11"
                      data-testid="input-password"
                    />
                  </div>
                  
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="button-forgot-password"
                    >
                      Forgot password?
                    </button>
                  )}
                  
                  <Button type="submit" className="w-full h-11" disabled={isSubmitting} data-testid="button-submit">
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isSignUp ? (
                      "Create Account"
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full h-11" 
                  onClick={handleGoogleSignIn}
                  disabled={!googleAuthEnabled}
                  data-testid="button-google"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {googleAuthEnabled ? "Google" : "Google (Not Configured)"}
                </Button>
                {!googleAuthEnabled && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Enable Google Sign-In in Firebase Console to use this option
                  </p>
                )}
                
                <p className="text-center text-sm text-muted-foreground mt-6">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-foreground hover:underline font-medium"
                    data-testid="button-toggle-auth"
                  >
                    {isSignUp ? "Sign In" : "Create Account"}
                  </button>
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const menuItems = [
    { id: "overview" as PageView, label: "Overview", icon: User },
    { id: "orders" as PageView, label: "My Orders", icon: Package },
    { id: "wishlist" as PageView, label: "Wishlist", icon: Heart, count: wishlistItems.length },
    { id: "addresses" as PageView, label: "Addresses", icon: MapPin },
    { id: "settings" as PageView, label: "Settings", icon: Settings },
  ];

  return (
    <div>
      <Header />
      <main className="container-kanva py-20 sm:py-24 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <aside className="lg:w-72 flex-shrink-0">
              <Card className="sticky top-28">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.photoURL || ""} alt={userProfile?.displayName || ""} />
                      <AvatarFallback className="bg-secondary text-xl">
                        {userProfile?.displayName?.split(" ").map(n => n[0]).join("") || user.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-lg truncate" data-testid="text-user-name">
                        {userProfile?.displayName || "User"}
                      </h2>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  {isAdmin && (
                    <Link 
                      to="/admin/dashboard" 
                      className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      data-testid="link-admin-dashboard"
                    >
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Admin Dashboard</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  )}

                  <nav className="space-y-1">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                          currentPage === item.id
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        }`}
                        data-testid={`nav-${item.id}`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.count !== undefined && item.count > 0 && (
                          <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>

                  <div className="mt-6 pt-6 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                      onClick={handleLogout}
                      data-testid="button-logout"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>

            <div className="flex-1 min-w-0">
              {currentPage === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-heading mb-2" data-testid="text-page-title">Welcome back, {userProfile?.displayName?.split(" ")[0] || "there"}!</h1>
                    <p className="text-muted-foreground">Here's an overview of your account activity.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="hover-elevate cursor-pointer" onClick={() => setCurrentPage("orders")}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{orders.length}</p>
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="hover-elevate cursor-pointer" onClick={() => setCurrentPage("wishlist")}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                            <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{wishlistItems.length}</p>
                            <p className="text-sm text-muted-foreground">Wishlist Items</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="hover-elevate cursor-pointer" onClick={() => setCurrentPage("addresses")}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{profileForm.street ? "1" : "0"}</p>
                            <p className="text-sm text-muted-foreground">Saved Addresses</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {orders.length > 0 && (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">Recent Orders</CardTitle>
                          <CardDescription>Your latest purchases</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentPage("orders")}>
                          View All
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {orders.slice(0, 3).map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                              <div>
                                <p className="font-medium">Order #{order.orderNumber}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.createdAt?.toDate?.()?.toLocaleDateString() || "Recent"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">₹{order.total.toFixed(2)}</p>
                                <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {wishlistItems.length > 0 && (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">Wishlist</CardTitle>
                          <CardDescription>Products you've saved</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentPage("wishlist")}>
                          View All
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {wishlistItems.slice(0, 4).map((item) => (
                            <Link 
                              key={item.id} 
                              to={`/shop/product/${item.productId}`}
                              className="group"
                            >
                              <div className="aspect-square rounded-xl overflow-hidden bg-secondary mb-2">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {currentPage === "orders" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-heading mb-2" data-testid="text-orders-title">My Orders</h1>
                    <p className="text-muted-foreground">View and track all your orders.</p>
                  </div>

                  {loadingOrders ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <Card>
                      <CardContent className="py-16 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                          <Package className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
                        <Button asChild data-testid="button-start-shopping">
                          <Link to="/shop">Start Shopping</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card 
                          key={order.id} 
                          data-testid={`order-${order.id}`}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsOrderPopupOpen(true);
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Placed on {order.createdAt?.toDate?.()?.toLocaleDateString("en-US", { 
                                    year: "numeric", month: "long", day: "numeric" 
                                  }) || "Recently"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold">₹{order.total.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">{order.items?.length || 0} items</p>
                              </div>
                            </div>
                            {order.items && order.items.length > 0 && (
                              <div className="flex gap-2 overflow-x-auto py-2">
                                {order.items.slice(0, 4).map((item, idx) => (
                                  <div key={idx} className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                                {order.items.length > 4 && (
                                  <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-secondary flex items-center justify-center text-sm text-muted-foreground">
                                    +{order.items.length - 4}
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="mt-3 text-sm text-primary flex items-center gap-1">
                              View Details <ChevronRight className="h-4 w-4" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentPage === "wishlist" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-heading mb-2" data-testid="text-wishlist-title">My Wishlist</h1>
                    <p className="text-muted-foreground">Products you've saved for later.</p>
                  </div>

                  {wishlistItems.length === 0 ? (
                    <Card>
                      <CardContent className="py-16 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                          <Heart className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                        <p className="text-muted-foreground mb-6">Start adding your favorite products!</p>
                        <Button asChild data-testid="button-browse-products">
                          <Link to="/shop">Browse Products</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden" data-testid={`wishlist-item-${item.productId}`}>
                          <CardContent className="p-0">
                            <div className="flex">
                              <Link to={`/shop/product/${item.productId}`} className="w-32 h-32 flex-shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </Link>
                              <div className="flex-1 p-4 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <Link 
                                      to={`/shop/product/${item.productId}`}
                                      className="font-medium hover:underline"
                                    >
                                      {item.name}
                                    </Link>
                                    <p className="text-lg font-semibold mt-1">₹{item.price.toFixed(2)}</p>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => removeFromWishlist(item.id)}
                                    data-testid={`button-remove-wishlist-${item.productId}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="mt-auto">
                                  <Button 
                                    size="sm" 
                                    className="gap-2"
                                    onClick={() => handleAddToCart(item)}
                                    data-testid={`button-add-to-cart-${item.productId}`}
                                  >
                                    <ShoppingBag className="h-4 w-4" />
                                    Add to Cart
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentPage === "addresses" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-heading mb-2" data-testid="text-addresses-title">Shipping Address</h1>
                    <p className="text-muted-foreground">Manage your shipping address for faster checkout.</p>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input 
                            id="street"
                            value={profileForm.street}
                            onChange={(e) => setProfileForm({...profileForm, street: e.target.value})}
                            placeholder="123 Main Street"
                            className="h-11"
                            data-testid="input-street"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city"
                            value={profileForm.city}
                            onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                            placeholder="City"
                            className="h-11"
                            data-testid="input-city"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State/Province</Label>
                          <Input 
                            id="state"
                            value={profileForm.state}
                            onChange={(e) => setProfileForm({...profileForm, state: e.target.value})}
                            placeholder="State"
                            className="h-11"
                            data-testid="input-state"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                          <Input 
                            id="zipCode"
                            value={profileForm.zipCode}
                            onChange={(e) => setProfileForm({...profileForm, zipCode: e.target.value})}
                            placeholder="12345"
                            className="h-11"
                            data-testid="input-zip"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="country">Country</Label>
                          <Input 
                            id="country"
                            value={profileForm.country}
                            onChange={(e) => setProfileForm({...profileForm, country: e.target.value})}
                            placeholder="Country"
                            className="h-11"
                            data-testid="input-country"
                          />
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button onClick={handleSaveProfile} disabled={savingProfile} data-testid="button-save-address">
                          {savingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Save Address
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentPage === "settings" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-heading mb-2" data-testid="text-settings-title">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your profile and security settings.</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input 
                            id="displayName"
                            value={profileForm.displayName}
                            onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})}
                            placeholder="Your name"
                            className="h-11"
                            data-testid="input-display-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                            placeholder="+1 (555) 000-0000"
                            className="h-11"
                            data-testid="input-phone"
                          />
                        </div>
                      </div>
                      <Button onClick={handleSaveProfile} disabled={savingProfile} data-testid="button-save-profile">
                        {savingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Security
                      </CardTitle>
                      <CardDescription>Change your password</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="max-w-md space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="h-11"
                          data-testid="input-new-password"
                        />
                        <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                      </div>
                      <Button onClick={handleChangePassword} disabled={!newPassword} data-testid="button-change-password">
                        Change Password
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      <OrderDetailsPopup
        order={selectedOrder}
        isOpen={isOrderPopupOpen}
        onClose={() => {
          setIsOrderPopupOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default Account;
