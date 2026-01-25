import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Truck, ShoppingBag, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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

const validateLocation = (city: string, state: string, zipCode: string, country: string): boolean => {
  return city.trim() !== "" && state.trim() !== "" && zipCode.trim() !== "" && country.trim() !== "";
};

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const getApiUrl = (endpoint: string): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const isProduction = import.meta.env.PROD;
  
  if (isProduction && baseUrl) {
    return `${baseUrl}/api/${endpoint}.php`;
  } else if (isProduction) {
    return `/api/${endpoint}.php`;
  }
  return `/api/${endpoint}`;
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

  const cartProducts = cartItems;

  const subtotal = cartProducts.reduce((sum, item) => 
    sum + item.price * item.quantity, 0
  );
  
  const isLocationValid = validateLocation(shippingInfo.city, shippingInfo.state, shippingInfo.zipCode, shippingInfo.country);
  const shipping = isLocationValid ? calculateShippingCost(shippingInfo.state) : 0;
  const shippingCost = shipping;
  
  const total = subtotal + shippingCost;

  const handleShippingChange = (field: string, value: string) => {
    const updatedInfo = { ...shippingInfo, [field]: value };
    setShippingInfo(updatedInfo);
    
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

  const createOrderInFirebase = async (paymentDetails: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    const orderNum = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const shippingLocation = shippingInfo.state.toLowerCase().includes("tamil") ? "Tamil Nadu" : "Outside Tamil Nadu";
    
    const orderData = {
      orderNumber: orderNum,
      userId: user?.uid || "guest",
      userEmail: shippingInfo.email,
      status: "processing",
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
      paymentMethod: "razorpay",
      paymentDetails: {
        paymentId: paymentDetails.razorpay_payment_id,
        orderId: paymentDetails.razorpay_order_id,
        signature: paymentDetails.razorpay_signature,
        status: "paid",
      },
      subtotal,
      shippingCost: shippingCost,
      total,
      createdAt: serverTimestamp(),
    };
    
    await addDoc(collection(db, "orders"), orderData);
    return orderNum;
  };

  const handleRazorpayPayment = useCallback(async () => {
    if (!isLocationValid) {
      toast({ title: "Please complete shipping details first", variant: "destructive" });
      return;
    }

    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      const orderResponse = await fetch(getApiUrl('create-order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartProducts.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingState: shippingInfo.state,
          currency: 'INR'
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id || orderData.id,
        name: "Skyntales",
        description: `Order for ${cartProducts.length} item(s)`,
        image: "/logo.png",
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyResponse = await fetch(getApiUrl('verify-payment'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.status === 'success') {
              const orderNum = await createOrderInFirebase(response);
              await clearCart();
              setOrderNumber(orderNum);
              setOrderComplete(true);
              toast({ title: "Payment successful!", description: `Order ${orderNum} has been placed.` });
            } else {
              toast({ 
                title: "Payment verification failed", 
                description: "Please contact support with your payment ID: " + response.razorpay_payment_id,
                variant: "destructive" 
              });
            }
          } catch (error: any) {
            console.error("Order creation error:", error);
            toast({ 
              title: "Payment received but order creation failed", 
              description: "Please contact support with your payment ID: " + response.razorpay_payment_id,
              variant: "destructive" 
            });
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          contact: shippingInfo.phone || "",
        },
        notes: {
          address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`,
        },
        theme: {
          color: "#1a1a1a",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast({ title: "Payment cancelled", description: "You can try again when ready.", variant: "destructive" });
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", (response: any) => {
        setIsProcessing(false);
        toast({ 
          title: "Payment failed", 
          description: response.error?.description || "Please try again.",
          variant: "destructive" 
        });
      });
      razorpayInstance.open();
    } catch (error: any) {
      setIsProcessing(false);
      console.error("Payment error:", error);
      toast({ 
        title: "Could not initiate payment", 
        description: error.message || "Please try again.",
        variant: "destructive" 
      });
    }
  }, [total, shippingInfo, cartProducts, isLocationValid, clearCart, toast]);

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
            <h1 className="text-3xl font-heading mb-4" data-testid="text-order-success">Payment Successful!</h1>
            <p className="text-muted-foreground mb-2">Thank you for your order.</p>
            <p className="font-medium mb-6" data-testid="text-order-number">Order Number: {orderNumber}</p>
            <p className="text-sm text-muted-foreground mb-8">
              We've sent a confirmation email to {shippingInfo.email}
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline" data-testid="button-view-orders">
                <Link to="/account?view=orders">View Orders</Link>
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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container-kanva py-20 sm:py-24 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate(-1)}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-heading mb-8" data-testid="text-checkout-title">Checkout</h1>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                1
              </div>
              <span className="hidden sm:inline">Shipping</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? "bg-primary" : "bg-secondary"}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                2
              </div>
              <span className="hidden sm:inline">Payment</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name *</Label>
                          <Input
                            value={shippingInfo.firstName}
                            onChange={(e) => handleShippingChange("firstName", e.target.value)}
                            required
                            data-testid="input-checkout-firstname"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name *</Label>
                          <Input
                            value={shippingInfo.lastName}
                            onChange={(e) => handleShippingChange("lastName", e.target.value)}
                            required
                            data-testid="input-checkout-lastname"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email *</Label>
                          <Input
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) => handleShippingChange("email", e.target.value)}
                            required
                            data-testid="input-checkout-email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            type="tel"
                            value={shippingInfo.phone}
                            onChange={(e) => handleShippingChange("phone", e.target.value)}
                            data-testid="input-checkout-phone"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Address *</Label>
                        <Input
                          value={shippingInfo.address}
                          onChange={(e) => handleShippingChange("address", e.target.value)}
                          required
                          data-testid="input-checkout-address"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>City *</Label>
                          <Input
                            value={shippingInfo.city}
                            onChange={(e) => handleShippingChange("city", e.target.value)}
                            required
                            data-testid="input-checkout-city"
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
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <h3 className="font-medium mb-2">Shipping to:</h3>
                      <p className="text-sm text-muted-foreground">
                        {shippingInfo.firstName} {shippingInfo.lastName}<br />
                        {shippingInfo.address}<br />
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                        {shippingInfo.country}
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src="https://razorpay.com/assets/razorpay-glyph.svg" 
                          alt="Razorpay" 
                          className="h-8 w-8"
                        />
                        <div>
                          <h3 className="font-medium">Pay with Razorpay</h3>
                          <p className="text-sm text-muted-foreground">Secure payment via UPI, Cards, Netbanking & more</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">
                        You will be redirected to Razorpay's secure payment gateway to complete your purchase.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep(1)} 
                        data-testid="button-back-shipping"
                      >
                        Back to Shipping
                      </Button>
                      <Button 
                        type="button"
                        className="flex-1" 
                        disabled={isProcessing} 
                        onClick={handleRazorpayPayment}
                        data-testid="button-pay-now"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <CreditCard className="h-4 w-4 mr-2" />
                        )}
                        {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
                      </Button>
                    </div>
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
