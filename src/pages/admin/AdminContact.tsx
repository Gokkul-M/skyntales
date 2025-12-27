import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, MessageSquare, Clock, CheckCircle, AlertCircle, Loader2, Send, User, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "Open" | "In Progress" | "Resolved" | "Closed";
  priority?: "Low" | "Medium" | "High";
  createdAt: any;
  response?: string;
}

const AdminContact = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [response, setResponse] = useState("");
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    const contactsRef = collection(db, "contacts");
    const q = query(contactsRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData: Ticket[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        contactsData.push({
          id: doc.id,
          name: data.name || "Unknown",
          email: data.email || "",
          subject: data.subject || "No Subject",
          message: data.message || "",
          status: data.status || "new",
          priority: data.priority || "Medium",
          createdAt: data.createdAt,
          response: data.response,
        });
      });
      setTickets(contactsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching contacts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (ticketId: string, newStatus: Ticket["status"]) => {
    try {
      const ticketRef = doc(db, "contacts", ticketId);
      await updateDoc(ticketRef, { status: newStatus, updatedAt: serverTimestamp() });
      toast({ title: "Ticket updated", description: `Status changed to ${newStatus}` });
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({ title: "Error", description: "Failed to update ticket", variant: "destructive" });
    }
  };

  const sendResponse = async () => {
    if (!selectedTicket || !response.trim()) return;
    setIsResponding(true);
    
    try {
      const ticketRef = doc(db, "contacts", selectedTicket.id);
      await updateDoc(ticketRef, { 
        response, 
        status: "Resolved", 
        updatedAt: serverTimestamp() 
      });
      toast({ title: "Response sent", description: "The ticket has been resolved." });
      setResponse("");
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error sending response:", error);
      toast({ title: "Error", description: "Failed to send response", variant: "destructive" });
    } finally {
      setIsResponding(false);
    }
  };

  const getStatusIcon = (status: Ticket["status"]) => {
    switch (status) {
      case "new": 
      case "Open": return <AlertCircle size={16} />;
      case "In Progress": return <Clock size={16} />;
      case "Resolved": return <CheckCircle size={16} />;
      case "Closed": return <CheckCircle size={16} />;
    }
  };

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "new": 
      case "Open": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "In Progress": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Resolved": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Closed": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getPriorityColor = (priority?: Ticket["priority"]) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "Medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Low": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const openTickets = tickets.filter((t) => t.status === "new" || t.status === "Open").length;
  const inProgressTickets = tickets.filter((t) => t.status === "In Progress").length;
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading tickets...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground" data-testid="text-contact-title">Contact Messages</h1>
          <p className="text-muted-foreground text-sm">View and respond to customer inquiries</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground" data-testid="text-open-count">{openTickets}</p>
                <p className="text-xs text-muted-foreground">Open</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Clock className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground" data-testid="text-progress-count">{inProgressTickets}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground" data-testid="text-resolved-count">{resolvedTickets}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="text-primary" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground" data-testid="text-total-count">{tickets.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
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
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-tickets"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40" data-testid="select-status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground" data-testid="text-no-tickets">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">No contact messages found</h3>
                <p>Tickets will appear here when customers submit inquiries.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden" data-testid={`ticket-${ticket.id}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge variant="secondary" className={`${getStatusColor(ticket.status)} gap-1`}>
                                {getStatusIcon(ticket.status)}
                                {ticket.status}
                              </Badge>
                              {ticket.priority && (
                                <Badge variant="secondary" className={getPriorityColor(ticket.priority)}>
                                  {ticket.priority}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-foreground mb-1">{ticket.subject}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <User size={14} />
                                {ticket.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail size={14} />
                                <span className="truncate max-w-[200px]">{ticket.email}</span>
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{ticket.message}</p>
                            {ticket.response && (
                              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Your Response:</p>
                                <p className="text-sm text-green-600 dark:text-green-300">{ticket.response}</p>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {ticket.createdAt?.toDate?.()?.toLocaleDateString() || "Recent"}
                            </p>
                          </div>
                          <div className="flex sm:flex-col gap-2">
                            <Select 
                              value={ticket.status} 
                              onValueChange={(value) => updateStatus(ticket.id, value as Ticket["status"])}
                            >
                              <SelectTrigger className="w-28 h-9" data-testid={`select-status-${ticket.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => { setSelectedTicket(ticket); setResponse(ticket.response || ""); }}
                              data-testid={`button-respond-${ticket.id}`}
                            >
                              <Send size={14} className="mr-2" />
                              Respond
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Respond to Ticket</DialogTitle>
              <DialogDescription>{selectedTicket?.subject}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-muted-foreground" />
                    <span className="font-medium">{selectedTicket?.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedTicket?.message}</p>
                </CardContent>
              </Card>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Response</label>
                <Textarea
                  placeholder="Type your response..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={5}
                  data-testid="input-response"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedTicket(null)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button onClick={sendResponse} disabled={isResponding || !response.trim()} data-testid="button-send-response">
                  {isResponding ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send size={16} className="mr-2" />
                  )}
                  Send Response
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminContact;
