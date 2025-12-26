import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

interface CartPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartPopup = ({ open, onOpenChange }: CartPopupProps) => {
  const { items, updateQuantity, removeFromCart, totalPrice, loading } = useCart();

  const shipping = totalPrice > 50 ? 0 : 4.99;
  const total = totalPrice + shipping;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2" data-testid="text-cart-title">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground" data-testid="text-cart-empty">Your cart is empty</p>
            <Button onClick={() => onOpenChange(false)} asChild data-testid="button-continue-shopping">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-secondary/30" data-testid={`card-cart-item-${item.productId}`}>
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-foreground truncate" data-testid={`text-item-name-${item.productId}`}>{item.name}</h4>
                        {item.discount && (
                          <p className="text-sm text-muted-foreground">{item.discount}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-secondary rounded-full transition-colors"
                        data-testid={`button-remove-item-${item.productId}`}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-background rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-secondary rounded-full transition-colors"
                          data-testid={`button-decrease-${item.productId}`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center" data-testid={`text-quantity-${item.productId}`}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-secondary rounded-full transition-colors"
                          data-testid={`button-increase-${item.productId}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-medium" data-testid={`text-item-total-${item.productId}`}>{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span data-testid="text-subtotal">{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span data-testid="text-shipping">{shipping === 0 ? "Free" : `${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders over 50
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span data-testid="text-total">{total.toFixed(2)}</span>
              </div>
            </div>

            <SheetFooter className="pt-4 gap-2 sm:gap-2">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)} asChild data-testid="button-continue-shopping">
                <Link to="/shop">Continue Shopping</Link>
              </Button>
              <Button className="flex-1" asChild data-testid="button-checkout">
                <Link to="/checkout" onClick={() => onOpenChange(false)}>Checkout</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartPopup;
