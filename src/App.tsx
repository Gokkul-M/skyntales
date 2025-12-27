import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Faq from "./pages/Faq";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Terms from "./pages/Terms";
import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContact from "./pages/admin/AdminContact";
import AdminAds from "./pages/admin/AdminAds";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminInstagram from "./pages/admin/AdminInstagram";
import AdminCollections from "./pages/admin/AdminCollections";
import AdminFeaturedProducts from "./pages/admin/AdminFeaturedProducts";
import CustomCursor from "./components/ui/CustomCursor";
import { CollectionsProvider } from "@/contexts/CollectionsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CollectionsProvider>
        <CartProvider>
          <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <CustomCursor />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<CategoryPage />} />
                <Route path="/shop/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/account" element={<Account />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/contact" element={<AdminContact />} />
                <Route path="/admin/collections" element={<AdminCollections />} />
                <Route path="/admin/featured" element={<AdminFeaturedProducts />} />
                <Route path="/admin/ads" element={<AdminAds />} />
                <Route path="/admin/blogs" element={<AdminBlogs />} />
                <Route path="/admin/instagram" element={<AdminInstagram />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </CollectionsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
