import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, FileText, Loader2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  author: string;
  status: "published" | "draft";
  createdAt: any;
}

const categories = [
  "Self-Care & Wellness",
  "Sustainable Beauty",
  "Skincare Tips",
  "Product Guides",
  "Ingredients",
];

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Skincare Tips",
    image: "",
    excerpt: "",
    content: "",
    author: "",
    status: "draft" as "published" | "draft",
  });

  useEffect(() => {
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogsData: BlogPost[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        blogsData.push({
          id: doc.id,
          title: data.title || "",
          category: data.category || "Skincare Tips",
          image: data.image || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          author: data.author || "",
          status: data.status || "draft",
          createdAt: data.createdAt,
        });
      });
      setBlogs(blogsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Skincare Tips",
      image: "",
      excerpt: "",
      content: "",
      author: "",
      status: "draft",
    });
    setEditingBlog(null);
  };

  const handleOpenDialog = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        category: blog.category,
        image: blog.image,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        status: blog.status,
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
      if (editingBlog) {
        await updateDoc(doc(db, "blogs", editingBlog.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Blog post updated successfully" });
      } else {
        await addDoc(collection(db, "blogs"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Blog post created successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({ title: "Error", description: "Failed to save blog post", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    try {
      await deleteDoc(doc(db, "blogs", id));
      toast({ title: "Success", description: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({ title: "Error", description: "Failed to delete blog post", variant: "destructive" });
    }
  };

  const toggleStatus = async (blog: BlogPost) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    try {
      await updateDoc(doc(db, "blogs", blog.id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Success", description: `Blog post ${newStatus}` });
    } catch (error) {
      console.error("Error updating blog:", error);
      toast({ title: "Error", description: "Failed to update blog post", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">Blog Posts</h1>
            <p className="text-muted-foreground text-sm">Manage blog articles for your store</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Blog Post
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Blog Posts ({filteredBlogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
                <p>Create your first blog post to share with your customers.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredBlogs.map((blog) => (
                  <div key={blog.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                    {blog.image && (
                      <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold truncate">{blog.title}</h3>
                          <p className="text-sm text-muted-foreground">{blog.category}</p>
                          {blog.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{blog.excerpt}</p>
                          )}
                        </div>
                        <Badge variant={blog.status === "published" ? "default" : "secondary"}>
                          {blog.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(blog)}>
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleStatus(blog)}>
                          {blog.status === "published" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(blog.id)}>
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? "Edit Blog Post" : "Create Blog Post"}</DialogTitle>
            <DialogDescription>
              {editingBlog ? "Update the blog post details below." : "Fill in the details to create a new blog post."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., 10 Tips for Glowing Skin"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g., Jane Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A brief summary of the blog post..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog post content here..."
                rows={8}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "published" | "draft") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingBlog ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBlogs;
