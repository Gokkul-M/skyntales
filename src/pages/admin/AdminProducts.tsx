import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Loader2, Package, ImagePlus, X, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCollections } from "@/contexts/CollectionsContext";

interface SizeVariant {
  size: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: "Active" | "Draft" | "Out of Stock";
  images: string[];
  description: string;
  size: string;
  sizes: SizeVariant[];
  details: string;
  howToUse: string;
  ingredients: string;
  deliveryReturn: string;
  createdAt?: Date;
}

const emptyFormData = {
  name: "",
  price: "",
  category: "",
  stock: "",
  status: "Active" as Product["status"],
  description: "",
  images: ["", "", "", ""],
  size: "",
  sizes: [{ size: "", price: "" }] as { size: string; price: string }[],
  details: "",
  howToUse: "",
  ingredients: "",
  deliveryReturn: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyFormData);
  const [activeTab, setActiveTab] = useState("basic");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const { collections: categories } = useCollections();

  useEffect(() => {
    const productsRef = collection(db, "products");
    
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        productsData.push({
          id: doc.id,
          name: data.name || "",
          price: data.price || 0,
          category: data.category || "",
          stock: data.stock || 0,
          status: data.status || "Active",
          images: data.images || [data.image || "/placeholder.svg"],
          description: data.description || "",
          size: data.size || "",
          sizes: data.sizes || [],
          details: data.details || "",
          howToUse: data.howToUse || "",
          ingredients: data.ingredients || "",
          deliveryReturn: data.deliveryReturn || "",
          createdAt: data.createdAt?.toDate?.() || new Date(0),
        });
      });
      // Sort client-side to avoid potential index issues
      productsData.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return dateB - dateA;
      });
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData(emptyFormData);
    setActiveTab("basic");
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleAdd = async () => {
    const hasValidSize = formData.sizes.some(s => s.size.trim() !== "" && s.price !== "");
    if (!formData.name || !formData.category || !hasValidSize) {
      toast({ title: "Please fill in all required fields including at least one size variant", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const validImages = formData.images.filter(img => img.trim() !== "");
      const validSizes = formData.sizes
        .filter(s => s.size.trim() !== "" && s.price !== "")
        .map(s => ({ size: s.size, price: parseFloat(s.price) || 0 }));
      const basePrice = validSizes.length > 0 ? validSizes[0].price : parseFloat(formData.price) || 0;
      
      await addDoc(collection(db, "products"), {
        name: formData.name,
        price: basePrice,
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        status: formData.status,
        images: validImages.length > 0 ? validImages : ["/placeholder.svg"],
        image: validImages[0] || "/placeholder.svg",
        description: formData.description,
        size: validSizes.length > 0 ? validSizes[0].size : formData.size,
        sizes: validSizes,
        details: formData.details,
        howToUse: formData.howToUse,
        ingredients: formData.ingredients,
        deliveryReturn: formData.deliveryReturn,
        createdAt: serverTimestamp(),
      });
      setIsAddOpen(false);
      resetForm();
      toast({ title: "Product added", description: `${formData.name} has been added successfully.` });
    } catch (error) {
      console.error("Error adding product:", error);
      toast({ title: "Error", description: "Failed to add product", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedProduct) return;
    
    setIsSubmitting(true);
    try {
      const validImages = formData.images.filter(img => img.trim() !== "");
      const validSizes = formData.sizes
        .filter(s => s.size.trim() !== "" && s.price !== "")
        .map(s => ({ size: s.size, price: parseFloat(s.price) || 0 }));
      const basePrice = validSizes.length > 0 ? validSizes[0].price : parseFloat(formData.price) || 0;
      
      const productRef = doc(db, "products", selectedProduct.id);
      await updateDoc(productRef, {
        name: formData.name,
        price: basePrice,
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        status: formData.status,
        images: validImages.length > 0 ? validImages : selectedProduct.images,
        image: validImages[0] || selectedProduct.images[0] || "/placeholder.svg",
        description: formData.description,
        size: validSizes.length > 0 ? validSizes[0].size : formData.size,
        sizes: validSizes,
        details: formData.details,
        howToUse: formData.howToUse,
        ingredients: formData.ingredients,
        deliveryReturn: formData.deliveryReturn,
        updatedAt: serverTimestamp(),
      });
      setIsEditOpen(false);
      resetForm();
      toast({ title: "Product updated", description: `${formData.name} has been updated successfully.` });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      await deleteDoc(doc(db, "products", id));
      toast({ title: "Product deleted", description: "The product has been removed." });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    const images = product.images.length >= 4 
      ? product.images.slice(0, 4) 
      : [...product.images, ...Array(4 - product.images.length).fill("")];
    
    const sizesData = product.sizes && product.sizes.length > 0
      ? product.sizes.map(s => ({ size: s.size, price: s.price.toString() }))
      : [{ size: product.size || "", price: product.price.toString() }];
    
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      status: product.status,
      description: product.description,
      images: images,
      size: product.size || "",
      sizes: sizesData,
      details: product.details || "",
      howToUse: product.howToUse || "",
      ingredients: product.ingredients || "",
      deliveryReturn: product.deliveryReturn || "",
    });
    setActiveTab("basic");
    setIsEditOpen(true);
  };

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Draft": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Out of Stock": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  const renderProductForm = (isEdit: boolean = false) => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>

      <ScrollArea className="h-[400px] pr-4">
        <TabsContent value="basic" className="space-y-4 mt-0">
          <div className="space-y-2">
            <Label>Product Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              data-testid="input-product-name"
            />
          </div>
          <div className="space-y-2">
            <Label>Stock</Label>
            <Input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="0"
              data-testid="input-product-stock"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger data-testid="select-product-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="Cleansers">Cleansers</SelectItem>
                      <SelectItem value="Moisturizers">Moisturizers</SelectItem>
                      <SelectItem value="Serums">Serums</SelectItem>
                      <SelectItem value="Lotions">Lotions</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Product["status"] })}>
                <SelectTrigger data-testid="select-product-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Size Variants *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({
                  ...formData,
                  sizes: [...formData.sizes, { size: "", price: "" }]
                })}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Size
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add different sizes with their respective prices. The first size will be the default.
            </p>
            <div className="space-y-2">
              {formData.sizes.map((sizeItem, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={sizeItem.size}
                    onChange={(e) => {
                      const newSizes = [...formData.sizes];
                      newSizes[index] = { ...newSizes[index], size: e.target.value };
                      setFormData({ ...formData, sizes: newSizes });
                    }}
                    placeholder="Size (e.g., 50ml)"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={sizeItem.price}
                    onChange={(e) => {
                      const newSizes = [...formData.sizes];
                      newSizes[index] = { ...newSizes[index], price: e.target.value };
                      setFormData({ ...formData, sizes: newSizes });
                    }}
                    placeholder="Price (₹)"
                    className="w-28"
                  />
                  {formData.sizes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newSizes = formData.sizes.filter((_, i) => i !== index);
                        setFormData({ ...formData, sizes: newSizes });
                      }}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief product description..."
              rows={3}
              data-testid="input-product-description"
            />
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-4 mt-0">
          <p className="text-sm text-muted-foreground mb-4">
            Add up to 4 product images. The first image will be used as the main product image.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="space-y-2">
                <Label>Image {index + 1} {index === 0 && "(Main)"}</Label>
                <div className="relative">
                  <Input
                    value={formData.images[index]}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder="https://..."
                    data-testid={`input-product-image-${index}`}
                  />
                  {formData.images[index] && (
                    <button
                      type="button"
                      onClick={() => updateImage(index, "")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                {formData.images[index] ? (
                  <div className="aspect-square rounded-lg overflow-hidden bg-secondary border">
                    <img 
                      src={formData.images[index]} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-secondary/50 border border-dashed flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <ImagePlus className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-xs">Paste URL above</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-0">
          <div className="space-y-2">
            <Label>Product Details</Label>
            <Textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Detailed product information, benefits, features..."
              rows={4}
              data-testid="input-product-details"
            />
          </div>
          <div className="space-y-2">
            <Label>How to Use</Label>
            <Textarea
              value={formData.howToUse}
              onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
              placeholder="Usage instructions, application steps..."
              rows={4}
              data-testid="input-product-how-to-use"
            />
          </div>
          <div className="space-y-2">
            <Label>Ingredients</Label>
            <Textarea
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="Full ingredient list..."
              rows={4}
              data-testid="input-product-ingredients"
            />
          </div>
          <div className="space-y-2">
            <Label>Delivery & Returns</Label>
            <Textarea
              value={formData.deliveryReturn}
              onChange={(e) => setFormData({ ...formData, deliveryReturn: e.target.value })}
              placeholder="Shipping information, return policy..."
              rows={4}
              data-testid="input-product-delivery"
            />
          </div>
        </TabsContent>
      </ScrollArea>

      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <Button 
          variant="outline" 
          onClick={() => isEdit ? setIsEditOpen(false) : setIsAddOpen(false)} 
          data-testid={isEdit ? "button-cancel-edit" : "button-cancel-add"}
        >
          Cancel
        </Button>
        <Button 
          onClick={isEdit ? handleEdit : handleAdd} 
          disabled={isSubmitting} 
          data-testid={isEdit ? "button-update-product" : "button-save-product"}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isEdit ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </Tabs>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground" data-testid="text-products-title">Products</h1>
            <p className="text-muted-foreground text-sm">Manage your product catalog</p>
          </div>
          <Button onClick={() => { resetForm(); setIsAddOpen(true); }} data-testid="button-add-product">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">{products.length}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-600">{products.filter(p => p.status === "Active").length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-yellow-600">{products.filter(p => p.status === "Draft").length}</p>
              <p className="text-sm text-muted-foreground">Draft</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-red-600">{products.filter(p => p.stock <= 5).length}</p>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-products"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground" data-testid="text-no-products">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="mb-4">Get started by adding your first product.</p>
                <Button 
                  onClick={() => { resetForm(); setIsAddOpen(true); }}
                  data-testid="button-add-first-product"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Product</th>
                        <th className="pb-3 font-medium">Category</th>
                        <th className="pb-3 font-medium">Price</th>
                        <th className="pb-3 font-medium">Stock</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="text-sm group" data-testid={`product-row-${product.id}`}>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={product.images[0] || "/placeholder.svg"}
                                  alt={product.name}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                                {product.images.length > 1 && (
                                  <span className="absolute -bottom-1 -right-1 bg-secondary text-xs px-1.5 py-0.5 rounded-full border">
                                    +{product.images.length - 1}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">{product.name}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {product.size && `${product.size} • `}{product.description || "No description"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-muted-foreground">{product.category}</td>
                          <td className="py-4 font-medium">₹{product.price.toFixed(2)}</td>
                          <td className="py-4">
                            <span className={product.stock <= 5 ? "text-red-500 font-medium" : ""}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-4">
                            <Badge variant="secondary" className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditModal(product)}
                                data-testid={`button-edit-${product.id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(product.id, product.name)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                data-testid={`button-delete-${product.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden" data-testid={`product-card-${product.id}`}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.category}</p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditModal(product)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(product.id, product.name)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="font-semibold">₹{product.price.toFixed(2)}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className={product.stock <= 5 ? "text-red-500" : "text-muted-foreground"}>
                                {product.stock} in stock
                              </span>
                            </div>
                            <Badge variant="secondary" className={`mt-2 ${getStatusColor(product.status)}`}>
                              {product.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Add New Product</DialogTitle>
            </DialogHeader>
            {renderProductForm(false)}
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Edit Product</DialogTitle>
            </DialogHeader>
            {renderProductForm(true)}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
