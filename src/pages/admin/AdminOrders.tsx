import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Package, Truck, CheckCircle, Clock, Loader2, Eye, XCircle, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    state?: string;
    zipCode: string;
    country?: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  createdAt: any;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          id: doc.id,
          orderNumber: data.orderNumber || doc.id.slice(0, 8).toUpperCase(),
          userId: data.userId || "",
          userEmail: data.userEmail || data.shipping?.email || "",
          status: data.status || "pending",
          items: data.items || [],
          shipping: data.shipping || {},
          subtotal: data.subtotal || 0,
          shippingCost: data.shippingCost || 0,
          tax: data.tax || 0,
          total: data.total || 0,
          createdAt: data.createdAt,
        });
      });
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shipping.firstName + " " + order.shipping.lastName).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus, updatedAt: serverTimestamp() });
      toast({ title: "Order updated", description: `Order status changed to ${newStatus}` });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({ title: "Error", description: "Failed to update order", variant: "destructive" });
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending": return <Clock size={16} />;
      case "processing": return <Package size={16} />;
      case "shipped": return <Truck size={16} />;
      case "delivered": return <CheckCircle size={16} />;
      case "cancelled": return <XCircle size={16} />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "processing": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "shipped": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "delivered": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "cancelled": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const processingOrders = orders.filter(o => o.status === "processing").length;
  const shippedOrders = orders.filter(o => o.status === "shipped").length;
  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground" data-testid="text-orders-title">Orders</h1>
          <p className="text-muted-foreground text-sm">Manage customer orders</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                <Clock className="text-yellow-600 dark:text-yellow-400" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground" data-testid="text-pending-count">{pendingOrders}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Package className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground" data-testid="text-processing-count">{processingOrders}</p>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <Truck className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground" data-testid="text-shipped-count">{shippedOrders}</p>
                <p className="text-xs text-muted-foreground">Shipped</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-foreground truncate" data-testid="text-revenue">{totalRevenue.toFixed(2)} EUR</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-orders"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40" data-testid="select-order-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground" data-testid="text-no-orders">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p>Orders will appear here once customers make purchases.</p>
              </div>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Order</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Items</th>
                        <th className="pb-3 font-medium">Total</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="text-sm" data-testid={`order-row-${order.id}`}>
                          <td className="py-4">
                            <p className="font-medium font-mono">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.createdAt?.toDate?.()?.toLocaleDateString() || "Recent"}
                            </p>
                          </td>
                          <td className="py-4">
                            <p className="font-medium">{order.shipping.firstName} {order.shipping.lastName}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{order.userEmail}</p>
                          </td>
                          <td className="py-4">{order.items.length} items</td>
                          <td className="py-4 font-semibold">{order.total.toFixed(2)} EUR</td>
                          <td className="py-4">
                            <Badge variant="secondary" className={`${getStatusColor(order.status)} gap-1`}>
                              {getStatusIcon(order.status)}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedOrder(order)}
                                data-testid={`button-view-order-${order.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Select 
                                value={order.status} 
                                onValueChange={(v) => updateStatus(order.id, v as Order["status"])}
                              >
                                <SelectTrigger className="w-28 h-9" data-testid={`select-order-status-${order.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden" data-testid={`order-card-${order.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-mono font-semibold">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.createdAt?.toDate?.()?.toLocaleDateString() || "Recent"}
                            </p>
                          </div>
                          <Badge variant="secondary" className={`${getStatusColor(order.status)} gap-1`}>
                            {getStatusIcon(order.status)}
                            <span className="hidden xs:inline">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Customer</span>
                            <span className="font-medium">{order.shipping.firstName} {order.shipping.lastName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Items</span>
                            <span>{order.items.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total</span>
                            <span className="font-semibold">{order.total.toFixed(2)} EUR</span>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Select 
                            value={order.status} 
                            onValueChange={(v) => updateStatus(order.id, v as Order["status"])}
                          >
                            <SelectTrigger className="flex-1 h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                Order #{selectedOrder?.orderNumber}
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-6 pr-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`${getStatusColor(selectedOrder.status)} gap-1`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {selectedOrder.createdAt?.toDate?.()?.toLocaleDateString() || "Recent"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Customer Information</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1">
                        <p className="font-medium">{selectedOrder.shipping.firstName} {selectedOrder.shipping.lastName}</p>
                        <p className="text-muted-foreground">{selectedOrder.userEmail}</p>
                        {selectedOrder.shipping.phone && (
                          <p className="text-muted-foreground">{selectedOrder.shipping.phone}</p>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Shipping Address</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1">
                        <p>{selectedOrder.shipping.address}</p>
                        <p>{selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.zipCode}</p>
                        {selectedOrder.shipping.country && (
                          <p>{selectedOrder.shipping.country}</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex gap-3 items-center p-3 bg-muted/50 rounded-lg">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} EUR</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{selectedOrder.subtotal.toFixed(2)} EUR</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{selectedOrder.shippingCost === 0 ? "Free" : `${selectedOrder.shippingCost.toFixed(2)} EUR`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>{selectedOrder.tax.toFixed(2)} EUR</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{selectedOrder.total.toFixed(2)} EUR</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button onClick={() => setSelectedOrder(null)} data-testid="button-close-order-details">
                      Close
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
