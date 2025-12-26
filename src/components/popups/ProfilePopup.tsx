import { User, Settings, ShoppingBag, Heart, LogOut, CreditCard, MapPin, Shield } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProfilePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const menuItems = [
  { icon: ShoppingBag, label: "My Orders", href: "/account" },
  { icon: Heart, label: "Wishlist", href: "/favorites" },
  { icon: MapPin, label: "Addresses", href: "/account" },
  { icon: CreditCard, label: "Payment Methods", href: "/account" },
  { icon: Settings, label: "Account Settings", href: "/account" },
];

const ProfilePopup = ({ open, onOpenChange }: ProfilePopupProps) => {
  const { user, userProfile, loading, signIn, signInWithGoogle, logout, isAdmin } = useAuth();

  const handleSignIn = () => {
    window.location.href = "/account";
    onOpenChange(false);
  };

  const handleLogout = async () => {
    await logout();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2" data-testid="text-account-title">
            <User className="h-5 w-5" />
            Account
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          </div>
        ) : !user ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 py-12">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1">Welcome to Skyntales</h3>
              <p className="text-sm text-muted-foreground">
                Sign in to access your account, track orders, and save your favorites.
              </p>
            </div>
            <div className="w-full space-y-3">
              <Button className="w-full" size="lg" onClick={handleSignIn} data-testid="button-sign-in">
                Sign In
              </Button>
              <Button variant="outline" className="w-full" size="lg" onClick={signInWithGoogle} data-testid="button-google-sign-in">
                Sign in with Google
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </div>
        ) : (
          <div className="flex-1 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL || ""} alt={userProfile?.displayName || ""} />
                <AvatarFallback className="bg-secondary text-lg">
                  {userProfile?.displayName?.split(" ").map(n => n[0]).join("") || user.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg" data-testid="text-user-name">{userProfile?.displayName || "User"}</h3>
                <p className="text-sm text-muted-foreground" data-testid="text-user-email">{user.email}</p>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 text-xs text-primary mt-1">
                    <Shield className="h-3 w-3" />
                    Admin
                  </span>
                )}
              </div>
            </div>

            <Separator className="mb-6" />

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors"
                  data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors text-primary"
                  data-testid="link-admin-dashboard"
                >
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Admin Dashboard</span>
                </Link>
              )}
            </nav>

            <Separator className="my-6" />

            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-destructive/10 transition-colors w-full text-destructive"
              data-testid="button-sign-out"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ProfilePopup;
