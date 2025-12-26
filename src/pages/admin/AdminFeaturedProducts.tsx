import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Search, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { collection, query, orderBy, onSnapshot, doc, addDoc, deleteDoc, serverTimestamp, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
}

interface FeaturedProduct {
  id: string;
  productId: string;
  position: "top_left" | "top_right" | "bottom_left" | "bottom_right" | "center";
  slideIndex: number;
  productName: string;
  productImage: string;
  productPrice: number;
  productCategory: string;
}

const AdminFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<FeaturedProduct["position"]>("center");
  const [selectedSlide, setSelectedSlide] = useState<number>(0);

  useEffect(() => {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        productsData.push({
          id: doc.id,
          name: data.name || "",
          price: data.price || 0,
          category: data.category || "",
          image: data.image || "/placeholder.svg",
          images: data.images || [data.image || "/placeholder.svg"],
        });
      });
      setProducts(productsData);
    }, (error) => {
      console.error("Error fetching products:", error);
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const featuredRef = collection(db, "featuredProducts");
    const q = query(featuredRef, orderBy("slideIndex", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const featuredData: FeaturedProduct[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        featuredData.push({
          id: doc.id,
          productId: data.productId || "",
          position: data.position || "center",
          slideIndex: data.slideIndex || 0,
          productName: data.productName || "",
          productImage: data.productImage || "/placeholder.svg",
          productPrice: data.productPrice || 0,
          productCategory: data.productCategory || "",
        });
      });
      setFeatured(featuredData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching featured products:", error);
      toast({ title: "Error", description: "Failed to load featured products", variant: "destructive" });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isPositionTaken = (slideIndex: number, position: string): boolean => {
    return featured.some(
      (f) => f.slideIndex === slideIndex && f.position === position
    );
  };

  const handleAddFeatured = async () => {
    if (!selectedProduct) {
      toast({ title: "Please select a product", variant: "destructive" });
      return;
    }

    if (isPositionTaken(selectedSlide, selectedPosition)) {
      toast({ 
        title: "Position already taken", 
        description: `Slide ${selectedSlide + 1}, ${positionLabels[selectedPosition]} already has a product assigned. Please choose a different position or remove the existing one first.`,
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "featuredProducts"), {
        productId: selectedProduct.id,
        position: selectedPosition,
        slideIndex: selectedSlide,
        productName: selectedProduct.name,
        productImage: selectedProduct.image,
        productPrice: selectedProduct.price,
        productCategory: selectedProduct.category,
        createdAt: serverTimestamp(),
      });
      setSelectedProduct(null);
      setSelectedPosition("center");
      setSelectedSlide(0);
      setSearchTerm("");
      toast({ title: "Success", description: "Featured product added successfully" });
    } catch (error) {
      console.error("Error adding featured product:", error);
      toast({ title: "Error", description: "Failed to add featured product", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFeatured = async (id: string, productName: string) => {
    try {
      await deleteDoc(doc(db, "featuredProducts", id));
      toast({ title: "Removed", description: `${productName} removed from featured products` });
    } catch (error) {
      console.error("Error deleting featured product:", error);
      toast({ title: "Error", description: "Failed to remove featured product", variant: "destructive" });
    }
  };

  const positionLabels: Record<FeaturedProduct["position"], string> = {
    top_left: "Top Left",
    top_right: "Top Right",
    bottom_left: "Bottom Left",
    bottom_right: "Bottom Right",
    center: "Center",
  };

  const getSlideProducts = (slideIndex: number) => {
    return featured.filter((f) => f.slideIndex === slideIndex);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading featured products...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground" data-testid="text-featured-products-title">Featured Products</h1>
          <p className="text-muted-foreground text-sm">Manage products featured in the hero section carousel (click dots on hero slides)</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {[0, 1, 2].map((slideIndex) => {
              const slideProducts = getSlideProducts(slideIndex);
              return (
                <Card key={slideIndex}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between gap-2">
                      <span>Slide {slideIndex + 1}</span>
                      <Badge variant="outline" className="text-xs">
                        {slideProducts.length} / 5 positions
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {slideProducts.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No featured products on this slide</p>
                    ) : (
                      slideProducts.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <img 
                              src={item.productImage} 
                              alt={item.productName}
                              className="h-12 w-12 rounded object-cover flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.productName}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge variant="outline" className="text-xs">{positionLabels[item.position]}</Badge>
                                {item.productCategory && (
                                  <Badge variant="secondary" className="text-xs">{item.productCategory}</Badge>
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  ₹{item.productPrice?.toFixed(2) || '0.00'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteFeatured(item.id, item.productName)}
                            data-testid={`button-delete-featured-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Featured Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Slide</label>
                <Select value={selectedSlide.toString()} onValueChange={(v) => setSelectedSlide(Number(v))}>
                  <SelectTrigger data-testid="select-slide">
                    <SelectValue placeholder="Select slide" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Slide 1</SelectItem>
                    <SelectItem value="1">Slide 2</SelectItem>
                    <SelectItem value="2">Slide 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Select value={selectedPosition} onValueChange={(v) => setSelectedPosition(v as FeaturedProduct["position"])}>
                  <SelectTrigger data-testid="select-position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(positionLabels).map(([value, label]) => {
                      const taken = isPositionTaken(selectedSlide, value);
                      return (
                        <SelectItem 
                          key={value} 
                          value={value}
                          disabled={taken}
                        >
                          {label} {taken && "(Taken)"}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {isPositionTaken(selectedSlide, selectedPosition) && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    This position is already taken
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Search Product</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder="Search by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-products"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No products found</p>
                ) : (
                  filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition ${
                        selectedProduct?.id === product.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 hover:bg-secondary"
                      }`}
                      data-testid={`button-select-product-${product.id}`}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate block">{product.name}</span>
                        <span className={`text-xs ${selectedProduct?.id === product.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {product.category} • ₹{product.price.toFixed(2)}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {selectedProduct && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Selected:</p>
                  <p className="text-sm font-medium">{selectedProduct.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedProduct.category} • ₹{selectedProduct.price.toFixed(2)}
                  </p>
                </div>
              )}

              <Button 
                onClick={handleAddFeatured} 
                disabled={isSubmitting || !selectedProduct || isPositionTaken(selectedSlide, selectedPosition)}
                className="w-full"
                data-testid="button-add-featured"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Add to Slide {selectedSlide + 1}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFeaturedProducts;
