import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Loader2, FolderOpen, MoreVertical, GripVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
  createdAt?: any;
}

const emptyFormData = {
  name: "",
  slug: "",
  description: "",
  image: "",
  isActive: true,
  order: 0,
};

const AdminCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {
    const collectionsRef = collection(db, "collections");
    const q = query(collectionsRef, orderBy("order", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collectionsData: Collection[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        collectionsData.push({
          id: doc.id,
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          image: data.image || "",
          isActive: data.isActive !== false,
          order: data.order || 0,
          createdAt: data.createdAt,
        });
      });
      setCollections(collectionsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching collections:", error);
      toast({ title: "Error", description: "Failed to load collections", variant: "destructive" });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCollections = collections.filter((col) =>
    col.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData(emptyFormData);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleAdd = async () => {
    if (!formData.name) {
      toast({ title: "Please enter a collection name", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "collections"), {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description,
        image: formData.image || "/placeholder.svg",
        isActive: formData.isActive,
        order: collections.length,
        createdAt: serverTimestamp(),
      });
      setIsAddOpen(false);
      resetForm();
      toast({ title: "Collection added", description: `${formData.name} has been added successfully.` });
    } catch (error) {
      console.error("Error adding collection:", error);
      toast({ title: "Error", description: "Failed to add collection", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedCollection) return;
    
    setIsSubmitting(true);
    try {
      const collectionRef = doc(db, "collections", selectedCollection.id);
      await updateDoc(collectionRef, {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description,
        image: formData.image,
        isActive: formData.isActive,
        order: formData.order,
        updatedAt: serverTimestamp(),
      });
      setIsEditOpen(false);
      resetForm();
      toast({ title: "Collection updated", description: `${formData.name} has been updated.` });
    } catch (error) {
      console.error("Error updating collection:", error);
      toast({ title: "Error", description: "Failed to update collection", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (col: Collection) => {
    if (!confirm(`Are you sure you want to delete "${col.name}"?`)) return;
    
    try {
      const collectionRef = doc(db, "collections", col.id);
      await deleteDoc(collectionRef);
      toast({ title: "Collection deleted", description: `${col.name} has been deleted.` });
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast({ title: "Error", description: "Failed to delete collection", variant: "destructive" });
    }
  };

  const openEdit = (col: Collection) => {
    setSelectedCollection(col);
    setFormData({
      name: col.name,
      slug: col.slug,
      description: col.description,
      image: col.image,
      isActive: col.isActive,
      order: col.order,
    });
    setIsEditOpen(true);
  };

  const toggleActive = async (col: Collection) => {
    try {
      const collectionRef = doc(db, "collections", col.id);
      await updateDoc(collectionRef, { isActive: !col.isActive });
      toast({ 
        title: col.isActive ? "Collection deactivated" : "Collection activated",
        description: `${col.name} is now ${col.isActive ? "hidden" : "visible"} on the website.`
      });
    } catch (error) {
      console.error("Error toggling collection:", error);
      toast({ title: "Error", description: "Failed to update collection", variant: "destructive" });
    }
  };

  const activeCount = collections.filter(c => c.isActive).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading collections...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground" data-testid="text-collections-title">Collections</h1>
            <p className="text-muted-foreground text-sm">Manage product collections and categories</p>
          </div>
          <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="gap-2" data-testid="button-add-collection">
            <Plus size={16} />
            Add Collection
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground" data-testid="text-total-collections">{collections.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground" data-testid="text-active-collections">{activeCount}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <CardTitle className="text-lg">All Collections</CardTitle>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search collections..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-collections"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredCollections.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No collections found</p>
                <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="mt-4">
                  Create your first collection
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCollections.map((col) => (
                  <Card key={col.id} className="overflow-hidden" data-testid={`collection-${col.id}`}>
                    <div className="aspect-video relative overflow-hidden bg-secondary">
                      {col.image && col.image !== "/placeholder.svg" ? (
                        <img 
                          src={col.image} 
                          alt={col.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FolderOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className={col.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}>
                          {col.isActive ? "Active" : "Hidden"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold truncate">{col.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">/{col.slug}</p>
                          {col.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{col.description}</p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(col)}>
                              <Pencil size={14} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleActive(col)}>
                              {col.isActive ? "Hide" : "Show"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(col)} className="text-red-600">
                              <Trash2 size={14} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Cleansers"
                data-testid="input-collection-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="cleansers"
                data-testid="input-collection-slug"
              />
              <p className="text-xs text-muted-foreground">URL-friendly name (auto-generated)</p>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this collection..."
                rows={3}
                data-testid="input-collection-description"
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                data-testid="input-collection-image"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                data-testid="switch-collection-active"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={isSubmitting} className="flex-1" data-testid="button-save-collection">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Collection"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Cleansers"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="cleansers"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this collection..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCollections;
