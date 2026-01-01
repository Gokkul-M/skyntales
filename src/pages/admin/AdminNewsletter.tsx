import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2, Loader2, Users, Mail, Search, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: any;
  status: "active" | "unsubscribed";
}

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
  });

  useEffect(() => {
    const subscribersRef = collection(db, "newsletterSubscribers");
    const q = query(subscribersRef);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subscribersData: Subscriber[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        subscribersData.push({
          id: doc.id,
          email: data.email || "",
          subscribedAt: data.subscribedAt,
          status: data.status || "active",
        });
      });
      subscribersData.sort((a, b) => {
        const dateA = a.subscribedAt?.toDate?.() || new Date(0);
        const dateB = b.subscribedAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setSubscribers(subscribersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSubscribers = subscribers.filter(sub => sub.status === "active");

  const handleSelectAll = () => {
    if (selectedEmails.size === filteredSubscribers.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(filteredSubscribers.map(s => s.email)));
    }
  };

  const handleSelectEmail = (email: string) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(email)) {
      newSelected.delete(email);
    } else {
      newSelected.add(email);
    }
    setSelectedEmails(newSelected);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    
    try {
      await deleteDoc(doc(db, "newsletterSubscribers", id));
      toast({ title: "Success", description: "Subscriber removed" });
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast({ title: "Error", description: "Failed to remove subscriber", variant: "destructive" });
    }
  };

  const handleToggleStatus = async (subscriber: Subscriber) => {
    const newStatus = subscriber.status === "active" ? "unsubscribed" : "active";
    try {
      await updateDoc(doc(db, "newsletterSubscribers", subscriber.id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      toast({ 
        title: "Success", 
        description: `Subscriber ${newStatus === "active" ? "activated" : "unsubscribed"}` 
      });
    } catch (error) {
      console.error("Error updating subscriber:", error);
      toast({ title: "Error", description: "Failed to update subscriber", variant: "destructive" });
    }
  };

  const handleSendNewsletter = async () => {
    if (!emailData.subject.trim() || !emailData.message.trim()) {
      toast({ title: "Error", description: "Subject and message are required", variant: "destructive" });
      return;
    }

    const recipientEmails = selectedEmails.size > 0 
      ? Array.from(selectedEmails)
      : activeSubscribers.map(s => s.email);

    if (recipientEmails.length === 0) {
      toast({ title: "Error", description: "No recipients selected", variant: "destructive" });
      return;
    }

    setIsSending(true);
    
    try {
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipientEmails,
          subject: emailData.subject,
          message: emailData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send newsletter');
      }

      toast({
        title: "Newsletter Sent!",
        description: `Successfully sent to ${data.sent} subscriber${data.sent !== 1 ? 's' : ''}${data.failed > 0 ? `. ${data.failed} failed.` : ''}`,
      });

      setIsComposeOpen(false);
      setEmailData({ subject: "", message: "" });
      setSelectedEmails(new Set());
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "MMM d, yyyy");
    } catch {
      return "Unknown";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Newsletter</h1>
            <p className="text-muted-foreground">Manage subscribers and send newsletters</p>
          </div>
          <Button onClick={() => setIsComposeOpen(true)} className="gap-2">
            <Send size={16} />
            Compose Newsletter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{subscribers.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{activeSubscribers.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Selected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{selectedEmails.size}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Subscribers</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No subscribers yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Checkbox
                    checked={selectedEmails.size === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium">Select All ({filteredSubscribers.length})</span>
                </div>
                
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {filteredSubscribers.map((subscriber) => (
                      <div
                        key={subscriber.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedEmails.has(subscriber.email)}
                            onCheckedChange={() => handleSelectEmail(subscriber.email)}
                          />
                          <div>
                            <p className="font-medium">{subscriber.email}</p>
                            <p className="text-sm text-muted-foreground">
                              Subscribed: {formatDate(subscriber.subscribedAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={subscriber.status === "active" ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => handleToggleStatus(subscriber)}
                          >
                            {subscriber.status === "active" ? (
                              <><CheckCircle2 className="h-3 w-3 mr-1" /> Active</>
                            ) : (
                              <><XCircle className="h-3 w-3 mr-1" /> Unsubscribed</>
                            )}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(subscriber.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compose Newsletter</DialogTitle>
            <DialogDescription>
              Send a newsletter to {selectedEmails.size > 0 ? selectedEmails.size : activeSubscribers.length} subscriber{(selectedEmails.size > 0 ? selectedEmails.size : activeSubscribers.length) !== 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Newsletter subject..."
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Write your newsletter content..."
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                rows={10}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendNewsletter} disabled={isSending} className="gap-2">
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Newsletter
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminNewsletter;
