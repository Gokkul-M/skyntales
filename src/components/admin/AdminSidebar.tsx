import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Mail, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Settings,
  FolderOpen,
  Sparkles,
  Megaphone,
  FileText,
  Instagram
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: FolderOpen, label: "Collections", href: "/admin/collections" },
  { icon: Sparkles, label: "Featured", href: "/admin/featured" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Mail, label: "Contact", href: "/admin/contact" },
  { icon: Megaphone, label: "Ads", href: "/admin/ads" },
  { icon: FileText, label: "Blogs", href: "/admin/blogs" },
  { icon: Instagram, label: "Instagram", href: "/admin/instagram" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, userProfile } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/admin");
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'A';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card">
      <div className="p-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">S</span>
        </div>
        <div>
          <Link to="/" className="font-heading text-xl font-semibold text-foreground" data-testid="link-home">
            Skyntales
          </Link>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menu
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                data-testid={`link-admin-${item.label.toLowerCase()}`}
              >
                <item.icon size={20} className={cn(
                  "transition-transform duration-200",
                  !isActive && "group-hover:scale-110"
                )} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Links
          </p>
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
            data-testid="link-view-store"
          >
            <Settings size={20} />
            <span className="font-medium">View Store</span>
          </Link>
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(userProfile?.displayName, userProfile?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {userProfile?.displayName || 'Admin'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userProfile?.email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
          data-testid="button-admin-logout"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} data-testid="button-mobile-menu">
          <Menu size={24} />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="font-heading text-lg font-semibold">Skyntales Admin</span>
        </div>
        <div className="w-10" />
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileOpen(false)} 
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border shadow-xl animate-in slide-in-from-left duration-300">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={() => setMobileOpen(false)}
              data-testid="button-close-menu"
            >
              <X size={20} />
            </Button>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border shadow-sm">
        <div className="w-full">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
