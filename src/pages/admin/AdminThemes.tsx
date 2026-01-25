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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Palette, Loader2, Eye, EyeOff, Sparkles, Calendar, Heart, Snowflake, PartyPopper, Leaf, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FestivalTheme {
  id: string;
  name: string;
  type: "festival" | "month" | "event";
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    textColor: string;
    overlayColor: string;
    overlayOpacity: number;
  };
  animation: string;
  heroGradient: string;
  bannerText: string;
  createdAt: any;
}

const animationOptions = [
  { value: "none", label: "No Animation", icon: null },
  { value: "confetti", label: "Confetti", icon: PartyPopper },
  { value: "hearts", label: "Hearts (Valentine)", icon: Heart },
  { value: "snowfall", label: "Snowfall (Winter)", icon: Snowflake },
  { value: "leaves", label: "Falling Leaves (Autumn)", icon: Leaf },
  { value: "petals", label: "Flower Petals (Spring)", icon: Sparkles },
  { value: "diyas", label: "Glowing Diyas (Diwali)", icon: Star },
  { value: "sparkles", label: "Cracker Sparkles (Diwali)", icon: Sparkles },
  { value: "stars", label: "Twinkling Stars", icon: Star },
  { value: "fireworks", label: "Fireworks (New Year)", icon: PartyPopper },
];

const themePresets = [
  { name: "Default", type: "month", colors: { primary: "#D4A574", secondary: "#8B7355", accent: "#C9A86C", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.4 }, animation: "none", gradient: "linear-gradient(135deg, #D4A574 0%, #8B7355 100%)" },
  { name: "January", type: "month", colors: { primary: "#4a90a4", secondary: "#2c5f72", accent: "#87ceeb", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "snowfall", gradient: "linear-gradient(135deg, #4a90a4 0%, #2c5f72 100%)" },
  { name: "February", type: "month", colors: { primary: "#e91e63", secondary: "#c2185b", accent: "#f48fb1", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "hearts", gradient: "linear-gradient(135deg, #e91e63 0%, #c2185b 100%)" },
  { name: "March", type: "month", colors: { primary: "#8bc34a", secondary: "#689f38", accent: "#c5e1a5", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "petals", gradient: "linear-gradient(135deg, #8bc34a 0%, #689f38 100%)" },
  { name: "April", type: "month", colors: { primary: "#ffb6c1", secondary: "#98fb98", accent: "#87ceeb", textColor: "#333333", overlayColor: "#000000", overlayOpacity: 0.2 }, animation: "petals", gradient: "linear-gradient(135deg, #ffb6c1 0%, #98fb98 100%)" },
  { name: "May", type: "month", colors: { primary: "#ff9800", secondary: "#f57c00", accent: "#ffcc80", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "none", gradient: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)" },
  { name: "June", type: "month", colors: { primary: "#ff7f50", secondary: "#ff6347", accent: "#ffd700", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "none", gradient: "linear-gradient(135deg, #ff7f50 0%, #ff6347 100%)" },
  { name: "July", type: "month", colors: { primary: "#00bcd4", secondary: "#0097a7", accent: "#80deea", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "none", gradient: "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)" },
  { name: "August", type: "month", colors: { primary: "#ff9933", secondary: "#138808", accent: "#ffffff", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "confetti", gradient: "linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%)" },
  { name: "September", type: "month", colors: { primary: "#795548", secondary: "#5d4037", accent: "#d7ccc8", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "leaves", gradient: "linear-gradient(135deg, #795548 0%, #5d4037 100%)" },
  { name: "October", type: "month", colors: { primary: "#ff5722", secondary: "#e64a19", accent: "#ffab91", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "leaves", gradient: "linear-gradient(135deg, #ff5722 0%, #e64a19 100%)" },
  { name: "November", type: "month", colors: { primary: "#ffa500", secondary: "#ff8c00", accent: "#ffd700", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.4 }, animation: "diyas", gradient: "linear-gradient(135deg, #ffa500 0%, #ff8c00 50%, #ffd700 100%)" },
  { name: "December", type: "month", colors: { primary: "#c41e3a", secondary: "#165b33", accent: "#ffd700", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "snowfall", gradient: "linear-gradient(135deg, #c41e3a 0%, #165b33 100%)" },
  { name: "Valentine's Day", type: "event", colors: { primary: "#ff6b6b", secondary: "#ee5a5a", accent: "#ff8787", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "hearts", gradient: "linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 50%, #ff8787 100%)" },
  { name: "Diwali", type: "festival", colors: { primary: "#ffa500", secondary: "#ff8c00", accent: "#ffd700", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.4 }, animation: "sparkles", gradient: "linear-gradient(135deg, #ffa500 0%, #ff8c00 50%, #ffd700 100%)" },
  { name: "Christmas", type: "festival", colors: { primary: "#c41e3a", secondary: "#165b33", accent: "#ffd700", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "snowfall", gradient: "linear-gradient(135deg, #c41e3a 0%, #165b33 100%)" },
  { name: "Holi", type: "festival", colors: { primary: "#ff00ff", secondary: "#00ffff", accent: "#ffff00", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.2 }, animation: "confetti", gradient: "linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ffff00 100%)" },
  { name: "New Year", type: "event", colors: { primary: "#ffd700", secondary: "#c0c0c0", accent: "#ffffff", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.4 }, animation: "fireworks", gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" },
  { name: "Pongal", type: "festival", colors: { primary: "#ff9933", secondary: "#138808", accent: "#ffd700", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "leaves", gradient: "linear-gradient(135deg, #ff9933 0%, #ffd700 50%, #138808 100%)" },
  { name: "Independence Day", type: "event", colors: { primary: "#ff9933", secondary: "#138808", accent: "#ffffff", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "confetti", gradient: "linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%)" },
  { name: "Onam", type: "festival", colors: { primary: "#ffd700", secondary: "#ff6347", accent: "#98fb98", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "petals", gradient: "linear-gradient(135deg, #ffd700 0%, #ff6347 50%, #98fb98 100%)" },
  { name: "Navratri", type: "festival", colors: { primary: "#9c27b0", secondary: "#7b1fa2", accent: "#e1bee7", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "stars", gradient: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)" },
  { name: "Eid", type: "festival", colors: { primary: "#4caf50", secondary: "#388e3c", accent: "#ffd700", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "stars", gradient: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)" },
  { name: "Women's Day", type: "event", colors: { primary: "#9c27b0", secondary: "#e91e63", accent: "#f48fb1", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "petals", gradient: "linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)" },
  { name: "Mother's Day", type: "event", colors: { primary: "#e91e63", secondary: "#ad1457", accent: "#f8bbd0", textColor: "#ffffff", overlayColor: "#000000", overlayOpacity: 0.3 }, animation: "hearts", gradient: "linear-gradient(135deg, #e91e63 0%, #ad1457 100%)" },
];

const AdminThemes = () => {
  const [themes, setThemes] = useState<FestivalTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<FestivalTheme | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "event" as "festival" | "month" | "event",
    startDate: "",
    endDate: "",
    isActive: true,
    priority: 1,
    colors: {
      primary: "#D4A574",
      secondary: "#8B7355",
      accent: "#C9A86C",
      textColor: "#FFFFFF",
      overlayColor: "#000000",
      overlayOpacity: 0.4,
    },
    animation: "none",
    heroGradient: "",
    bannerText: "",
  });

  useEffect(() => {
    const themesRef = collection(db, "festivalThemes");
    const q = query(themesRef, orderBy("priority", "desc"));

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const themesData: FestivalTheme[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          themesData.push({
            id: doc.id,
            name: data.name || "",
            type: data.type || "event",
            startDate: data.startDate || "",
            endDate: data.endDate || "",
            isActive: data.isActive || false,
            priority: data.priority || 1,
            colors: data.colors || formData.colors,
            animation: data.animation || "none",
            heroGradient: data.heroGradient || "",
            bannerText: data.bannerText || "",
            createdAt: data.createdAt,
          });
        });
        setThemes(themesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching themes:", error);
        toast({ 
          title: "Permission Error", 
          description: "Please add Firestore security rules for the festivalThemes collection", 
          variant: "destructive" 
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      type: "event",
      startDate: "",
      endDate: "",
      isActive: true,
      priority: 1,
      colors: {
        primary: "#D4A574",
        secondary: "#8B7355",
        accent: "#C9A86C",
        textColor: "#FFFFFF",
        overlayColor: "#000000",
        overlayOpacity: 0.4,
      },
      animation: "none",
      heroGradient: "",
      bannerText: "",
    });
    setEditingTheme(null);
  };

  const handleOpenDialog = (theme?: FestivalTheme) => {
    if (theme) {
      setEditingTheme(theme);
      setFormData({
        name: theme.name,
        type: theme.type,
        startDate: theme.startDate,
        endDate: theme.endDate,
        isActive: theme.isActive,
        priority: theme.priority,
        colors: theme.colors,
        animation: theme.animation,
        heroGradient: theme.heroGradient,
        bannerText: theme.bannerText,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const applyPreset = (preset: typeof themePresets[0]) => {
    setFormData(prev => ({
      ...prev,
      name: preset.name,
      type: preset.type as "festival" | "month" | "event",
      colors: preset.colors,
      animation: preset.animation,
      heroGradient: preset.gradient,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      const themeData = {
        name: formData.name.trim(),
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
        priority: formData.priority,
        colors: formData.colors,
        animation: formData.animation,
        heroGradient: formData.heroGradient,
        bannerText: formData.bannerText,
        updatedAt: serverTimestamp(),
      };

      if (editingTheme) {
        await updateDoc(doc(db, "festivalThemes", editingTheme.id), themeData);
        toast({ title: "Success", description: "Theme updated successfully" });
      } else {
        await addDoc(collection(db, "festivalThemes"), {
          ...themeData,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Theme created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving theme:", error);
      toast({ title: "Error", description: "Failed to save theme", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (themeId: string) => {
    if (!confirm("Are you sure you want to delete this theme?")) return;

    try {
      await deleteDoc(doc(db, "festivalThemes", themeId));
      toast({ title: "Success", description: "Theme deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete theme", variant: "destructive" });
    }
  };

  const toggleActive = async (theme: FestivalTheme) => {
    try {
      await updateDoc(doc(db, "festivalThemes", theme.id), {
        isActive: !theme.isActive,
      });
      toast({ title: "Success", description: `Theme ${theme.isActive ? "deactivated" : "activated"}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update theme", variant: "destructive" });
    }
  };

  const isThemeActive = (theme: FestivalTheme) => {
    if (!theme.isActive) return false;
    const now = new Date();
    const start = new Date(theme.startDate);
    const end = new Date(theme.endDate);
    end.setHours(23, 59, 59, 999);
    return now >= start && now <= end;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "festival": return "bg-purple-100 text-purple-800";
      case "month": return "bg-blue-100 text-blue-800";
      case "event": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Festival Themes</h1>
            <p className="text-gray-500 mt-1">Manage seasonal and festival themes for your homepage</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Theme
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : themes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Palette className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No themes yet</h3>
              <p className="text-gray-500 mb-4">Create your first festival or seasonal theme</p>
              <Button onClick={() => handleOpenDialog()}>Create Theme</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <Card key={theme.id} className={`overflow-hidden ${isThemeActive(theme) ? "ring-2 ring-green-500" : ""}`}>
                <div 
                  className="h-24 relative"
                  style={{ 
                    background: theme.heroGradient || `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
                  }}
                >
                  {isThemeActive(theme) && (
                    <Badge className="absolute top-2 right-2 bg-green-500">Active Now</Badge>
                  )}
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    {theme.colors && (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: theme.colors.primary }} />
                        <div className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: theme.colors.secondary }} />
                        <div className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: theme.colors.accent }} />
                      </>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{theme.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getTypeColor(theme.type)}>
                          {theme.type}
                        </Badge>
                        {theme.animation !== "none" && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">
                            {theme.animation}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={theme.isActive}
                      onCheckedChange={() => toggleActive(theme)}
                    />
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {new Date(theme.startDate).toLocaleDateString()} - {new Date(theme.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(theme)} className="flex-1">
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(theme.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTheme ? "Edit Theme" : "Create Theme"}</DialogTitle>
              <DialogDescription>
                Configure colors, animations, and date range for this theme
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {themePresets.map((preset) => (
                    <Button
                      key={preset.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="text-xs"
                      style={{ borderColor: preset.colors.primary }}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Theme Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Valentine's Day"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="festival">Festival</SelectItem>
                      <SelectItem value="month">Seasonal/Month</SelectItem>
                      <SelectItem value="event">Special Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Theme Colors</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Primary</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.colors.primary}
                        onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, primary: e.target.value } })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={formData.colors.primary}
                        onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, primary: e.target.value } })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Secondary</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.colors.secondary}
                        onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, secondary: e.target.value } })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={formData.colors.secondary}
                        onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, secondary: e.target.value } })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Accent</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.colors.accent}
                        onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, accent: e.target.value } })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={formData.colors.accent}
                        onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, accent: e.target.value } })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="animation">Animation Effect</Label>
                  <Select value={formData.animation} onValueChange={(value) => setFormData({ ...formData, animation: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {animationOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            {opt.icon && <opt.icon className="h-4 w-4" />}
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (higher = more important)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroGradient">Custom Hero Gradient (CSS)</Label>
                <Input
                  id="heroGradient"
                  value={formData.heroGradient}
                  onChange={(e) => setFormData({ ...formData, heroGradient: e.target.value })}
                  placeholder="linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bannerText">Banner Text (optional)</Label>
                <Input
                  id="bannerText"
                  value={formData.bannerText}
                  onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                  placeholder="Happy Valentine's Day! Use code LOVE20 for 20% off"
                />
              </div>

              <div 
                className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
                style={{ 
                  background: formData.heroGradient || `linear-gradient(135deg, ${formData.colors.primary} 0%, ${formData.colors.secondary} 100%)`
                }}
              >
                Preview: {formData.name || "Theme Name"}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingTheme ? "Update" : "Create"} Theme
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminThemes;
