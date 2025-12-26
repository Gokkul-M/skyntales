import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Truck, ShoppingBag, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Helper function to calculate shipping cost based on location
const calculateShippingCost = (state: string): number => {
  if (!state) return 0;
  const tamilNaduVariants = [
    "tamil nadu",
    "tamil nadoo",
    "tamilnadu",
    "tn",
  ];
  const isInTamilNadu = tamilNaduVariants.some(variant => 
    state.toLowerCase().includes(variant)
  );
  return isInTamilNadu ? 70 : 100;
};

// Helper function to validate location fields
const validateLocation = (city: string, state: string, zipCode: string, country: string): boolean => {
  return city.trim() !== "" && state.trim() !== "" && zipCode.trim() !== "" && country.trim() !== "";
};

const Checkout = () => {
  const { user, userProfile } = useAuth();
  const { items: cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [locationError, setLocationError] = useState("");
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: userProfile?.displayName?.split(" ")[0] || "",
    lastName: userProfile?.displayName?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address?.street || "",
    city: userProfile?.address?.city || "",
    state: userProfile?.address?.state || "",
    zipCode: userProfile?.address?.zipCode || "",
    country: userProfile?.address?.country || "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const cartProducts = cartItems;

  const subtotal = cartProducts.reduce((sum, item) => 
    sum + item.price * item.quantity, 0
  );
  
  // Validate location and calculate shipping
  const isLocationValid = validateLocation(shippingInfo.city, shippingInfo.state, shippingInfo.zipCode, shippingInfo.country);
  const shipping = isLocationValid ? calculateShippingCost(shippingInfo.state) : 0;
  const shippingCost = shipping;
  
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;

  const handleShippingChange = (field: string, value: string) => {
    const updatedInfo = { ...shippingInfo, [field]: value };
    setShippingInfo(updatedInfo);
    
    // Validate location in real-time
    if (field === "state" || field === "city" || field === "zipCode" || field === "country") {
      if (validateLocation(updatedInfo.city, updatedInfo.state, updatedInfo.zipCode, updatedInfo.country)) {
        setLocationError("");
      } else {
        setLocationError("Please fill in all location fields (City, State, ZIP/Postal Code, Country)");
      }
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    
    if (!validateLocation(shippingInfo.city, shippingInfo.state, shippingInfo.zipCode, shippingInfo.country)) {
      setLocationError("Please fill in all location fields (City, State, ZIP/Postal Code, Country)");
      toast({ title: "Location validation failed", description: "Please complete all location details", variant: "destructive" });
      return;
    }
    
    setLocationError("");
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === "card") {
      if (!cardInfo.cardNumber || !cardInfo.expiry || !cardInfo.cvv || !cardInfo.name) {
        toast({ title: "Please fill in all card details", variant: "destructive" });
        return;
      }
    }
    
    setIsProcessing(true);
    
    try {
      const orderNum = `ORD-${Date.now().toString(36).toUpperCase()}`;
      const shippingLocation = shippingInfo.state.toLowerCase().includes("tamil") ? "Tamil Nadu" : "Outside Tamil Nadu";
      
      const orderData = {
        orderNumber: orderNum,
        userId: user?.uid || "guest",
        userEmail: shippingInfo.email,
        status: "pending",
        items: cartProducts.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shipping: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          location: shippingLocation,
        },
        paymentMethod,
        subtotal,
        shippingCost: shippingCost,
        shippingCostINR: shipping,
        tax,
        total,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, "orders"), orderData);
      
      await clearCart();
      setOrderNumber(orderNum);
      setOrderComplete(true);
      
    } catch (error: any) {
      console.error("Order error:", error);
      toast({ 
        title: "Error processing order", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div>
        <Header />
        <main className="container-kanva py-24">
          <div className="max-w-lg mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-heading mb-4" data-testid="text-empty-cart">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products to your cart before checking out.</p>
            <Button asChild data-testid="button-continue-shopping">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div>
        <Header />
        <main className="container-kanva py-24">
          <div className="max-w-lg mx-auto text-center">
            <CheckCircle className="h-20 w-20 mx-auto mb-6 text-green-500" />
            <h1 className="text-3xl font-heading mb-4" data-testid="text-order-success">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">Thank you for your order.</p>
            <p className="font-medium mb-6" data-testid="text-order-number">Order Number: {orderNumber}</p>
            <p className="text-sm text-muted-foreground mb-8">
              We've sent a confirmation email to {shippingInfo.email}
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline" data-testid="button-view-orders">
                <Link to="/account">View Orders</Link>
              </Button>
              <Button asChild data-testid="button-continue-shopping-success">
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container-kanva py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4" data-testid="button-back">
              <Link to="/shop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <h1 className="text-3xl font-heading" data-testid="text-checkout-title">Checkout</h1>
          </div>

          <div className="flex gap-2 mb-8">
            <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex-1 h-2 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name *</Label>
                          <Input
                            value={shippingInfo.firstName}
                            onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                            required
                            data-testid="input-first-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name *</Label>
                          <Input
                            value={shippingInfo.lastName}
                            onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                            required
                            data-testid="input-last-name"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email *</Label>
                          <Input
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                            required
                            data-testid="input-checkout-email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                            data-testid="input-checkout-phone"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Address *</Label>
                        <Input
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                          required
                          data-testid="input-checkout-address"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>City *</Label>
                          <Input
                            value={shippingInfo.city}
                            onChange={(e) => handleShippingChange("city", e.target.value)}
                            required
                            data-testid="input-checkout-city"
                            placeholder="e.g., Chennai, Bangalore"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>State/Province *</Label>
                          <Input
                            value={shippingInfo.state}
                            onChange={(e) => handleShippingChange("state", e.target.value)}
                            required
                            data-testid="input-checkout-state"
                            placeholder="e.g., Tamil Nadu, Karnataka"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ZIP/Postal Code *</Label>
                          <Input
                            value={shippingInfo.zipCode}
                            onChange={(e) => handleShippingChange("zipCode", e.target.value)}
                            required
                            data-testid="input-checkout-zip"
                            placeholder="e.g., 600001"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Country *</Label>
                          <Input
                            value={shippingInfo.country}
                            onChange={(e) => handleShippingChange("country", e.target.value)}
                            required
                            data-testid="input-checkout-country"
                            placeholder="e.g., India"
                          />
                        </div>
                      </div>
                      
                      {locationError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex gap-2">
                          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-600 dark:text-red-400">{locationError}</p>
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full" data-testid="button-continue-payment">
                        Continue to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center space-x-2 border rounded-md p-4">
                          <RadioGroupItem value="card" id="card" data-testid="radio-card" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer">Credit/Debit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-4">
                          <RadioGroupItem value="paypal" id="paypal" data-testid="radio-paypal" />
                          <Label htmlFor="paypal" className="flex-1 cursor-pointer">PayPal</Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-4">
                          <RadioGroupItem value="cod" id="cod" data-testid="radio-cod" />
                          <Label htmlFor="cod" className="flex-1 cursor-pointer">Cash on Delivery</Label>
                        </div>
                      </RadioGroup>

                      {paymentMethod === "card" && (
                        <div className="space-y-4 pt-4 border-t">
                          <div className="space-y-2">
                            <Label>Name on Card</Label>
                            <Input
                              value={cardInfo.name}
                              onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                              placeholder="John Doe"
                              data-testid="input-card-name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Card Number</Label>
                            <Input
                              value={cardInfo.cardNumber}
                              onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16)})}
                              placeholder="1234 5678 9012 3456"
                              data-testid="input-card-number"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Expiry Date</Label>
                              <Input
                                value={cardInfo.expiry}
                                onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                                placeholder="MM/YY"
                                data-testid="input-card-expiry"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>CVV</Label>
                              <Input
                                type="password"
                                value={cardInfo.cvv}
                                onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                                placeholder="123"
                                data-testid="input-card-cvv"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => setStep(1)} data-testid="button-back-shipping">
                          Back to Shipping
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isProcessing} data-testid="button-place-order">
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            `Place Order - ₹${total.toFixed(2)}`
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartProducts.map((item, index) => (
                    <div key={index} className="flex gap-3" data-testid={`checkout-item-${item.id}`}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <div className="text-right">
                        <span data-testid="text-shipping-cost">{shippingCost === 0 ? "Not calculated" : `₹${shippingCost}`}</span>
                        {isLocationValid && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {shippingInfo.state.toLowerCase().includes("tamil") ? "Tamil Nadu" : "Outside Tamil Nadu"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span data-testid="text-total">₹{total.toFixed(2)}</span>
                  </div>
                  
                  {!isLocationValid && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 text-center bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                      Complete location details to calculate shipping
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
