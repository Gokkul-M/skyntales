import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="container-kanva text-center py-24">
          <h1 className="text-display font-heading mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Link to="/" className="btn-kanva-primary">
            Return to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
