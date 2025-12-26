import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Lock, Mail, ArrowLeft, ShieldCheck } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, signIn, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "Signed in",
        description: "Checking admin access...",
      });
    } catch (error: any) {
      toast({
        title: "Invalid credentials",
        description: error.message || "Please check your email and password.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center animate-pulse">
            <span className="text-primary-foreground font-bold text-xl">K</span>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="font-heading text-2xl font-semibold text-foreground mb-2">Access Denied</h1>
              <p className="text-muted-foreground mb-6">
                Your account does not have administrator privileges. Please contact the system administrator if you believe this is an error.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/")} data-testid="button-go-home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
                <Button onClick={() => navigate("/account")} data-testid="button-my-account">
                  My Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">K</span>
            </div>
            <span className="font-heading text-xl font-semibold">Kanva</span>
          </Link>
          <h1 className="font-heading text-3xl font-semibold text-foreground mb-2" data-testid="text-admin-title">
            Admin Portal
          </h1>
          <p className="text-muted-foreground">Sign in to access the dashboard</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>Enter your admin credentials below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    autoComplete="email"
                    data-testid="input-admin-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                    autoComplete="current-password"
                    data-testid="input-admin-password"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading} data-testid="button-admin-login">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Demo Admin Access</p>
                  <p className="text-xs text-muted-foreground">
                    Use <span className="font-mono">admin@kanva.com</span> with password <span className="font-mono">admin123</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="inline h-4 w-4 mr-1" />
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
