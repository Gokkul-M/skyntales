import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Star, Trash2, Loader2, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Review {
  id: string;
  customer: string;
  customerEmail?: string;
  product: string;
  productId?: number;
  rating: number;
  comment: string;
  createdAt: any;
  status: "Published" | "Pending" | "Hidden";
}

const AdminFeedback = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData: Review[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        reviewsData.push({
          id: doc.id,
          customer: data.customer || data.userName || "Anonymous",
          customerEmail: data.customerEmail || data.userEmail,
          product: data.product || data.productName || "Unknown Product",
          productId: data.productId,
          rating: data.rating || 5,
          comment: data.comment || data.review || "",
          createdAt: data.createdAt,
          status: data.status || "Pending",
        });
      });
      setReviews(reviewsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === "all" || review.rating === parseInt(ratingFilter);
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const updateStatus = async (id: string, newStatus: Review["status"]) => {
    try {
      const reviewRef = doc(db, "reviews", id);
      await updateDoc(reviewRef, { status: newStatus, updatedAt: serverTimestamp() });
      toast({ title: "Review updated", description: `Review status changed to ${newStatus}` });
    } catch (error) {
      console.error("Error updating review:", error);
      toast({ title: "Error", description: "Failed to update review", variant: "destructive" });
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      await deleteDoc(doc(db, "reviews", id));
      toast({ title: "Review deleted", description: "The review has been removed." });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({ title: "Error", description: "Failed to delete review", variant: "destructive" });
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
    
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100 : 0,
  }));

  const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"}
      />
    ));
  };

  const getStatusColor = (status: Review["status"]) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Hidden": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground" data-testid="text-feedback-title">Feedback & Reviews</h1>
          <p className="text-muted-foreground text-sm">Manage customer reviews and ratings</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Star className="text-yellow-600 dark:text-yellow-400 fill-yellow-500" size={28} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground" data-testid="text-avg-rating">{averageRating}</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground mb-3">Rating Distribution</p>
              <div className="space-y-2">
                {ratingCounts.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-xs w-4 text-right">{rating}</span>
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-foreground" data-testid="text-total-reviews">{reviews.length}</p>
              <p className="text-sm text-muted-foreground mb-3">Total Reviews</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">
                    {reviews.filter(r => r.status === "Published").length} Published
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="text-xs text-muted-foreground">
                    {reviews.filter(r => r.status === "Pending").length} Pending
                  </span>
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
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-reviews"
                />
              </div>
              <div className="flex gap-2">
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-full sm:w-32" data-testid="select-rating-filter">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground" data-testid="text-no-reviews">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                <p>Reviews will appear here once customers leave feedback.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <Card key={review.id} className="overflow-hidden" data-testid={`review-${review.id}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-medium">{review.customer}</span>
                            <span className="text-muted-foreground">reviewed</span>
                            <span className="font-medium truncate">{review.product}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">{renderStars(review.rating, 14)}</div>
                            <Badge variant="secondary" className={getStatusColor(review.status)}>
                              {review.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {review.createdAt?.toDate?.()?.toLocaleDateString() || "Recent"}
                          </p>
                        </div>
                        <div className="flex sm:flex-col gap-2">
                          <Select 
                            value={review.status} 
                            onValueChange={(v) => updateStatus(review.id, v as Review["status"])}
                          >
                            <SelectTrigger className="w-28 h-9" data-testid={`select-review-status-${review.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Published">Published</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Hidden">Hidden</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => deleteReview(review.id)}
                            data-testid={`button-delete-review-${review.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFeedback;
