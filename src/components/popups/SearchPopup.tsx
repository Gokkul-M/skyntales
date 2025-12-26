import { useState, useEffect } from "react";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

interface SearchPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularSearches = ["Cleanser", "Moisturizer", "Serum", "Lotion", "Cream"];

const SearchPopup = ({ open, onOpenChange }: SearchPopupProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsQuery = query(collection(db, "products"), limit(50));
        const snapshot = await getDocs(productsQuery);
        const products: Product[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          products.push({
            id: doc.id,
            name: data.name || "",
            price: data.price || 0,
            image: data.image || data.images?.[0] || "",
            category: data.category || "",
            description: data.description || "",
          });
        });
        setAllProducts(products);
        setTrendingProducts(products.slice(0, 3));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchProducts();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const queryLower = searchQuery.toLowerCase();
        const results = allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(queryLower) ||
            product.category?.toLowerCase().includes(queryLower) ||
            product.description?.toLowerCase().includes(queryLower)
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="h-auto max-h-[80vh] overflow-y-auto">
        <SheetHeader className="sr-only">
          <SheetTitle>Search</SheetTitle>
        </SheetHeader>
        
        <div className="container-kanva py-8">
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 py-6 text-lg rounded-full border-2 border-border focus:border-foreground"
              autoFocus
              data-testid="input-search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full"
                data-testid="button-clear-search"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>

          {searchQuery ? (
            <div className="max-w-4xl mx-auto">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                {isSearching ? "Searching..." : `Results for "${searchQuery}"`}
              </h3>
              {isSearching ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/shop/product/${product.id}`}
                      onClick={() => onOpenChange(false)}
                      className="group flex items-center gap-4 p-3 rounded-xl hover:bg-secondary transition-colors"
                      data-testid={`link-search-result-${product.id}`}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">₹{product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8" data-testid="text-no-results">
                  No products found for "{searchQuery}"
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="max-w-2xl mx-auto mb-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-4 py-2 bg-secondary rounded-full text-sm hover:bg-secondary/80 transition-colors"
                      data-testid={`button-popular-${term.toLowerCase()}`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Trending Products</h3>
                  <Link
                    to="/shop"
                    onClick={() => onOpenChange(false)}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                    data-testid="link-view-all"
                  >
                    View All <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : trendingProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {trendingProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/shop/product/${product.id}`}
                        onClick={() => onOpenChange(false)}
                        className="group"
                        data-testid={`link-trending-${product.id}`}
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary mb-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h4 className="font-medium text-foreground">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">₹{product.price.toFixed(2)}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No products available
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SearchPopup;
