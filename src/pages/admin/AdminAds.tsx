import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Megaphone, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Advertisement {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  createdAt: any;
}

const AdminAds = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    isActive: true,
  });

  useEffect(() => {
    const adsRef = collection(db, "advertisements");
    const q = query(adsRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const adsData: Advertisement[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        adsData.push({
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          image: data.image || "",
          buttonText: data.buttonText || "Shop Now",
          buttonLink: data.buttonLink || "/shop",
          isActive: data.isActive || false,
          createdAt: data.createdAt,
        });
      });
      setAds(adsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      isActive: true,
    });
    setEditingAd(null);
  };

  const handleOpenDialog = (ad?: Advertisement) => {
    if (ad) {
      setEditingAd(ad);
      setFormData({
        title: ad.title,
        description: ad.description,
        image: ad.image,
        buttonText: ad.buttonText,
        buttonLink: ad.buttonLink,
        isActive: ad.isActive,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      if (editingAd) {
        await updateDoc(doc(db, "advertisements", editingAd.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Advertisement updated successfully" });
      } else {
        await addDoc(collection(db, "advertisements"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Advertisement created successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving advertisement:", error);
      toast({ title: "Error", description: "Failed to save advertisement", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return;
    
    try {
      await deleteDoc(doc(db, "advertisements", id));
      toast({ title: "Success", description: "Advertisement deleted successfully" });
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      toast({ title: "Error", description: "Failed to delete advertisement", variant: "destructive" });
    }
  };

  const toggleActive = async (ad: Advertisement) => {
    try {
      await updateDoc(doc(db, "advertisements", ad.id), {
        isActive: !ad.isActive,
        updatedAt: serverTimestamp(),
      });
      toast({ 
        title: "Success", 
        description: `Advertisement ${!ad.isActive ? "activated" : "deactivated"}` 
      });
    } catch (error) {
      console.error("Error toggling advertisement:", error);
      toast({ title: "Error", description: "Failed to update advertisement", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">Advertisements</h1>
            <p className="text-muted-foreground text-sm">Manage popup advertisements for your store</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Advertisement
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              All Advertisements ({ads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : ads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Megaphone className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">No advertisements yet</h3>
                <p>Create your first advertisement to show popup promotions.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {ads.map((ad) => (
                  <div key={ad.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                    {ad.image && (
                      <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold truncate">{ad.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{ad.description}</p>
                        </div>
                        <Badge variant={ad.isActive ? "default" : "secondary"}>
                          {ad.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(ad)}>
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleActive(ad)}>
                          {ad.isActive ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                          {ad.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(ad.id)}>
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAd ? "Edit Advertisement" : "Create Advertisement"}</DialogTitle>
            <DialogDescription>
              {editingAd ? "Update the advertisement details below." : "Fill in the details to create a new popup advertisement."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Summer Sale - 50% Off!"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Get amazing discounts on all skincare products"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="Shop Now"
                />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="/shop"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingAd ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAds;
