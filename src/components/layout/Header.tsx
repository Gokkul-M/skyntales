import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Plus,
  Loader2,
} from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import SearchPopup from "@/components/popups/SearchPopup";
import CartPopup from "@/components/popups/CartPopup";
import WishlistPopup from "@/components/popups/WishlistPopup";
import ProfilePopup from "@/components/popups/ProfilePopup";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCollections } from "@/contexts/CollectionsContext";
import {
  collection,
  query,
  where,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: number;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const { totalItems: cartCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { getActiveCollections, loading: collectionsLoading } =
    useCollections();
  const wishlistCount = wishlistItems.length;

  const activeCollections = getActiveCollections();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("status", "==", "Active"), limit(2));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name || "",
          price: data.price || 0,
          image: data.image || product1,
          discount: data.discount,
        });
      });
      setFeaturedProducts(products);
    });

    return () => unsubscribe();
  }, []);

  const navItems = [
    { label: "Shop", href: "/shop", hasDropdown: true },
    { label: "Collections", hasDropdown: true },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const shopCategories = [
    { label: "All Products", href: "/shop" },
    ...activeCollections.slice(0, 5).map((col) => ({
      label: col.name,
      href: `/shop/${col.slug}`,
    })),
  ];

  const displayProducts =
    featuredProducts.length > 0
      ? featuredProducts
      : [
          {
            id: "1",
            name: "Hydra Drops",
            price: 8.9,
            image: product1,
            discount: 55,
          },
          {
            id: "2",
            name: "Glow Milk",
            price: 9.9,
            image: product2,
            discount: 57,
          },
        ];

  const collectionCategories = activeCollections
    .slice(0, 3)
    .map((col, idx) => ({
      label: col.name,
      href: `/shop/${col.slug}`,
      image:
        col.image && col.image !== "/placeholder.svg"
          ? col.image
          : [product1, product2, product1][idx % 3],
    }));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return (
    <header
      className={`fixed left-3 right-3 z-50 px-8 transition-all duration-500 ${
        scrolled ? "top-2" : "top-8"
      }`}
    >
      <div
        className={`h-18 rounded-[14px] flex items-center border transition-all duration-500
        ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-xl border-border/30"
            : "bg-background/95 backdrop-blur-md shadow-sm border-border/20"
        }`}
      >
        <div className="px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between relative">
            <nav className="hidden lg:flex items-center justify-center gap-8">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() =>
                    item.hasDropdown && setActiveDropdown(item.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className="flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground transition relative"
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <Plus className="h-3 w-3" strokeWidth={1.5} />
                    )}
                    <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-foreground group-hover:w-full transition-all" />
                  </Link>
                </div>
              ))}
            </nav>

            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 text-xl font-heading tracking-tight hover:opacity-70 transition"
            >
              <span className="text-foreground font-medium">Skyntales</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setProfileOpen(true)}
                className="hidden sm:flex p-2 hover:opacity-60 transition"
                data-testid="button-profile"
              >
                <User className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex p-2 hover:opacity-60 transition"
                data-testid="button-search"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={() => setWishlistOpen(true)}
                className="hidden sm:flex p-2 hover:opacity-60 transition relative"
                data-testid="button-wishlist"
              >
                <Heart className="h-[18px] w-[18px]" />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full flex items-center justify-center"
                    data-testid="badge-wishlist-count"
                  >
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 hover:opacity-60 transition relative"
                data-testid="button-cart"
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full flex items-center justify-center"
                    data-testid="badge-cart-count"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              <button
                className="lg:hidden p-2 hover:opacity-60 transition"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute top-full left-9 right-50 transition-all duration-300 ${
          activeDropdown === "Shop"
            ? "opacity-100 visible translate-y-1"
            : "opacity-0 invisible -translate-y-3 pointer-events-none"
        }`}
        onMouseEnter={() => setActiveDropdown("Shop")}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="mt-3 bg-background/90 backdrop-blur-xl rounded-2xl border border-border/30 shadow-2xl">
          <div className="px-10 py-10">
            <div className="flex gap-20">
              <div>
                <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-[0.12em] mb-4">
                  Shop
                </h3>
                {collectionsLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {shopCategories.map((cat) => (
                      <li key={cat.label}>
                        <Link
                          to={cat.href}
                          className="text-foreground/60 hover:text-foreground font-medium transition-colors text-sm"
                        >
                          {cat.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex gap-6">
                {displayProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/shop/product/${product.id}`}
                    className="group bg-secondary/30 hover:bg-secondary/60 border border-border/20 hover:border-border/40 rounded-xl p-3 w-52 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="relative">
                      {product.discount && (
                        <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-sm">
                          {product.discount}% OFF
                        </span>
                      )}
                      <div className="aspect-square rounded-xl overflow-hidden bg-background mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <h4 className="font-semibold text-foreground text-center text-sm leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-muted-foreground text-xs text-center mt-0.5">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute top-full left-9 right-50 transition-all duration-300 ${
          activeDropdown === "Collections"
            ? "opacity-100 visible translate-y-1"
            : "opacity-0 invisible -translate-y-3 pointer-events-none"
        }`}
        onMouseEnter={() => setActiveDropdown("Collections")}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="mt-3 bg-background/90 backdrop-blur-xl rounded-2xl border border-border/30 shadow-2xl">
          <div className="px-10 py-10">
            {collectionsLoading ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground py-8">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading collections...</span>
              </div>
            ) : collectionCategories.length > 0 ? (
              <div className="flex gap-6">
                {collectionCategories.map((collection, index) => (
                  <Link
                    key={index}
                    to={collection.href}
                    className="group bg-secondary/30 hover:bg-secondary/60 border border-border/20 hover:border-border/40 rounded-xl p-3 w-60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-background mb-4">
                      <img
                        src={collection.image}
                        alt={collection.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm leading-tight">
                      {collection.label}
                    </h4>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No collections available</p>
                <Link
                  to="/shop"
                  className="text-primary hover:underline text-sm mt-2 inline-block"
                >
                  Browse all products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden mt-2 animate-mobile-menu">
          <div className="bg-background rounded-2xl border border-border/20 shadow-lg">
            <nav className="py-4 px-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href || "/shop"}
                  className="text-sm text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition py-2.5 px-3 rounded-lg flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  {item.hasDropdown && <Plus className="h-3.5 w-3.5" />}
                </Link>
              ))}
              {activeCollections.length > 0 && (
                <>
                  <div className="border-t border-border/20 my-2" />
                  <span className="text-xs text-muted-foreground px-3 py-1">
                    Collections
                  </span>
                  {activeCollections.slice(0, 4).map((col) => (
                    <Link
                      key={col.id}
                      to={`/shop/${col.slug}`}
                      className="text-sm text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition py-2.5 px-3 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {col.name}
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      <SearchPopup open={searchOpen} onOpenChange={setSearchOpen} />
      <CartPopup open={cartOpen} onOpenChange={setCartOpen} />
      <WishlistPopup open={wishlistOpen} onOpenChange={setWishlistOpen} />
      <ProfilePopup open={profileOpen} onOpenChange={setProfileOpen} />
    </header>
  );
};

export default Header;
