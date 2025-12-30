import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, ChevronDown, SlidersHorizontal, ArrowDown, X, Plus, Minus, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCollections } from "@/contexts/CollectionsContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  status: string;
  stock: number;
  discount?: number;
  size?: string;
  sizes?: string[];
  tags?: string[];
}

interface ProductSelection {
  [productId: string]: {
    size: string | null;
    quantity: number;
  };
}

const filterSizes = ["50ml", "100ml", "150ml", "250ml"];
const filterPrices = ["Under 500", "500 - 1000", "Over 1000"];
const sortOptions = ["Relevance", "Price: Low to High", "Price: High to Low", "Name: A-Z", "Name: Z-A"];
const filterDiscounts = ["10% - 20%", "20% - 50%"];

const CategoryPage = () => {
  const { toast } = useToast();
  const { category } = useParams<{ category: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { collections, loading: collectionsLoading } = useCollections();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Relevance");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [productSelections, setProductSelections] = useState<ProductSelection>({});

  const categoryInfo = useMemo(() => {
    if (!category) return null;
    const matchedCollection = collections.find(
      c => c.slug === category.toLowerCase() || c.name.toLowerCase() === category.toLowerCase()
    );
    if (matchedCollection) {
      return {
        title: matchedCollection.name,
        description: matchedCollection.description || `Explore our ${matchedCollection.name} collection`,
        heroImage: matchedCollection.image && matchedCollection.image !== "/placeholder.svg" 
          ? matchedCollection.image 
          : product1,
        categoryName: matchedCollection.name,
      };
    }
    return null;
  }, [category, collections]);

  useEffect(() => {
    if (!categoryInfo?.categoryName) {
      setLoading(false);
      return;
    }

    const productsRef = collection(db, "products");
    const q = query(
      productsRef, 
      where("status", "==", "Active"),
      where("category", "==", categoryInfo.categoryName)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        productsData.push({
          id: doc.id,
          name: data.name || "",
          price: data.price || 0,
          image: data.image || data.images?.[0] || "/placeholder.svg",
          images: data.images || [],
          category: data.category || "",
          status: data.status || "Active",
          stock: data.stock || 0,
          discount: data.discount,
          size: data.size,
          sizes: data.sizes || (data.size ? [data.size] : ["50ml", "100ml"]),
          tags: data.tags || [],
        });
      });
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching category products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryInfo?.categoryName]);

  const getProductSelection = (productId: string) => {
    return productSelections[productId] || { size: null, quantity: 1 };
  };

  const setProductSize = (productId: string, size: string) => {
    setProductSelections(prev => ({
      ...prev,
      [productId]: { ...getProductSelection(productId), size }
    }));
  };

  const setProductQuantity = (productId: string, quantity: number) => {
    setProductSelections(prev => ({
      ...prev,
      [productId]: { ...getProductSelection(productId), quantity: Math.max(1, quantity) }
    }));
  };

  const handleAddToCart = async (product: Product) => {
    const selection = getProductSelection(product.id);
    if (!selection.size) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    try {
      await addToCart({
        productId: product.id,
        name: `${product.name} (${selection.size})`,
        price: product.price,
        image: product.image,
        discount: product.discount ? `${product.discount}% OFF` : undefined,
      }, selection.quantity);
      toast({
        title: "Added to cart",
        description: `${product.name} (${selection.size}) x${selection.quantity}`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        discount: product.discount ? `${product.discount}% OFF` : undefined,
      });
      if (isInWishlist(product.id)) {
        toast({ title: "Removed from wishlist" });
      } else {
        toast({ title: "Added to wishlist!" });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({ title: "Failed to update wishlist", variant: "destructive" });
    }
  };

  const totalCategoryProducts = products.length;
  
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => {
      if (selectedTags.length > 0 && p.tags && !selectedTags.some(tag => p.tags?.includes(tag))) return false;
      if (selectedSizes.length > 0 && p.size && !selectedSizes.includes(p.size)) return false;
      
      if (selectedPrices.length > 0) {
        const matchesPrice = selectedPrices.some(priceRange => {
          if (priceRange === "Under 500") return p.price < 500;
          if (priceRange === "500 - 1000") return p.price >= 500 && p.price <= 1000;
          if (priceRange === "Over 1000") return p.price > 1000;
          return true;
        });
        if (!matchesPrice) return false;
      }
      
      if (selectedDiscounts.length > 0) {
        const matchesDiscount = selectedDiscounts.some(discountRange => {
          if (!p.discount) return false;
          if (discountRange === "10% - 20%") return p.discount >= 10 && p.discount <= 20;
          if (discountRange === "20% - 50%") return p.discount > 20 && p.discount <= 50;
          return true;
        });
        if (!matchesDiscount) return false;
      }
      
      return true;
    });

    switch (sortBy) {
      case "Price: Low to High":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "Name: A-Z":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Name: Z-A":
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    
    return filtered;
  }, [products, selectedTags, selectedSizes, selectedPrices, selectedDiscounts, sortBy]);

  const hasActiveFilters = selectedTags.length > 0 || selectedSizes.length > 0 || selectedPrices.length > 0 || selectedDiscounts.length > 0;

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedSizes([]);
    setSelectedPrices([]);
    setSelectedDiscounts([]);
  };

  const toggleFilter = (value: string, selected: string[], setSelected: (val: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const FilterContent = () => (
    <>
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          <X className="h-4 w-4" />
          Clear all filters
        </button>
      )}

     

      <div className="mb-8">
        <h3 className="text-sm text-muted-foreground italic mb-4">Size ({selectedSizes.length})</h3>
        <div className="flex flex-wrap gap-2">
          {filterSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSizes.includes(size)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm text-muted-foreground italic mb-4">Price ({selectedPrices.length})</h3>
        <div className="space-y-3">
          {filterPrices.map((price) => (
            <button
              key={price}
              onClick={() => toggleFilter(price, selectedPrices, setSelectedPrices)}
              className="flex items-center gap-3 cursor-pointer group w-full text-left"
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selectedPrices.includes(price) 
                  ? 'bg-primary border-primary' 
                  : 'border-border group-hover:border-primary/50'
              }`}>
                {selectedPrices.includes(price) && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-foreground">{price}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm text-muted-foreground italic mb-4">Discount ({selectedDiscounts.length})</h3>
        <div className="space-y-3">
          {filterDiscounts.map((discount) => (
            <button
              key={discount}
              onClick={() => toggleFilter(discount, selectedDiscounts, setSelectedDiscounts)}
              className="flex items-center gap-3 cursor-pointer group w-full text-left"
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selectedDiscounts.includes(discount) 
                  ? 'bg-primary border-primary' 
                  : 'border-border group-hover:border-primary/50'
              }`}>
                {selectedDiscounts.includes(discount) && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-foreground">{discount}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  if (collectionsLoading) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Header />
        <main className="pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Header />
        <main className="pt-24 pb-12 text-center">
          <h1 className="font-heading text-4xl text-foreground mb-4">Category not found</h1>
          <p className="text-muted-foreground mb-6">The category "{category}" doesn't exist.</p>
          <Link to="/shop" className="text-primary hover:underline">
            Browse all products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      <main>
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={categoryInfo.heroImage}
              alt={categoryInfo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 to-transparent" />
          </div>
          <div className="relative container-kanva h-full flex flex-col justify-end pb-16">
            <h1 className="font-heading text-[64px] md:text-[96px] text-background font-normal leading-none mb-4">
              {categoryInfo.title}
            </h1>
            <p className="text-background/90 text-lg md:text-xl max-w-xl mb-8">
              {categoryInfo.description}
            </p>
            <button 
              onClick={scrollToProducts}
              className="flex items-center gap-2 text-background hover:text-background/80 transition-colors group"
            >
              <span className="text-lg italic">Explore Collection</span>
              <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </section>

        <section id="products-section" className="container-kanva py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="font-heading text-2xl italic text-foreground hidden lg:block">Filters</h2>
            
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-foreground">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-heading text-2xl italic">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            <nav className="text-sm text-muted-foreground flex items-center gap-2">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span>{">"}</span>
              <Link to="/shop" className="hover:text-foreground">Shop</Link>
              <span>{">"}</span>
              <span className="text-foreground underline">{categoryInfo.title}</span>
            </nav>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Sort by</span>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground px-3 py-2 bg-secondary rounded-full sm:bg-transparent sm:p-0">
                  {sortBy}
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={sortBy === option ? "bg-secondary" : ""}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex gap-12">
            <aside className="w-64 flex-shrink-0 hidden lg:block">
              <FilterContent />
            </aside>

            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredProducts.length} of {totalCategoryProducts} products
              </p>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const selection = getProductSelection(product.id);
                    return (
                      <div key={product.id} className="group" data-testid={`product-card-${product.id}`}>
                        <Link to={`/shop/product/${product.id}`}>
                          <div className="relative bg-secondary rounded-2xl overflow-hidden aspect-square mb-4">
                            <button 
                              className="absolute top-4 left-4 z-10 p-2 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={(e) => handleToggleWishlist(e, product)}
                              data-testid={`button-wishlist-${product.id}`}
                            >
                              <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-primary text-primary' : ''}`} />
                            </button>
                            {product.discount && (
                              <span className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full">
                                {product.discount}% OFF
                              </span>
                            )}
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                        </Link>
                        <div className="text-center space-y-3">
                          <Link to={`/shop/product/${product.id}`}>
                            <h3 className="font-heading text-xl mb-1 text-foreground">{product.name}</h3>
                            <span className="text-muted-foreground">{formatPrice(product.price)}</span>
                          </Link>

                          {product.sizes && product.sizes.length > 0 && (
                            <div className="flex justify-center gap-2 flex-wrap">
                              {product.sizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setProductSize(product.id, size)}
                                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                    selection.size === size
                                      ? 'bg-primary text-primary-foreground border-primary'
                                      : 'bg-background border-border text-foreground hover:border-primary/50'
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          )}

                          {selection.size ? (
                            <div className="flex items-center justify-center gap-3">
                              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                <button 
                                  onClick={() => setProductQuantity(product.id, selection.quantity - 1)}
                                  className="p-2 bg-secondary hover:bg-secondary/80 transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-3 text-sm font-medium text-foreground">{selection.quantity}</span>
                                <button 
                                  onClick={() => setProductQuantity(product.id, selection.quantity + 1)}
                                  className="p-2 bg-secondary hover:bg-secondary/80 transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                                data-testid={`button-add-to-cart-${product.id}`}
                              >
                                Add to Cart
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">Select a size</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No products found in this category</p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-primary hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
