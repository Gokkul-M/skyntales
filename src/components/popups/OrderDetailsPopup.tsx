import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Package, Truck, CheckCircle2, Clock, MapPin, Phone, Mail, XCircle } from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface TrackingActivity {
  date: string;
  activity: string;
  location: string;
}

interface TrackingData {
  awb_code: string;
  courier_name: string;
  current_status: string;
  delivered_date?: string;
  activities: TrackingActivity[];
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  createdAt: any;
  items: OrderItem[];
  shipping: ShippingInfo;
  paymentDetails?: {
    paymentId: string;
    orderId: string;
    status: string;
  };
  shiprocketOrderId?: string;
  awbCode?: string;
}

interface OrderDetailsPopupProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "shipped":
    case "in transit":
      return <Truck className="h-5 w-5 text-blue-600" />;
    case "processing":
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case "cancelled":
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return <Package className="h-5 w-5 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "shipped":
    case "in transit":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const OrderDetailsPopup = ({ order, isOpen, onClose }: OrderDetailsPopupProps) => {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && order?.awbCode) {
      fetchTrackingData(order.awbCode);
    } else {
      setTracking(null);
      setTrackingError(null);
    }
  }, [isOpen, order?.awbCode]);

  const fetchTrackingData = async (awbCode: string) => {
    setLoadingTracking(true);
    setTrackingError(null);
    try {
      const response = await fetch(`/api/track-shipment/${awbCode}`);
      if (response.ok) {
        const data = await response.json();
        setTracking(data);
      } else {
        const errorData = await response.json();
        setTrackingError(errorData.error || "Unable to fetch tracking information");
      }
    } catch (error) {
      setTrackingError("Unable to connect to tracking service");
    } finally {
      setLoadingTracking(false);
    }
  };

  if (!order) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Recently";
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-heading">
              Order #{order.orderNumber}
            </DialogTitle>
            <Badge className={getStatusColor(order.status)}>
              <span className="flex items-center gap-1.5">
                {getStatusIcon(order.status)}
                {order.status}
              </span>
            </Badge>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </h3>
                {order.shipping ? (
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {order.shipping.firstName} {order.shipping.lastName}
                    </p>
                    <p>{order.shipping.address}</p>
                    <p>
                      {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                    </p>
                    <p>{order.shipping.country}</p>
                    <div className="pt-2 flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {order.shipping.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {order.shipping.email}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No shipping info available</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatPrice(order.shippingCost || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(order.tax || 0)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Shipment Tracking
              </h3>

              {!order.awbCode ? (
                <div className="bg-secondary/30 rounded-lg p-4 text-center">
                  <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Tracking information will be available once your order is shipped.
                  </p>
                </div>
              ) : loadingTracking ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : trackingError ? (
                <div className="bg-secondary/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">{trackingError}</p>
                </div>
              ) : tracking ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
                    <div>
                      <p className="text-sm text-muted-foreground">AWB Number</p>
                      <p className="font-mono font-medium">{tracking.awb_code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Courier</p>
                      <p className="font-medium">{tracking.courier_name}</p>
                    </div>
                  </div>

                  {tracking.activities && tracking.activities.length > 0 && (
                    <div className="relative pl-6">
                      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
                      {tracking.activities.map((activity, idx) => (
                        <div key={idx} className="relative pb-4 last:pb-0">
                          <div className={`absolute left-[-18px] w-3 h-3 rounded-full border-2 ${
                            idx === 0 ? "bg-primary border-primary" : "bg-background border-muted-foreground"
                          }`} />
                          <div>
                            <p className="font-medium text-sm">{activity.activity}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.location} • {activity.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {order.paymentDetails && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Payment Information</h3>
                  <div className="bg-secondary/30 rounded-lg p-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Payment ID</span>
                      <span className="font-mono text-xs">{order.paymentDetails.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {order.paymentDetails.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsPopup;
