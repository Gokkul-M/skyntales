import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Search, Eye, Ban, CheckCircle, Users, DollarSign, ShoppingBag, Loader2, MoreVertical, Mail, Phone, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface User {
  id: string;
  displayName: string;
  email: string;
  phone?: string;
  createdAt: any;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  orderCount?: number;
  totalSpent?: number;
  status?: "Active" | "Suspended";
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData: User[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          id: doc.id,
          displayName: data.displayName || data.name || "User",
          email: data.email || "",
          phone: data.phone,
          createdAt: data.createdAt,
          address: data.address,
          orderCount: data.orderCount || 0,
          totalSpent: data.totalSpent || 0,
          status: data.status || "Active",
        });
      });
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (userId: string) => {
    setUsers(users.map((u) => 
      u.id === userId 
        ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } 
        : u
    ));
    const user = users.find((u) => u.id === userId);
    toast({ 
      title: "User updated", 
      description: `${user?.displayName} has been ${user?.status === "Active" ? "suspended" : "reactivated"}.` 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const totalRevenue = users.reduce((sum, u) => sum + (u.totalSpent || 0), 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm">Manage customer accounts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeUsers}</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <DollarSign className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalRevenue.toFixed(2)} EUR</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
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
                  placeholder="Search users..." 
                  className="pl-10" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">No users found</h3>
                <p>Users will appear here when they create accounts.</p>
              </div>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Orders</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total Spent</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                  {getInitials(user.displayName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">{user.displayName}</p>
                                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-foreground">{user.orderCount || 0}</td>
                          <td className="py-4 px-4 font-medium text-foreground">{(user.totalSpent || 0).toFixed(2)} EUR</td>
                          <td className="py-4 px-4">
                            <Badge variant="secondary" className={
                              user.status === "Active" 
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                                <Eye size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => toggleStatus(user.id)}>
                                {user.status === "Active" ? (
                                  <Ban size={16} className="text-destructive" />
                                ) : (
                                  <CheckCircle size={16} className="text-green-600" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {getInitials(user.displayName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">{user.displayName}</p>
                                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleStatus(user.id)}>
                                    {user.status === "Active" ? (
                                      <>
                                        <Ban className="h-4 w-4 mr-2" />
                                        Suspend User
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Activate User
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant="secondary" className={
                                user.status === "Active" 
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }>
                                {user.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {user.orderCount || 0} orders
                              </span>
                              <span className="text-sm font-medium">
                                {(user.totalSpent || 0).toFixed(2)} EUR
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                      {getInitials(selectedUser.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl font-semibold text-foreground">{selectedUser.displayName}</p>
                    <Badge variant="secondary" className={
                      selectedUser.status === "Active" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{selectedUser.email}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedUser.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Joined {selectedUser.createdAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold text-foreground">{selectedUser.orderCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Total Orders</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-2xl font-bold text-foreground">{(selectedUser.totalSpent || 0).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Total Spent (EUR)</p>
                    </CardContent>
                  </Card>
                </div>

                {selectedUser.address && (selectedUser.address.street || selectedUser.address.city) && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Address</p>
                      <p className="text-sm text-foreground">
                        {selectedUser.address.street && <>{selectedUser.address.street}<br /></>}
                        {selectedUser.address.city && <>{selectedUser.address.city}, </>}
                        {selectedUser.address.state && <>{selectedUser.address.state} </>}
                        {selectedUser.address.zipCode && <>{selectedUser.address.zipCode}</>}
                        {selectedUser.address.country && <><br />{selectedUser.address.country}</>}
                      </p>
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <Button onClick={() => setSelectedUser(null)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
