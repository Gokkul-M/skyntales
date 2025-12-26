import { Heart, X, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

interface WishlistPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WishlistPopup = ({ open, onOpenChange }: WishlistPopupProps) => {
  const { items, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (item: typeof items[0]) => {
    await addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      discount: item.discount,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2" data-testid="text-wishlist-title">
            <Heart className="h-5 w-5" />
            Wishlist ({items.length})
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center" data-testid="text-wishlist-empty">
              Your wishlist is empty.<br />
              Start adding your favorite products!
            </p>
            <Button onClick={() => onOpenChange(false)} asChild data-testid="button-browse-products">
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="group relative p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors" data-testid={`card-wishlist-item-${item.productId}`}>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-1.5 bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary"
                  data-testid={`button-remove-wishlist-${item.productId}`}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
                
                <Link 
                  to={`/shop/product/${item.productId}`}
                  onClick={() => onOpenChange(false)}
                  className="flex gap-4"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className="font-medium text-foreground mb-1" data-testid={`text-wishlist-item-name-${item.productId}`}>{item.name}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-semibold" data-testid={`text-wishlist-item-price-${item.productId}`}>{item.price.toFixed(2)}</span>
                      {item.discount && (
                        <span className="text-sm text-green-600">{item.discount}</span>
                      )}
                    </div>
                  </div>
                </Link>
                
                <Button 
                  size="sm" 
                  className="w-full mt-2 gap-2"
                  onClick={() => handleAddToCart(item)}
                  data-testid={`button-add-to-cart-${item.productId}`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistPopup;
