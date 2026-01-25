import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Star, ArrowUpRight, Loader2 } from "lucide-react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: any;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
}

interface Review {
  id: string;
  rating: number;
  productName: string;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Shipped": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "Processing": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Pending": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    case "Cancelled": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    orderCount: 0,
    productCount: 0,
    customerCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    
    const unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
      const orders: Order[] = [];
      let totalRevenue = 0;
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          customerName: data.customerName || data.shippingAddress?.fullName || "Unknown",
          customerEmail: data.customerEmail || data.email || "",
          total: data.total || 0,
          status: data.status || "Pending",
          createdAt: data.createdAt,
        });
        totalRevenue += data.total || 0;
      });
      
      orders.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setRecentOrders(orders.slice(0, 5));
      setStats(prev => ({
        ...prev,
        totalRevenue,
        orderCount: snapshot.size,
      }));
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    const usersRef = collection(db, "users");
    const unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
      setStats(prev => ({
        ...prev,
        customerCount: snapshot.size,
      }));
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    const productsRef = collection(db, "products");
    const productsQuery = query(productsRef, where("status", "==", "Active"));
    
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name || "",
          price: data.price || 0,
          stock: data.stock || 0,
          status: data.status || "Active",
        });
      });
      products.sort((a, b) => b.stock - a.stock);
      setTopProducts(products.slice(0, 4));
    }, (error) => {
      console.error("Error fetching products:", error);
    });

    const allProductsQuery = query(collection(db, "products"));
    const unsubscribeAllProducts = onSnapshot(allProductsQuery, (snapshot) => {
      setStats(prev => ({
        ...prev,
        productCount: snapshot.size,
      }));
    });

    const reviewsRef = collection(db, "reviews");
    const unsubscribeReviews = onSnapshot(reviewsRef, (snapshot) => {
      let totalRating = 0;
      let count = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.rating) {
          totalRating += data.rating;
          count++;
        }
      });
      setReviewCount(count);
      setAverageRating(count > 0 ? totalRating / count : 0);
      setLoading(false);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
      unsubscribeProducts();
      unsubscribeAllProducts();
      unsubscribeReviews();
    };
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "MMM d, yyyy");
    } catch {
      return "N/A";
    }
  };

  const statCards = [
    { title: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: "bg-green-500" },
    { title: "Orders", value: stats.orderCount.toString(), icon: ShoppingCart, color: "bg-blue-500" },
    { title: "Products", value: stats.productCount.toString(), icon: Package, color: "bg-purple-500" },
    { title: "Customers", value: stats.customerCount.toString(), icon: Users, color: "bg-orange-500" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm md:text-base">Welcome back! Here's what's happening with your store.</p>
          </div>
          <Badge variant="outline" className="w-fit">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
            Store Online
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <ArrowUpRight size={16} />
                      <span className="text-muted-foreground">Live data</span>
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <CardTitle className="font-heading text-lg">Recent Orders</CardTitle>
              <Badge variant="secondary" className="font-normal">
                {recentOrders.length} recent
              </Badge>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-1">
                  {recentOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.id.substring(0, 8)}... <span className="hidden sm:inline">- {formatDate(order.createdAt)}</span></p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <p className="font-semibold text-foreground whitespace-nowrap">{formatCurrency(order.total)}</p>
                        <Badge variant="secondary" className={`${getStatusStyles(order.status)} hidden sm:flex`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders yet</p>
                  <p className="text-sm">Orders will appear here when customers make purchases</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <CardTitle className="font-heading text-lg">Top Products</CardTitle>
              <Badge variant="secondary" className="font-normal">
                By stock level
              </Badge>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <div className="space-y-1">
                  {topProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="flex items-center gap-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-amber-600' : 'bg-primary/70'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
                      </div>
                      <p className="font-semibold text-foreground whitespace-nowrap">{formatCurrency(product.price)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No products yet</p>
                  <p className="text-sm">Add products in the Products section</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Star className="text-yellow-600 dark:text-yellow-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reviewCount > 0 ? `${reviewCount} reviews` : "No reviews yet"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.orderCount > 0 ? "Active" : "Getting Started"}
                  </p>
                  <p className="text-sm text-muted-foreground">Store Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.customerCount}</p>
                  <p className="text-sm text-muted-foreground">Unique Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
